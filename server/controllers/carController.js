const { PrismaClient } = require('@prisma/client');
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

// 🔧 Helper za konverziju BigInt vrijednosti
function convertBigInts(obj) {
  if (Array.isArray(obj)) {
    return obj.map(convertBigInts);
  } else if (obj !== null && typeof obj === 'object') {
    const newObj = {};
    for (const key in obj) {
      newObj[key] = convertBigInts(obj[key]);
    }
    return newObj;
  } else if (typeof obj === 'bigint') {
    return obj.toString();
  } else {
    return obj;
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

    if (make) filters.make = { contains: make, mode: 'insensitive' };
    if (model) filters.model = { contains: model, mode: 'insensitive' };
    if (category) filters.category = Number(category);
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
      skip: (page - 1) * pageSize,
      take: Number(pageSize),
      orderBy: { id: 'asc' },
    });

    const total = await prisma.car.count({ where: filters });

    const data = cars.map(car => ({
      ...car,
      statusColor: getStatusColor(car.status),
    }));

    res.json(convertBigInts({
      data,
      pagination: {
        total,
        page: Number(page),
        pageSize: Number(pageSize),
        totalPages: Math.ceil(total / pageSize),
      },
    }));
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Greška na serveru prilikom dohvaćanja vozila.' });
  }
}

async function getCarById(req, res) {
  const { id } = req.params;
  try {
    const car = await prisma.car.findUnique({
      where: { id: BigInt(id) },
      include: {
        sales: true,
        inventory: true,
        services: true,
        bookings: true, // ✅ ispravno
      },
    });

    if (!car) return res.status(404).json({ message: 'Vozilo nije pronađeno' });

    const carWithColor = {
      ...car,
      statusColor: getStatusColor(car.status),
    };

    res.json(convertBigInts(carWithColor));
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Greška na serveru' });
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
    image,
    isNew
  } = req.body;

  try {
    const newCar = await prisma.car.create({
      data: {
        make,
        model,
        category,
        year,
        price,
        status,
        fuel,
        km,
        image,
        isNew,
      },
    });

    const carWithColor = {
      ...newCar,
      statusColor: getStatusColor(newCar.status),
    };

    res.status(201).json(convertBigInts(carWithColor));
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Greška na serveru' });
  }
}

async function updateCar(req, res) {
  const { id } = req.params;
  const { make, model, category, year, price } = req.body;
  try {
    const updatedCar = await prisma.car.update({
      where: { id: Number(id) },
      data: { make, model, category, year, price },
    });

    const carWithColor = {
      ...updatedCar,
      statusColor: getStatusColor(updatedCar.status),
    };

    res.json(convertBigInts(carWithColor));
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Greška na serveru' });
  }
}

async function deleteCar(req, res) {
  const { id } = req.params;
  try {
    await prisma.car.delete({ where: { id: Number(id) } });
    res.json({ message: 'Vozilo obrisano' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Greška na serveru' });
  }
}

async function uploadCarImage(req, res) {
  try {
    const carId = BigInt(req.params.id);
    const imagePath = req.file.path;

    await prisma.car.update({
      where: { id: carId },
      data: { imagePath },
    });

    res.json({ message: 'Slika uspješno uploadana', path: imagePath });
  } catch (error) {
    console.error('Greška prilikom spremanja slike:', error);
    res.status(500).json({ message: 'Greška prilikom uploadanja slike' });
  }
}

module.exports = {
  getAllCars,
  getCarById,
  createCar,
  updateCar,
  deleteCar,
  uploadCarImage,
};