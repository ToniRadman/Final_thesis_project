// controllers/serviceRecordController.js
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function getAllServiceRecords(req, res) {
  try {
    const services = await prisma.serviceRecord.findMany({
      include: {
        car: true,
        employee: true,
        mechanic: true,
        customer: true,
        partsUsed: {
          include: {
            part: true,
          },
        },
      },
    });
    res.json(services);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Greška na serveru' });
  }
}

async function getServiceRecordById(req, res) {
  const { id } = req.params;
  try {
    const service = await prisma.serviceRecord.findUnique({
      where: { id: Number(id) },
      include: {
        car: true,
        employee: true,
        mechanic: true,
        customer: true,
        partsUsed: {
          include: {
            part: true,
          },
        },
      },
    });
    if (!service) return res.status(404).json({ message: 'Servisni zapis nije pronađen' });
    res.json(service);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Greška na serveru' });
  }
}

async function createServiceRecord(req, res) {
  const { carId, employeeId, mechanicId, customerId, description, price, serviceDate, partsUsed } = req.body;

  try {
    // Kreiraj servisni zapis
    const newService = await prisma.serviceRecord.create({
      data: {
        carId,
        employeeId,
        mechanicId,
        customerId,
        description,
        price,
        serviceDate: new Date(serviceDate),
        partsUsed: {
          create: partsUsed.map(part => ({
            partId: part.partId,
            quantity: part.quantity,
          })),
        },
      },
      include: {
        partsUsed: true,
      },
    });

    res.status(201).json(newService);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Greška na serveru' });
  }
}

async function updateServiceRecord(req, res) {
  const { id } = req.params;
  const { carId, employeeId, mechanicId, customerId, description, price, serviceDate, partsUsed } = req.body;

  try {
    // Prvo izbriši postojeće ServiceParts
    await prisma.servicePart.deleteMany({ where: { serviceId: Number(id) } });

    // Ažuriraj servisni zapis i ponovno kreiraj ServiceParts
    const updatedService = await prisma.serviceRecord.update({
      where: { id: Number(id) },
      data: {
        carId,
        employeeId,
        mechanicId,
        customerId,
        description,
        price,
        serviceDate: new Date(serviceDate),
        partsUsed: {
          create: partsUsed.map(part => ({
            partId: part.partId,
            quantity: part.quantity,
          })),
        },
      },
      include: {
        partsUsed: true,
      },
    });

    res.json(updatedService);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Greška na serveru' });
  }
}

async function deleteServiceRecord(req, res) {
  const { id } = req.params;
  try {
    await prisma.serviceRecord.delete({ where: { id: Number(id) } });
    res.json({ message: 'Servisni zapis obrisan' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Greška na serveru' });
  }
}

module.exports = {
  getAllServiceRecords,
  getServiceRecordById,
  createServiceRecord,
  updateServiceRecord,
  deleteServiceRecord,
};