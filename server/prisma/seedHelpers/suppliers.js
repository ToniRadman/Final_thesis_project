module.exports = async function seedSuppliers(prisma) {
  await prisma.supplier.deleteMany();
  const suppliers = [
    {
      name: 'Auto Dijelovi d.o.o.',
      contactName: 'Zoran Zovko',
      email: 'zoran@autodijelovi.hr',
      phone: '0912345678',
    },
    {
      name: 'Parts4Cars',
      contactName: 'Maja Majić',
      email: 'maja@parts4cars.com',
      phone: '0923456789',
    },
    {
      name: 'MotorTech',
      contactName: 'Luka Lukić',
      email: 'luka@motortech.hr',
      phone: '0934567890',
    },
    {
      name: 'AutoPartneri',
      contactName: 'Ivana Ivančić',
      email: 'ivana@autopartneri.hr',
      phone: '0945678901',
    },
    {
      name: 'EuroParts',
      contactName: 'Petar Petrović',
      email: 'petar@europarts.hr',
      phone: '0956789012',
    },
  ];

  for (const supplier of suppliers) {
    await prisma.supplier.create({ data: supplier });
  }

  console.log('✅ Suppliers seeded');
};