// controllers/saleController.js
const { PrismaClient } = require('@prisma/client');
const { convertBigInts } = require('../utils/convertBigInts');
const prisma = new PrismaClient();

async function getAllSales(req, res) {
  const userId = req.user?.id;
  const userRole = req.user?.role;

  if (!userId) {
    return res.status(401).json({ message: 'Niste prijavljeni' });
  }

  try {
    let sales;

    if (userRole === 'ADMIN' || userRole === 'ZAPOSLENIK') {
      // Admin vidi sve račune
      sales = await prisma.sale.findMany({
        include: { saleItems: true }
      });
    } else {
      // Klijent vidi samo svoje račune
      sales = await prisma.sale.findMany({
        where: { userId },
        include: { saleItems: true }
      });
    }

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
  const { customer, paymentMethod, total, items } = req.body;
  const { userId } = req.user;

  console.log('Sale data:', req.body);

  if (!userId) {
    return res.status(401).json({ message: 'Niste prijavljeni' });
  }

  try {
    const sale = await prisma.$transaction(async (tx) => {
      for (const item of items) {
        const inventory = await tx.inventory.findUnique({ where: { id: item.inventoryId } });
        if (!inventory || inventory.quantity < item.quantity) {
          throw new Error(`Nema dovoljno zaliha za proizvod ID: ${item.inventoryId}`);
        }
      }

      const createdSale = await tx.sale.create({
        data: {
          userId,
          paymentMethod,
          total,
          customerFirstName: customer.firstName,
          customerLastName: customer.lastName,
          customerEmail: customer.email,
          customerPhone: customer.phone,
          customerAddress: customer.address,
          customerCity: customer.city,
          customerPostalCode: customer.postalCode,
          saleItems: {
            create: items.map(item => ({
              quantity: item.quantity,
              price: item.price,
              inventory: { connect: { id: item.inventoryId } }
            }))
          }
        },
        include: { saleItems: true }
      });

      for (const item of items) {
        const inventory = await tx.inventory.findUnique({ where: { id: item.inventoryId } });
        const newQuantity = inventory.quantity - BigInt(item.quantity);
        await tx.inventory.update({
          where: { id: item.inventoryId },
          data: { quantity: newQuantity }
        });
      }

      return createdSale;
    });

    res.status(201).json(convertBigInts({ message: 'Narudžba uspješno spremljena', sale }));

  } catch (error) {
    console.error('Greška prilikom obrade narudžbe:', error.message);
    res.status(400).json({ message: error.message || 'Greška prilikom obrade narudžbe' });
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
  deleteSale,
};