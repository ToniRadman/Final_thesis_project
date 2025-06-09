module.exports = async function seedParts(prisma) {
  const parts = [
    {
      name: 'Zračni filter',
      group: 1,
      price: 19.99,
      supplierId: 1,
    },
    {
      name: 'Ulje za motor',
      group: 2,
      price: 29.99,
      supplierId: 2,
    },
    {
      name: 'Kočione pločice',
      group: 3,
      price: 45.0,
      supplierId: 1,
    },
    {
      name: 'Svjećice',
      group: 4,
      price: 15.5,
      supplierId: 3,
    },
    {
      name: 'Remen',
      group: 5,
      price: 22.0,
      supplierId: 2,
    },
  ];

  for (const part of parts) {
    await prisma.part.create({ data: part });
  }

  console.log('✅ Parts seeded');
};