const { PrismaClient } = require('@prisma/client');
const { convertBigInts } = require('../utils/convertBigInts');
const prisma = new PrismaClient();

async function createBooking(req, res) {
  try {
    if (!req.user || !req.user.userId) {
      return res.status(401).json({ message: 'Neautoriziran pristup: korisnik nije pronađen.' });
    }

    const { carId, bookingType, date } = req.body;
    const userId = req.user.userId;

    // Možeš dodati dodatne provjere, npr. da li je auto dostupan na dan itd.
    const bookingTypeMap = {
      'probna vožnja': 'TEST_DRIVE',
      'pregled vozila': 'INSPECTION',
      'servis': 'SERVICE',
    };

    const booking = await prisma.booking.create({
      data: {
        userId,
        carId: Number(carId),
        bookingType: bookingTypeMap[bookingType.toLowerCase()],
        date: new Date(date),
        status: 'PENDING',
      },
    });

    res.status(201).json(convertBigInts({ 
      message: 'Rezervacija uspješno kreirana', 
      booking 
    }));

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Greška pri kreiranju rezervacije' });
  }
}

async function getBookings(req, res) {
  try {
    const { role, userId } = req.user;

    let where = {};
    if (role === 'KLIJENT') {
      where.userId = userId; // klijent vidi samo svoje rezervacije
    }

    const bookings = await prisma.booking.findMany({
      where,
      include: {
        user: { select: { id: true, firstName: true, lastName: true, email: true } },
        car: true,
      },
      orderBy: { date: 'desc' },
    });

    res.json(convertBigInts(bookings));
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Greška pri dohvaćanju rezervacija' });
  }
}

async function updateBookingStatus(req, res) {
  try {
    const bookingId = Number(req.params.id);
    const { status } = req.body;

    if (!['PENDING', 'CONFIRMED', 'CANCELLED', 'COMPLETED'].includes(status)) {
      return res.status(400).json({ message: 'Neispravan status rezervacije' });
    }

    const booking = await prisma.booking.update({
      where: { id: bookingId },
      data: { status },
    });

    res.json({ message: 'Status rezervacije ažuriran', booking });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Greška pri ažuriranju statusa rezervacije' });
  }
}

async function deleteBooking(req, res) {
  try {
    const bookingId = Number(req.params.id);

    await prisma.booking.delete({
      where: { id: bookingId },
    });

    res.json({ message: 'Rezervacija obrisana' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Greška pri brisanju rezervacije' });
  }
}

module.exports = {
  createBooking,
  getBookings,
  updateBookingStatus,
  deleteBooking,
};