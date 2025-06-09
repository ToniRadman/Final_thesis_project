module.exports = async function seedCars(prisma) {
  const cars = [
    {
      make: 'Toyota',
      model: 'Corolla',
      category: 1,
      year: 2020,
      price: 15000.00,
    },
    {
      make: 'Volkswagen',
      model: 'Golf',
      category: 1,
      year: 2019,
      price: 13500.00,
    },
    {
      make: 'BMW',
      model: '320d',
      category: 2,
      year: 2021,
      price: 28000.00,
    },
    {
      make: 'Mercedes',
      model: 'C200',
      category: 2,
      year: 2022,
      price: 32000.00,
    },
    {
      make: 'Renault',
      model: 'Clio',
      category: 1,
      year: 2018,
      price: 9500.00,
    },
  ];

  for (const car of cars) {
    await prisma.car.create({ data: car });
  }

  console.log('🚗 Cars seeded');
};