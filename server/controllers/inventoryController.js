// controllers/inventoryController.js
const { PrismaClient } = require('@prisma/client');
const { convertBigInts } = require('../utils/convertBigInts');
const prisma = new PrismaClient();

async function getAllInventory(req, res) {
  try {
    const inventory = await prisma.inventory.findMany({
      include: {
        car: true,
        part: true,
      },
    });
    res.json(convertBigInts(inventory));
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Greška na serveru' });
  }
}

async function getInventoryById(req, res) {
  const { id } = req.params;
  try {
    const item = await prisma.inventory.findUnique({
      where: {
        id: BigInt(id)
      },
      include: {
        car: true,
        part: true
      }
    });
    res.json(item);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Greška kod dohvaćanja inventara." });
  }
}

async function getInventoryByPartId(req, res) {
  const { id } = req.params;
  try {
    const item = await prisma.inventory.findFirst({
      where: {
        partId: BigInt(id)
      },
    });
    if (!item) return res.status(404).json({ message: 'Nema na skladištu' });
    res.json(convertBigInts(item));
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Greška kod dohvaćanja inventara.' });
  }
}

async function updateInventory(req, res) {
  const { id } = req.params;
  const { quantity } = req.body;

  if (typeof quantity !== 'number' || quantity < 0) {
    return res.status(400).json({ message: 'Količina mora biti broj veći ili jednak 0' });
  }

  try {
    const updatedInventory = await prisma.inventory.update({
      where: { id: BigInt(id) },
      data: { quantity },
    });
    res.json(convertBigInts(updatedInventory));
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Greška na serveru' });
  }
}

module.exports = {
  getAllInventory,
  getInventoryById,
  updateInventory,
  getInventoryByPartId,
};