// controllers/inventoryController.js
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function getAllInventory(req, res) {
  try {
    const inventory = await prisma.inventory.findMany({
      include: {
        car: true,
        part: true,
      },
    });
    res.json(inventory);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Greška na serveru' });
  }
}

async function getInventoryById(req, res) {
  const { id } = req.params;
  try {
    const item = await prisma.inventory.findUnique({
      where: { id: Number(id) },
      include: {
        car: true,
        part: true,
      },
    });
    if (!item) return res.status(404).json({ message: 'Inventar nije pronađen' });
    res.json(item);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Greška na serveru' });
  }
}

async function createInventory(req, res) {
  const { carId, partId, quantity } = req.body;
  try {
    const newInventory = await prisma.inventory.create({
      data: {
        carId,
        partId,
        quantity,
      },
    });
    res.status(201).json(newInventory);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Greška na serveru' });
  }
}

async function updateInventory(req, res) {
  const { id } = req.params;
  const { carId, partId, quantity } = req.body;
  try {
    const updatedInventory = await prisma.inventory.update({
      where: { id: Number(id) },
      data: {
        carId,
        partId,
        quantity,
      },
    });
    res.json(updatedInventory);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Greška na serveru' });
  }
}

async function deleteInventory(req, res) {
  const { id } = req.params;
  try {
    await prisma.inventory.delete({ where: { id: Number(id) } });
    res.json({ message: 'Inventar obrisan' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Greška na serveru' });
  }
}

module.exports = {
  getAllInventory,
  getInventoryById,
  createInventory,
  updateInventory,
  deleteInventory,
};