module.exports = async function seedCars(prisma) {
  await prisma.car.deleteMany();

  const cars = [
    {
      make: 'Toyota',
      model: 'Corolla',
      category: 1,
      year: 2020,
      price: 15000.00,
      fuel: 'Benzin',
      km: 45000,
      status: 'Dostupno',
      imagePath: 'https://images.unsplash.com/photo-1601731371092-2b54c8f6f204?auto=format&fit=crop&w=800&q=80'
    },
    {
      make: 'Volkswagen',
      model: 'Golf',
      category: 1,
      year: 2019,
      price: 13500.00,
      fuel: 'Dizel',
      km: 60000,
      status: 'Dostupno',
      imagePath: 'https://images.unsplash.com/photo-1616788771325-3c94a44c0023?auto=format&fit=crop&w=800&q=80'
    },
    {
      make: 'BMW',
      model: '320d',
      category: 2,
      year: 2021,
      price: 28000.00,
      fuel: 'Dizel',
      km: 30000,
      status: 'Rezervirano',
      imagePath: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=800&q=80'
    },
    {
      make: 'Mercedes',
      model: 'C200',
      category: 2,
      year: 2022,
      price: 32000.00,
      fuel: 'Dizel',
      km: 20000,
      status: 'Dostupno',
      imagePath: 'https://images.unsplash.com/photo-1553440569-bcc63803a83d?auto=format&fit=crop&w=800&q=80'
    },
    {
      make: 'Renault',
      model: 'Clio',
      category: 1,
      year: 2018,
      price: 9500.00,
      fuel: 'Benzin',
      km: 80000,
      status: 'Prodano',
      imagePath: 'https://images.unsplash.com/photo-1616577046305-f8bd9ff315c3?auto=format&fit=crop&w=800&q=80'
    },
  ];

  for (const car of cars) {
    await prisma.car.create({ data: car });
  }

  console.log('🚗 Cars seeded');
};