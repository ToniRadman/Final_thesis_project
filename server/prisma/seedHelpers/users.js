const bcrypt = require('bcrypt');

module.exports = async function seedUsers(prisma) {
  await prisma.user.deleteMany();

  const users = [
    {
      firstName: 'Ana',
      lastName: 'Anić',
      email: 'ana@example.com',
      password: await bcrypt.hash('password123', 10),
      role: 'KLIJENT',
      phone: '+385912345678',
    },
    {
      firstName: 'Marko',
      lastName: 'Marić',
      email: 'marko@example.com',
      password: await bcrypt.hash('password123', 10),
      role: 'ZAPOSLENIK',
      phone: '+385912345679',
    },
    {
      firstName: 'Ivana',
      lastName: 'Ivčić',
      email: 'ivana@example.com',
      password: await bcrypt.hash('password123', 10),
      role: 'KLIJENT',
      phone: '+385912345680',
    },
    {
      firstName: 'Ivan',
      lastName: 'Ivić',
      email: 'ivan@example.com',
      password: await bcrypt.hash('password123', 10),
      role: 'ZAPOSLENIK',
      phone: '+385912345681',
    },
    {
      firstName: 'Luka',
      lastName: 'Lukić',
      email: 'luka@example.com',
      password: await bcrypt.hash('password123', 10),
      role: 'KLIJENT',
      phone: '+385912345682',
    },
    {
      firstName: 'Marija',
      lastName: 'Marić',
      email: 'marija@example.com',
      password: await bcrypt.hash('password123', 10),
      role: 'ZAPOSLENIK',
      phone: '+385912345683',
    },
    {
      firstName: 'Petar',
      lastName: 'Perić',
      email: 'petar@example.com',
      password: await bcrypt.hash('password123', 10),
      role: 'KLIJENT',
      phone: '+385912345684',
    },
    {
      firstName: 'Katarina',
      lastName: 'Katić',
      email: 'katarina@example.com',
      password: await bcrypt.hash('password123', 10),
      role: 'ZAPOSLENIK',
      phone: '+385912345685',
    },
    {
      firstName: 'Admin',
      lastName: 'Adminić',
      email: 'admin@example.com',
      password: await bcrypt.hash('adminpass', 10),
      role: 'ADMIN',
      phone: '+385912345686',
    },
  ];

  for (const user of users) {
    await prisma.user.create({ data: user });
  }

  console.log('✅ Users seeded');
};