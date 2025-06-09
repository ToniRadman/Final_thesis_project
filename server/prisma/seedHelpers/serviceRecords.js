const { faker } = require('@faker-js/faker');

module.exports = async function seedServiceRecords(prisma) {
  const cars = await prisma.car.findMany();
  const users = await prisma.user.findMany();

  const employees = users.filter(u => u.role === 'ZAPOSLENIK');
  const mechanics = users.filter(u => u.role === 'ZAPOSLENIK'); // Za sada koristimo iste kao zaposlenike
  const customers = users.filter(u => u.role === 'KLIJENT');

  const serviceRecords = Array.from({ length: 10 }).map(() => {
    const car = faker.helpers.arrayElement(cars);
    const employee = faker.helpers.arrayElement(employees);
    const mechanic = faker.helpers.arrayElement(mechanics);
    const customer = faker.helpers.arrayElement(customers);

    return {
      carId: car.id,
      employeeId: employee.id,
      mechanicId: mechanic.id,
      customerId: customer.id,
      description: faker.vehicle.vehicle() + ' servis i popravak',
      price: parseFloat(faker.commerce.price({ min: 50, max: 5000, dec: 2 })),
      serviceDate: faker.date.past({ years: 1 }),
    };
  });

  for (const record of serviceRecords) {
    await prisma.serviceRecord.create({ data: record });
  }

  console.log('✅ ServiceRecords seeded');
};