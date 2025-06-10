// controllers/partController.js
const { PrismaClient } = require('@prisma/client');
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
      name,
      category,
      supplierId,
      priceMin,
      priceMax,
      page = 1,
      pageSize = 10,
    } = req.query;

    const filters = {};

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

    const skip = (Number(page) - 1) * Number(pageSize);
    const take = Number(pageSize);

    const parts = await prisma.part.findMany({
      where: filters,
      skip,
      take,
      include: {
        supplier: true,
      },
    });

    const total = await prisma.part.count({ where: filters });

    res.json(convertBigInts({
      data: parts.map(serializePart),
      total,
      page: Number(page),
      pageSize: Number(pageSize),
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

    res.json(serializePart(part));
  } catch (error) {
    console.error('Greška kod dohvaćanja dijela:', error);
    res.status(500).json({ message: 'Greška kod dohvaćanja dijela' });
  }
};

const createPart = async (req, res) => {
  try {
    const { name, category, price, supplierId } = req.body;

    const newPart = await prisma.part.create({
      data: {
        name,
        category,
        price: new Prisma.Decimal(price),
        supplierId: BigInt(supplierId),
      },
    });

    res.status(201).json(serializePart(newPart));
  } catch (error) {
    console.error('Greška kod kreiranja dijela:', error);
    res.status(500).json({ message: 'Greška kod kreiranja dijela' });
  }
};

const updatePart = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, category, price, supplierId } = req.body;

    const updatedPart = await prisma.part.update({
      where: { id: BigInt(id) },
      data: {
        name,
        category,
        price: new Prisma.Decimal(price),
        supplierId: BigInt(supplierId),
      },
    });

    res.json(serializePart(updatedPart));
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
    const categories = Object.values(Prisma.VehicleCategory); // Enum
    const suppliers = await prisma.supplier.findMany({
      select: { id: true, name: true },
    });

    const names = await prisma.part.findMany({
      distinct: ['name'],
      select: { name: true },
      orderBy: { name: 'asc' },
    });

    res.json({
      categories,
      suppliers,
      names: names.map((n) => n.name),
    });
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