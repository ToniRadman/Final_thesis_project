// controllers/supplierController.js
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function getAllSuppliers(req, res) {
  try {
    const suppliers = await prisma.supplier.findMany({
      include: {
        parts: true,
      },
    });
    res.json(suppliers);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Greška na serveru' });
  }
}

async function getSupplierById(req, res) {
  const { id } = req.params;
  try {
    const supplier = await prisma.supplier.findUnique({
      where: { id: Number(id) },
      include: {
        parts: true,
      },
    });
    if (!supplier) return res.status(404).json({ message: 'Dobavljač nije pronađen' });
    res.json(supplier);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Greška na serveru' });
  }
}

async function createSupplier(req, res) {
  const { name, contactName, email, phone } = req.body;
  try {
    const newSupplier = await prisma.supplier.create({
      data: {
        name,
        contactName,
        email,
        phone,
      },
    });
    res.status(201).json(newSupplier);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Greška na serveru' });
  }
}

async function updateSupplier(req, res) {
  const { id } = req.params;
  const { name, contactName, email, phone } = req.body;
  try {
    const updatedSupplier = await prisma.supplier.update({
      where: { id: Number(id) },
      data: {
        name,
        contactName,
        email,
        phone,
      },
    });
    res.json(updatedSupplier);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Greška na serveru' });
  }
}

async function deleteSupplier(req, res) {
  const { id } = req.params;
  try {
    await prisma.supplier.delete({ where: { id: Number(id) } });
    res.json({ message: 'Dobavljač obrisan' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Greška na serveru' });
  }
}

module.exports = {
  getAllSuppliers,
  getSupplierById,
  createSupplier,
  updateSupplier,
  deleteSupplier,
};