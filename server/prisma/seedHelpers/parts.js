const { VehicleCategory } = require('@prisma/client');

/**
 * @param {import('@prisma/client').PrismaClient} prisma
 */
module.exports = async function seedParts(prisma) {
  await prisma.part.deleteMany();

  const parts = [
    {
      name: 'Zračni filter',
      category: VehicleCategory.SUV,
      price: '19.99',
      supplierId: 1,
    },
    {
      name: 'Zračni filter',
      category: VehicleCategory.LIMUZINA,
      price: '19.99',
      supplierId: 1,
    },
    {
      name: 'Ulje za motor',
      category: VehicleCategory.SUV,
      price: '29.99',
      supplierId: 2,
    },
    {
      name: 'Kočione pločice',
      category: VehicleCategory.KOMBI,
      price: '45.00',
      supplierId: 1,
    },
    {
      name: 'Svjećice',
      category: VehicleCategory.HATCHBACK,
      price: '15.50',
      supplierId: 3,
    },
    {
      name: 'Remen',
      category: VehicleCategory.KARAVAN,
      price: '22.00',
      supplierId: 2,
    },
    {
      name: 'Amortizer',
      category: VehicleCategory.PICKUP,
      price: '89.90',
      supplierId: 2,
    },
    {
      name: 'Akumulator',
      category: VehicleCategory.COUPE,
      price: '120.00',
      supplierId: 1,
    },
    {
      name: 'Filter goriva',
      category: VehicleCategory.KABRIOLET,
      price: '25.50',
      supplierId: 3,
    },
    {
      name: 'Stražnje svjetlo',
      category: VehicleCategory.LIMUZINA,
      price: '65.00',
      supplierId: 1,
    },
    {
      name: 'Prednji branik',
      category: VehicleCategory.SUV,
      price: '210.00',
      supplierId: 2,
    },
  ];

  for (const part of parts) {
    await prisma.part.create({ data: part });
  }

  console.log('✅ Parts seeded');
};