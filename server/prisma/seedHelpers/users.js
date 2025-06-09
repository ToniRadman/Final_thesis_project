const bcrypt = require('bcrypt');

module.exports = async function seedUsers(prisma) {
  const users = [
    {
      firstName: 'Ana',
      lastName: 'Anić',
      email: 'ana@example.com',
      password: await bcrypt.hash('password123', 10),
      role: 'KLIJENT',
    },
    {
      firstName: 'Marko',
      lastName: 'Marić',
      email: 'marko@example.com',
      password: await bcrypt.hash('password123', 10),
      role: 'ZAPOSLENIK',
    },
    {
      firstName: 'Ivana',
      lastName: 'Ivčić',
      email: 'ivana@example.com',
      password: await bcrypt.hash('password123', 10),
      role: 'KLIJENT',
    },
    {
      firstName: 'Ivan',
      lastName: 'Ivić',
      email: 'ivan@example.com',
      password: await bcrypt.hash('password123', 10),
      role: 'ZAPOSLENIK',
    },
    {
      firstName: 'Admin',
      lastName: 'Adminić',
      email: 'admin@example.com',
      password: await bcrypt.hash('adminpass', 10),
      role: 'ADMIN',
    },
  ];

  for (const user of users) {
    await prisma.user.create({ data: user });
  }

  console.log('✅ Users seeded');
};