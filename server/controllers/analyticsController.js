const { PrismaClient } = require('@prisma/client');
const { convertBigInts } = require('../utils/convertBigInts');
const prisma = new PrismaClient();

// Helper za parsiranje perioda (day, week, month, year)
function getDateRange(period) {
  const now = new Date();
  let start;

  switch (period) {
    case 'day':
      start = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      break;
    case 'week':
      const dayOfWeek = now.getDay();
      start = new Date(now);
      start.setDate(now.getDate() - dayOfWeek);
      start.setHours(0,0,0,0);
      break;
    case 'month':
      start = new Date(now.getFullYear(), now.getMonth(), 1);
      break;
    case 'year':
      start = new Date(now.getFullYear(), 0, 1);
      break;
    default:
      start = new Date(0); // Sve od početka
  }

  return { start, end: now };
}

// 1. Pregled prodaje po periodu
async function getSalesByPeriod(req, res) {
  try {
    const { period = 'month' } = req.query;
    const { start, end } = getDateRange(period);

    const sales = await prisma.sale.groupBy({
      by: ['saleDate'],
      where: {
        saleDate: {
          gte: start,
          lte: end
        }
      },
      _sum: {
        totalPrice: true
      },
      orderBy: {
        saleDate: 'asc'
      }
    });

    res.json({ period, sales });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Greška u dohvaćanju podataka o prodaji' });
  }
}

// 2. Najpopularnija vozila prema broju prodaja
async function getPopularCars(req, res) {
  try {
    const popularCars = await prisma.sale.groupBy({
      by: ['carId'],
      where: {
        carId: { not: null }
      },
      _count: {
        carId: true
      },
      orderBy: {
        _count: {
          carId: 'desc'
        }
      },
      take: 10,
    });

    // Dohvati detalje vozila za top 10
    const carIds = popularCars.map(c => c.carId);
    const cars = await prisma.car.findMany({
      where: { id: { in: carIds } }
    });

    // Spoji broj prodaja s podacima o vozilima
    const result = popularCars.map(pc => ({
      car: cars.find(c => c.id === pc.carId),
      salesCount: pc._count.carId
    }));

    res.json(convertBigInts(result));
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Greška u dohvaćanju popularnih vozila' });
  }
}

// 3. Najprodavaniji dijelovi prema broju prodaja
async function getPopularParts(req, res) {
  try {
    const popularParts = await prisma.sale.groupBy({
      by: ['partId'],
      where: {
        partId: { not: null }
      },
      _count: {
        partId: true
      },
      orderBy: {
        _count: {
          partId: 'desc'
        }
      },
      take: 10,
    });

    const partIds = popularParts.map(p => p.partId);
    const parts = await prisma.part.findMany({
      where: { id: { in: partIds } }
    });

    const result = popularParts.map(pp => ({
      part: parts.find(p => p.id === pp.partId),
      salesCount: pp._count.partId
    }));

    res.json(convertBigInts(result));
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Greška u dohvaćanju popularnih dijelova' });
  }
}

// 4. Najaktivniji zaposlenici prema broju prodaja i servisnih zapisa
async function getActiveEmployees(req, res) {
  try {
    // Prodaje po zaposleniku
    const salesCounts = await prisma.sale.groupBy({
      by: ['employeeId'],
      where: {
        employeeId: { not: null }
      },
      _count: {
        employeeId: true
      },
      orderBy: {
        _count: {
          employeeId: 'desc'
        }
      },
      take: 10,
    });

    // Servisi po zaposleniku (employeeId + mechanicId)
    const serviceEmployeeCounts = await prisma.serviceRecord.groupBy({
      by: ['employeeId'],
      _count: {
        employeeId: true
      }
    });

    const serviceMechanicCounts = await prisma.serviceRecord.groupBy({
      by: ['mechanicId'],
      _count: {
        mechanicId: true
      }
    });

    // Kombiniraj sve u mapu employeeId -> count
    const countsMap = new Map();

    salesCounts.forEach(sc => countsMap.set(sc.employeeId.toString(), sc._count.employeeId));
    serviceEmployeeCounts.forEach(se => {
      const key = se.employeeId.toString();
      countsMap.set(key, (countsMap.get(key) || 0) + se._count.employeeId);
    });
    serviceMechanicCounts.forEach(sm => {
      const key = sm.mechanicId.toString();
      countsMap.set(key, (countsMap.get(key) || 0) + sm._count.mechanicId);
    });

    // Sortiraj po ukupnom broju aktivnosti
    const sortedEmployees = Array.from(countsMap.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10);

    const employeeIds = sortedEmployees.map(e => BigInt(e[0]));

    // Dohvati korisnike
    const employees = await prisma.user.findMany({
      where: { id: { in: employeeIds } },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
      }
    });

    // Spoji s brojevima aktivnosti
    const result = sortedEmployees.map(([id, count]) => ({
      employee: employees.find(e => e.id === BigInt(id)),
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