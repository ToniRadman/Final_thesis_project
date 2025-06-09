// controllers/partController.js
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function getAllParts(req, res) {
  try {
    const { page = 1, pageSize = 10, group, priceMin, priceMax, name, supplierId } = req.query;

    const filters = {};

    if (group) filters.group = Number(group);
    if (name) filters.name = { contains: name, mode: 'insensitive' };
    if (supplierId) filters.supplierId = Number(supplierId);
    if (priceMin || priceMax) {
      filters.price = {};
      if (priceMin) filters.price.gte = Number(priceMin);
      if (priceMax) filters.price.lte = Number(priceMax);
    }

    const parts = await prisma.part.findMany({
      where: filters,
      skip: (page - 1) * pageSize,
      take: Number(pageSize),
      orderBy: { id: 'asc' },
    });

    const total = await prisma.part.count({ where: filters });

    res.json({
      data: parts,
      pagination: {
        total,
        page: Number(page),
        pageSize: Number(pageSize),
        totalPages: Math.ceil(total / pageSize),
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Greška na serveru prilikom dohvaćanja dijelova.' });
  }
}

async function getPartById(req, res) {
  const { id } = req.params;
  try {
    const part = await prisma.part.findUnique({
      where: { id: Number(id) },
      include: {
        supplier: true,
      },
    });
    if (!part) return res.status(404).json({ message: 'Dio nije pronađen' });
    res.json(part);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Greška na serveru' });
  }
}

async function createPart(req, res) {
  const { name, group, price, supplierId } = req.body;
  try {
    const newPart = await prisma.part.create({
      data: {
        name,
        group,
        price,
        supplierId,
      },
    });
    res.status(201).json(newPart);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Greška na serveru' });
  }
}

async function updatePart(req, res) {
  const { id } = req.params;
  const { name, group, price, supplierId } = req.body;
  try {
    const updatedPart = await prisma.part.update({
      where: { id: Number(id) },
      data: {
        name,
        group,
        price,
        supplierId,
      },
    });
    res.json(updatedPart);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Greška na serveru' });
  }
}

async function deletePart(req, res) {
  const { id } = req.params;
  try {
    await prisma.part.delete({ where: { id: Number(id) } });
    res.json({ message: 'Dio obrisan' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Greška na serveru' });
  }
}

module.exports = {
  getAllParts,
  getPartById,
  createPart,
  updatePart,
  deletePart,
};