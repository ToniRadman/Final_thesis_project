const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Dohvati sve rezervacije (s opcijom filtriranja po statusu)
async function getReservations(req, res) {
  const { status } = req.query; // opcionalno: PENDING, CONFIRMED...

  try {
    const reservations = await prisma.reservation.findMany({
      where: status ? { status } : {},
      include: {
        customer: true,
        employee: true,
        car: true
      },
      orderBy: {
        date: 'asc'
      }
    });
    res.json(reservations);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Greška prilikom dohvaćanja rezervacija' });
  }
}

// Potvrdi rezervaciju i dodijeli zaposlenika koji potvrđuje
async function confirmReservation(req, res) {
  const { id } = req.params; // id rezervacije
  const employeeId = req.user.userId; // zaposlenik koji potvrđuje

  try {
    const updated = await prisma.reservation.update({
      where: { id: BigInt(id) },
      data: {
        status: 'CONFIRMED',
        employeeId: BigInt(employeeId)
      }
    });
    res.json({ message: 'Rezervacija potvrđena', reservation: updated });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Greška prilikom potvrde rezervacije' });
  }
}

// Otkazivanje rezervacije
async function cancelReservation(req, res) {
  const { id } = req.params;

  try {
    const updated = await prisma.reservation.update({
      where: { id: BigInt(id) },
      data: { status: 'CANCELLED' }
    });
    res.json({ message: 'Rezervacija otkazana', reservation: updated });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Greška prilikom otkazivanja rezervacije' });
  }
}

module.exports = {
  getReservations,
  confirmReservation,
  cancelReservation,
};