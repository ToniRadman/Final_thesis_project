const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const seedUsers = require('./seedHelpers/users');
const seedCars = require('./seedHelpers/cars');
const seedSuppliers = require('./seedHelpers/suppliers');
const seedParts = require('./seedHelpers/parts');
const seedInventory = require('./seedHelpers/inventory');
const seedSales = require('./seedHelpers/sales');
const seedServiceRecords = require('./seedHelpers/serviceRecords');
const seedServiceParts = require('./seedHelpers/serviceParts');
const seedBookings = require('./seedHelpers/bookings');

async function main() {
  await seedUsers(prisma);
  await seedCars(prisma);
  await seedSuppliers(prisma);
  await seedParts(prisma);
  await seedInventory(prisma);
  await seedSales(prisma);
  await seedServiceRecords(prisma);
  await seedServiceParts(prisma);
  await seedBookings(prisma);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });