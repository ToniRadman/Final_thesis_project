// controllers/saleController.js
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function getAllSales(req, res) {
  try {
    const sales = await prisma.sale.findMany({
      include: {
        car: true,
        part: true,
        customer: true,
        employee: true,
      },
    });
    res.json(sales);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Greška na serveru' });
  }
}

async function getSaleById(req, res) {
  const { id } = req.params;
  try {
    const sale = await prisma.sale.findUnique({
      where: { id: Number(id) },
      include: {
        car: true,
        part: true,
        customer: true,
        employee: true,
      },
    });
    if (!sale) return res.status(404).json({ message: 'Prodaja nije pronađena' });
    res.json(sale);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Greška na serveru' });
  }
}

async function createSale(req, res) {
  const { carId, partId, employeeId, customerId, saleDate, totalPrice, wayOfPayment } = req.body;
  try {
    const newSale = await prisma.sale.create({
      data: {
        carId,
        partId,
        employeeId,
        customerId,
        saleDate: new Date(saleDate),
        totalPrice,
        wayOfPayment,
      },
    });
    res.status(201).json(newSale);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Greška na serveru' });
  }
}

async function updateSale(req, res) {
  const { id } = req.params;
  const { carId, partId, employeeId, customerId, saleDate, totalPrice, wayOfPayment } = req.body;
  try {
    const updatedSale = await prisma.sale.update({
      where: { id: Number(id) },
      data: {
        carId,
        partId,
        employeeId,
        customerId,
        saleDate: new Date(saleDate),
        totalPrice,
        wayOfPayment,
      },
    });
    res.json(updatedSale);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Greška na serveru' });
  }
}

async function deleteSale(req, res) {
  const { id } = req.params;
  try {
    await prisma.sale.delete({ where: { id: Number(id) } });
    res.json({ message: 'Prodaja obrisana' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Greška na serveru' });
  }
}

module.exports = {
  getAllSales,
  getSaleById,
  createSale,
  updateSale,
  deleteSale,
};