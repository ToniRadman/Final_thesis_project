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
  // Prvo korisnici, jer se mnogi drugi entiteti vežu za korisnike (npr. prodaje, rezervacije)
  await seedUsers(prisma);

  // Zatim dobavljači jer dijelovi imaju FK na dobavljača
  await seedSuppliers(prisma);

  // Automobili mogu ovisiti o korisnicima (ako su vlasništvo korisnika) - ako ne, može i ranije
  await seedCars(prisma);

  // Dijelovi ovise o dobavljačima, pa nakon suppliers
  await seedParts(prisma);

  // Inventar može ovisiti o dijelovima
  await seedInventory(prisma);

  // Prodaje ovise o korisnicima, automobilima, dijelovima i zaposlenicima
  await seedSales(prisma);

  // Servisni zapisi ovise o automobilima i korisnicima
  await seedServiceRecords(prisma);

  // Servisni dijelovi ovise o servisnim zapisima i dijelovima
  await seedServiceParts(prisma);

  // Rezervacije (booking) ovise o korisnicima i automobilima
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