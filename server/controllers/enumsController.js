const prisma = require('../lib/prisma'); // prilagodi putanju

const getVehicleCategories = async (req, res) => {
  try {
    const result = await prisma.$queryRawUnsafe(
      `SELECT enumlabel FROM pg_enum WHERE enumtypid = (
        SELECT oid FROM pg_type WHERE typname = 'vehiclecategory'
      )`
    );

    const categories = result.map(({ enumlabel }) => ({
      value: enumlabel,
      label: enumlabel.charAt(0).toUpperCase() + enumlabel.slice(1).toLowerCase(),
    }));

    res.json(categories);
  } catch (error) {
    console.error('Greška pri dohvaćanju enum vrijednosti:', error);
    res.status(500).json({ error: 'Greška na serveru' });
  }
};

module.exports = { getVehicleCategories };