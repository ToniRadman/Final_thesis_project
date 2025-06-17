const { PrismaClient } = require('@prisma/client');
const { convertBigInts } = require('../utils/convertBigInts'); 
const prisma = new PrismaClient();

// 🔧 Helper za status boje
function getStatusColor(status) {
  switch (status) {
    case 'Dostupno':
      return 'green';
    case 'Rezervirano':
      return 'yellow';
    case 'Prodano':
      return 'red';
    default:
      return 'gray';
  }
}

async function getAllCars(req, res) {
  try {
    const {
      page = 1,
      pageSize = 10,
      make,
      model,
      category,
      yearFrom,
      yearTo,
      priceMin,
      priceMax
    } = req.query;

    const filters = {};

    const { search } = req.query;

    if (search) {
      filters.OR = [
        { make: { contains: search, mode: 'insensitive' } },
        { model: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (make) filters.make = { contains: make, mode: 'insensitive' };
    if (model) filters.model = { contains: model, mode: 'insensitive' };

    if (category && Object.values(['SUV', 'LIMUZINA', 'KOMBI', 'HATCHBACK', 'KARAVAN', 'PICKUP', 'COUPE', 'KABRIOLET']).includes(category)) {
      filters.category = category;
    }

    if (yearFrom || yearTo) {
      filters.year = {};
      if (yearFrom) filters.year.gte = Number(yearFrom);
      if (yearTo) filters.year.lte = Number(yearTo);
    }

    if (priceMin || priceMax) {
      filters.price = {};
      if (priceMin) filters.price.gte = Number(priceMin);
      if (priceMax) filters.price.lte = Number(priceMax);
    }

    const cars = await prisma.car.findMany({
      where: filters,
      skip: (Number(page) - 1) * Number(pageSize),
      take: Number(pageSize),
      orderBy: { id: 'asc' },
    });

    const total = await prisma.car.count({ where: filters });

    const data = cars.map(car => ({
      ...car,
      statusColor: getStatusColor(car.status),
      name: `${car.make} ${car.model}`,
    }));

    res.json(convertBigInts({
      data,
      total,
    }));
  } catch (error) {
    console.error('Greška u getAllCars:', error);
    res.status(500).json({ message: 'Greška na serveru prilikom dohvaćanja vozila.' });
  }
}

async function getCarById(req, res) {
  const { id } = req.params;

  if (!id || isNaN(id)) {
    return res.status(400).json({ message: 'Neispravan ID vozila' });
  }

  try {
    const car = await prisma.car.findUnique({
      where: { id: BigInt(id) },
      include: {
        //sales: true,
        inventory: true,
        services: true,
        bookings: true, // rezervacije
      },
    });

    if (!car) {
      return res.status(404).json({ message: 'Vozilo nije pronađeno' });
    }

    // Izračun dostupnosti: nema aktivnih rezervacija sa statusom PENDING ili CONFIRMED
    const available = !car.bookings.some(
      (booking) => booking.status === 'PENDING' || booking.status === 'CONFIRMED'
    );

    // Pripremi objekt za frontend s poljima koja koristi
    const carForFrontend = {
      id: car.id.toString(),            // string jer frontend obično to očekuje
      make: car.make,
      model: car.model,
      year: car.year,
      km: car.km,               // uskladi ime s frontendom
      fuel: car.fuel,               // uskladi ime s frontendom
      price: car.price,
      imagePath: car.imagePath,         // može biti string ili null
      images: car.imagePath ? [car.imagePath] : [],
      available,
      status: car.status,
      statusColor: getStatusColor(car.status),
      // možeš dodati ostale relacije ako trebaš (sales, inventory, services) po potrebi
    };

    res.json(convertBigInts(carForFrontend));
  } catch (error) {
    console.error('Greška u getCarById:', error);
    res.status(500).json({ message: 'Greška na serveru prilikom dohvaćanja vozila' });
  }
}

async function createCar(req, res) {
  const {
    make,
    model,
    category,
    year,
    price,
    status,
    fuel,
    km,
    imagePath, // Promijenjeno s 'image' na 'imagePath' prema shemi
  } = req.body;

  // Validacija obaveznih polja
  if (!make || !model || !category || !year || !price) {
    return res.status(400).json({ 
      message: 'Nedostaju obavezna polja: make, model, category, year, price' 
    });
  }

  // Provjeri da li je category valjan enum
  if (!Object.values(['SUV', 'LIMUZINA', 'KOMBI', 'HATCHBACK', 'KARAVAN', 'PICKUP', 'COUPE', 'KABRIOLET']).includes(category)) {
    return res.status(400).json({ message: 'Neispravna kategorija vozila' });
  }

  try {
    const newCar = await prisma.car.create({
      data: {
        make,
        model,
        category, // Sada je enum
        year: Number(year),
        price: Number(price),
        status,
        fuel,
        km: km ? Number(km) : null,
        imagePath,
        inventory: {
          create: {
            quantity: initialQuantity || 0
          }
        }
      },
    });

    const carWithColor = {
      ...newCar,
      statusColor: getStatusColor(newCar.status),
    };

    res.status(201).json(convertBigInts(carWithColor));
  } catch (error) {
    console.error('Greška u createCar:', error);
    res.status(500).json({ message: 'Greška na serveru prilikom stvaranja vozila' });
  }
}

async function updateCar(req, res) {
  const { id } = req.params;
  const { make, model, category, year, price, status, fuel, km, imagePath } = req.body;
  
  if (!id || isNaN(id)) {
    return res.status(400).json({ message: 'Neispravan ID vozila' });
  }
  
  try {
    // Provjeri da li vozilo postoji
    const existingCar = await prisma.car.findUnique({
      where: { id: BigInt(id) }
    });
    
    if (!existingCar) {
      return res.status(404).json({ message: 'Vozilo nije pronađeno' });
    }

    // Pripremi podatke za update (samo postojeće vrijednosti)
    const updateData = {};
    if (make !== undefined) updateData.make = make;
    if (model !== undefined) updateData.model = model;
    if (category !== undefined) {
      // Provjeri da li je category valjan enum
      if (Object.values(['SUV', 'LIMUZINA', 'KOMBI', 'HATCHBACK', 'KARAVAN', 'PICKUP', 'COUPE', 'KABRIOLET']).includes(category)) {
        updateData.category = category;
      } else {
        return res.status(400).json({ message: 'Neispravna kategorija vozila' });
      }
    }
    if (year !== undefined) updateData.year = Number(year);
    if (price !== undefined) updateData.price = Number(price);
    if (status !== undefined) updateData.status = status;
    if (fuel !== undefined) updateData.fuel = fuel;
    if (km !== undefined) updateData.km = Number(km);
    if (imagePath !== undefined) updateData.imagePath = imagePath;

    const updatedCar = await prisma.car.update({
      where: { id: BigInt(id) },
      data: updateData,
    });

    const carWithColor = {
      ...updatedCar,
      statusColor: getStatusColor(updatedCar.status),
    };

    res.json(convertBigInts(carWithColor));
  } catch (error) {
    console.error('Greška u updateCar:', error);
    res.status(500).json({ message: 'Greška na serveru prilikom ažuriranja vozila' });
  }
}

async function deleteCar(req, res) {
  const { id } = req.params;
  
  if (!id || isNaN(id)) {
    return res.status(400).json({ message: 'Neispravan ID vozila' });
  }
  
  try {
    // Provjeri da li vozilo postoji
    const existingCar = await prisma.car.findUnique({
      where: { id: BigInt(id) }
    });
    
    if (!existingCar) {
      return res.status(404).json({ message: 'Vozilo nije pronađeno' });
    }

    await prisma.car.delete({ 
      where: { id: BigInt(id) } 
    });
    
    res.json({ message: 'Vozilo uspješno obrisano' });
  } catch (error) {
    console.error('Greška u deleteCar:', error);
    
    // Provjeri da li je greška zbog foreign key constrainta
    if (error.code === 'P2003') {
      res.status(400).json({ 
        message: 'Vozilo se ne može obrisati jer je povezano s drugim zapisima' 
      });
    } else {
      res.status(500).json({ message: 'Greška na serveru prilikom brisanja vozila' });
    }
  }
}

async function uploadCarImage(req, res) {
  try {
    const { id } = req.params;
    
    if (!id || isNaN(id)) {
      return res.status(400).json({ message: 'Neispravan ID vozila' });
    }
    
    if (!req.file) {
      return res.status(400).json({ message: 'Nema uploadane slike' });
    }

    const carId = BigInt(id);
    const imagePath = req.file.path;

    // Provjeri da li vozilo postoji
    const existingCar = await prisma.car.findUnique({
      where: { id: carId }
    });
    
    if (!existingCar) {
      return res.status(404).json({ message: 'Vozilo nije pronađeno' });
    }

    await prisma.car.update({
      where: { id: carId },
      data: { imagePath }, // Koristi 'imagePath' prema shemi
    });

    res.json({ 
      message: 'Slika uspješno uploadana', 
      path: imagePath 
    });
  } catch (error) {
    console.error('Greška prilikom spremanja slike:', error);
    res.status(500).json({ message: 'Greška prilikom uploadanja slike' });
  }
}

async function getCarFilters(req, res) {
  try {
    // Dohvati sve aute s potrebnim poljima
    const cars = await prisma.car.findMany({
      select: {
        make: true,
        model: true,
        category: true,
        year: true,
      },
    });

    // Setovi za jedinstvene vrijednosti
    const brandsSet = new Set();
    const categoriesSet = new Set();
    const yearsSet = new Set();
    const modelsByBrand = {};

    for (const car of cars) {
      if (car.make) {
        brandsSet.add(car.make);

        if (!modelsByBrand[car.make]) {
          modelsByBrand[car.make] = new Set();
        }

        if (car.model) {
          modelsByBrand[car.make].add(car.model);
        }
      }

      if (car.category) {
        categoriesSet.add(car.category);
      }

      if (car.year !== null) {
        yearsSet.add(car.year);
      }
    }

    const brands = Array.from(brandsSet).sort();
    const categories = Array.from(categoriesSet).sort();
    const years = Array.from(yearsSet).sort((a, b) => b - a);

    const models = {};
    for (const make in modelsByBrand) {
      models[make] = Array.from(modelsByBrand[make]).sort();
    }

    res.json({
      brands,
      models,
      categories,
      years,
    });
  } catch (error) {
    console.error('Greška pri dohvaćanju filtera:', error);

    res.status(500).json({
      brands: [],
      models: {},
      categories: ['SUV', 'LIMUZINA', 'KOMBI', 'HATCHBACK', 'KARAVAN', 'PICKUP', 'COUPE', 'KABRIOLET'],
      years: [],
      error: 'Greška pri dohvaćanju filtera iz baze',
    });
  }
}

module.exports = {
  getAllCars,
  getCarById,
  createCar,
  updateCar,
  deleteCar,
  uploadCarImage,
  getCarFilters
};