// controllers/partController.js
const { PrismaClient, Prisma } = require('@prisma/client');
const { convertBigInts } = require('../utils/convertBigInts');
const prisma = new PrismaClient();

// Konverzija Decimal polja (jer Prisma koristi Decimal.js objekt)
function serializePart(part) {
  return {
    ...part,
    price: part.price.toString(),
  };
}

const getAllParts = async (req, res) => {
  try {
    const {
      id,
      name,
      category,
      supplierId,
      priceMin,
      priceMax,
      availableOnly,
      page = 1,
      pageSize = 10,
    } = req.query;

    const filters = {};

    if (id && /^\d+$/.test(id)) {
      const part = await prisma.part.findUnique({
        where: {
          id: parseInt(id, 10),
        },
        include: {
          supplier: true,
        },
      });

      if (!part) {
        return res.status(404).json({ data: [], total: 0 });
      }

      return res.json(convertBigInts({
        data: [serializePart(part)],
        total: 1,
      }));
    }

    if (name) {
      filters.name = {
        contains: name,
        mode: 'insensitive',
      };
    }

    if (category) {
      filters.category = category;
    }

    if (supplierId) {
      filters.supplierId = BigInt(supplierId);
    }

    if (priceMin || priceMax) {
      filters.price = {};
      if (priceMin) filters.price.gte = new Prisma.Decimal(priceMin);
      if (priceMax) filters.price.lte = new Prisma.Decimal(priceMax);
    }

    // Dohvati sve dijelove koji zadovoljavaju osnovne filtre (bez paginacije još)
    const allParts = await prisma.part.findMany({
      where: filters,
      include: {
        supplier: true,
      },
    });

    // Dohvati dostupnost za svaki dio
    const partsWithAvailability = await Promise.all(
      allParts.map(async (part) => {
        const inventorySum = await prisma.inventory.aggregate({
          _sum: { quantity: true },
          where: { partId: part.id },
        });

        const available = (inventorySum._sum.quantity ?? 0) > 0;

        return {
          ...serializePart(part),
          available,
        };
      })
    );

    // Ako je uključeno filtriranje po dostupnosti, primijeni ga
    const onlyAvailable = availableOnly === 'true';
    const filteredParts = onlyAvailable
      ? partsWithAvailability.filter(part => part.available)
      : partsWithAvailability;

    const total = filteredParts.length;

    // Primijeni paginaciju nad filtriranim podacima
    const pageNum = Number(page);
    const size = Number(pageSize);
    const paginatedParts = filteredParts.slice((pageNum - 1) * size, pageNum * size);

    res.json(convertBigInts({
      data: paginatedParts,
      total,
      page: pageNum,
      pageSize: size,
    }));
  } catch (error) {
    console.error('Greška kod dohvaćanja dijelova:', error);
    res.status(500).json({ message: 'Greška kod dohvaćanja dijelova' });
  }
};

const getPartById = async (req, res) => {
  try {
    const { id } = req.params;
    const part = await prisma.part.findUnique({
      where: { id: BigInt(id) },
      include: { supplier: true },
    });

    if (!part) {
      return res.status(404).json({ message: 'Dio nije pronađen' });
    }

    // Dohvati sumu quantity iz inventory za taj dio
    const inventorySum = await prisma.inventory.aggregate({
      _sum: { quantity: true },
      where: { partId: part.id },
    });

    const available = (inventorySum._sum.quantity ?? 0) > 0;

    res.json(convertBigInts({
      ...serializePart(part),
      available,
    }));
  } catch (error) {
    console.error('Greška kod dohvaćanja dijela:', error);
    res.status(500).json({ message: 'Greška kod dohvaćanja dijela' });
  }
};

const createPart = async (req, res) => {
  try {
    const { name, category, price, supplierId } = req.body;

    // Validacija obaveznih polja
    if (!name || !category || !price || !supplierId) {
      return res.status(400).json({ message: 'Nedostaju obavezna polja: name, category, price, supplierId' });
    }

    const newPart = await prisma.part.create({
      data: {
        name,
        category,
        price: new Prisma.Decimal(price),
        supplierId: BigInt(supplierId),
        inventory: {
          create: {
            quantity: initialQuantity || 0
          }
        }
      },
    });

    res.status(201).json(convertBigInts({
      ...newPart,
      price: newPart.price.toString(),
    }));
  } catch (error) {
    console.error('Greška kod kreiranja dijela:', error);
    res.status(500).json({ message: 'Greška kod kreiranja dijela' });
  }
};

const updatePart = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, category, price, supplierId } = req.body;

    const updateData = {};

    if (name !== undefined) updateData.name = name;

    if (category !== undefined) {
      updateData.category = category;
    }

    if (price !== undefined) {
      updateData.price = new Prisma.Decimal(price);
    }

    if (supplierId !== undefined) {
      updateData.supplierId = BigInt(supplierId);
    }

    const updatedPart = await prisma.part.update({
      where: { id: BigInt(id) },
      data: updateData,
    });

    res.json({
      ...updatedPart,
      price: updatedPart.price.toString(),
    });
  } catch (error) {
    console.error('Greška kod ažuriranja dijela:', error);
    res.status(500).json({ message: 'Greška kod ažuriranja dijela' });
  }
};

const deletePart = async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.part.delete({
      where: { id: BigInt(id) },
    });

    res.json({ message: 'Dio je uspješno obrisan' });
  } catch (error) {
    console.error('Greška kod brisanja dijela:', error);
    res.status(500).json({ message: 'Greška kod brisanja dijela' });
  }
};

const getPartFilters = async (req, res) => {
  try {
    // Dohvati jedinstvene vrijednosti za kategorije i nazive dijelova
    const [categories, names, suppliers] = await Promise.all([
      prisma.part.findMany({
        distinct: ['category'],
        select: { category: true },
        orderBy: { category: 'asc' },
      }),
      prisma.part.findMany({
        distinct: ['name'],
        select: { name: true },
        orderBy: { name: 'asc' },
      }),
      prisma.supplier.findMany({
        select: { id: true, name: true },
      }),
    ]);

    const uniqueCategories = categories.map(c => c.category).filter(c => c !== null && c !== undefined);
    const uniqueNames = names.map(n => n.name).filter(Boolean);

    res.json(convertBigInts({
      categories: uniqueCategories,
      suppliers,
      names: uniqueNames,
    }));
  } catch (error) {
    console.error('Greška kod dohvaćanja filtera za dijelove:', error);
    res.status(500).json({ message: 'Greška kod dohvaćanja filtera za dijelove' });
  }
};

module.exports = {
  getAllParts,
  getPartById,
  createPart,
  updatePart,
  deletePart,
  getPartFilters,
};