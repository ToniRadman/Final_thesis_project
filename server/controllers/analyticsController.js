const { PrismaClient } = require('@prisma/client');
const { convertBigInts } = require('../utils/convertBigInts');
const prisma = new PrismaClient();

// Helper za parsiranje perioda (day, week, month, year)
function getDateRange(period) {
  const now = new Date();
  let start = new Date();

  switch (period) {
    case 'dan':
      start.setHours(0, 0, 0, 0);
      break;
    case 'tjedan':
      start.setDate(now.getDate() - 7);
      break;
    case 'mjesec':
      start.setMonth(now.getMonth() - 1);
      break;
    case 'godina':
      start.setFullYear(now.getFullYear() - 1);
      break;
    default:
      start = new Date(2024, 0, 1); // Start from beginning of 2024
  }

  return { start, end: now };
}

function formatDateKey(date, period) {
  const d = new Date(date);
  switch (period) {
    case 'dan':
      return d.toISOString().slice(0, 10); // YYYY-MM-DD
    case 'tjedan': {
      // Izračunaj ISO tjedan (ili početak tjedna nedjelja)
      const day = d.getDay(); // 0=nedjelja
      const diff = d.getDate() - day; // početak tjedna nedjeljom
      const startOfWeek = new Date(d.setDate(diff));
      return startOfWeek.toISOString().slice(0, 10);
    }
    case 'mjesec':
      return d.toISOString().slice(0, 7); // YYYY-MM
    case 'godina':
      return d.getFullYear().toString();
    default:
      return d.toISOString().slice(0, 10);
  }
}

async function getSalesByPeriod(req, res) {
  try {
    const { period = 'mjesec' } = req.query;
    const { start, end } = getDateRange(period);

    console.log('Querying sales with date range:', {
      start: start.toISOString(),
      end: end.toISOString()
    });

    const salesRaw = await prisma.sale.findMany({
      where: {
        createdAt: {
          gte: start,
          lte: end,
        },
      },
      select: {
        createdAt: true,
        total: true,
      },
      orderBy: {
        createdAt: 'asc',
      },
    });

    console.log('Found sales count:', salesRaw.length);

    // Format the data for the chart
    const groupedSales = salesRaw.reduce((acc, sale) => {
      const dateKey = formatDateKey(sale.createdAt, period);
      if (!acc[dateKey]) {
        acc[dateKey] = 0;
      }
      // Convert Decimal to number using toString()
      acc[dateKey] += Number(sale.total.toString());
      return acc;
    }, {});

    const formattedSales = Object.entries(groupedSales).map(([date, total]) => ({
      date,
      total: Number(total.toFixed(2)) // Ensure 2 decimal places
    }));

    console.log('Formatted sales data:', formattedSales);

    res.json({ sales: formattedSales });
  } catch (error) {
    console.error('Error in getSalesByPeriod:', error);
    res.status(500).json({ 
      message: 'Greška u dohvaćanju podataka o prodaji',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
}

// 2. Najpopularnija vozila prema broju prodaja
async function getPopularCars(req, res) {
  try {
    const saleItems = await prisma.saleItem.findMany({
      where: {
        inventory: {
          carId: { not: null }
        }
      },
      include: {
        inventory: {
          select: {
            carId: true
          }
        }
      }
    });

    // Ručna grupacija po carId
    const map = new Map();
    for (const item of saleItems) {
      const carId = item.inventory.carId?.toString();
      if (!carId) continue;
      const current = map.get(carId) || 0;
      map.set(carId, current + Number(item.quantity));
    }

    // Sortiraj po količini i uzmi top 10
    const sorted = Array.from(map.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10);

    const carIds = sorted.map(([id]) => BigInt(id));
    const cars = await prisma.car.findMany({
      where: { id: { in: carIds } }
    });

    const result = sorted.map(([id, quantitySold]) => ({
      car: cars.find(c => c.id === BigInt(id)),
      quantitySold
    }));

    res.json(convertBigInts(result));
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Greška prilikom dohvaćanja popularnih vozila.' });
  }
}

// 3. Najprodavaniji dijelovi prema broju prodaja
async function getPopularParts(req, res) {
  try {
    const saleItems = await prisma.saleItem.findMany({
      where: {
        inventory: {
          partId: { not: null }
        }
      },
      include: {
        inventory: {
          select: {
            partId: true
          }
        }
      }
    });

    // Grupiraj po partId i zbroji količine
    const map = new Map();
    for (const item of saleItems) {
      const partId = item.inventory.partId?.toString();
      if (!partId) continue;
      const current = map.get(partId) || 0;
      map.set(partId, current + Number(item.quantity));
    }

    // Sortiraj i uzmi top 10
    const sorted = Array.from(map.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10);

    const partIds = sorted.map(([id]) => BigInt(id));
    const parts = await prisma.part.findMany({
      where: { id: { in: partIds } }
    });

    const result = sorted.map(([id, quantitySold]) => ({
      part: parts.find(p => p.id === BigInt(id)),
      quantitySold
    }));

    res.json(convertBigInts(result));
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Greška prilikom dohvaćanja popularnih dijelova.' });
  }
}

// 4. Najaktivniji zaposlenici prema broju prodaja i servisnih zapisa
async function getActiveEmployees(req, res) {
  try {
    // Broj prodaja po korisniku (zaposleniku)
    /* const salesCounts = await prisma.sale.groupBy({
      by: ['userId'],
      where: {
        userId: { not: null }
      },
      _count: {
        userId: true
      }
    }); */

    // Broj servisnih zapisa po employeeId
    /* const serviceEmployeeCounts = await prisma.serviceRecord.groupBy({
      by: ['employeeId'],
      where: {
        employeeId: { not: null }
      },
      _count: {
        employeeId: true
      }
    }); */

    // Broj servisnih zapisa po mechanicId
    /* const serviceMechanicCounts = await prisma.serviceRecord.groupBy({
      by: ['mechanicId'],
      where: {
        mechanicId: { not: null }
      },
      _count: {
        mechanicId: true
      }
    }); */

    // Broj potvrđenih rezervacija gdje je zaposlenik potvrdio (staffId) i status je CONFIRMED
    const bookingCounts = await prisma.booking.groupBy({
      by: ['staffId'],
      where: {
        staffId: { not: null },
      },
      _count: {
        staffId: true
      }
    });

    const countsMap = new Map();

    /* salesCounts.forEach(({ userId, _count }) => {
      countsMap.set(userId, (countsMap.get(userId) || 0) + _count.userId);
    });

    serviceEmployeeCounts.forEach(({ employeeId, _count }) => {
      countsMap.set(employeeId, (countsMap.get(employeeId) || 0) + _count.employeeId);
    });

    serviceMechanicCounts.forEach(({ mechanicId, _count }) => {
      countsMap.set(mechanicId, (countsMap.get(mechanicId) || 0) + _count.mechanicId);
    }); */

    bookingCounts.forEach(({ staffId, _count }) => {
      countsMap.set(staffId, (countsMap.get(staffId) || 0) + _count.staffId);
    });

    // sortiraj po ukupnom broju aktivnosti i uzmi top 10
    const sorted = Array.from(countsMap.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10);

    const userIds = sorted.map(([id]) => id);

    const users = await prisma.user.findMany({
      where: { id: { in: userIds } },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true
      }
    });

    const result = sorted.map(([id, count]) => ({
      employee: users.find(u => u.id === id),
      activityCount: count
    }));

    res.json(convertBigInts(result));
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Greška u dohvaćanju aktivnosti zaposlenika' });
  }
}

module.exports = {
  getSalesByPeriod,
  getPopularCars,
  getPopularParts,
  getActiveEmployees,
};