// prisma/seeds/seedSales.js

const WayOfPayment = {
  CARD: 1,
  CASH_ON_PICKUP: 2,
};

module.exports = async function seedSales(prisma) {
  // Pretpostavljamo da već postoje korisnici, automobili i dijelovi
  const customers = await prisma.user.findMany({ where: { role: 'KLIJENT' }, take: 5 });
  const employees = await prisma.user.findMany({ where: { role: 'ZAPOSLENIK' }, take: 5 });
  const cars = await prisma.car.findMany({ take: 5 });
  const parts = await prisma.part.findMany({ take: 5 });

  if (customers.length === 0) {
    console.log('❌ Nema korisnika za kreiranje prodaja');
    return;
  }

  const salesData = [
    {
      carId: cars[0]?.id,
      partId: null,
      employeeId: employees[0]?.id,
      customerId: customers[0].id,
      saleDate: new Date('2024-01-15T10:00:00Z'),
      totalPrice: 15000.00,
      wayOfPayment: WayOfPayment.CARD,
    },
    {
      carId: null,
      partId: parts[0]?.id,
      employeeId: employees[1]?.id,
      customerId: customers[1].id,
      saleDate: new Date('2024-02-20T12:30:00Z'),
      totalPrice: 250.00,
      wayOfPayment: WayOfPayment.CASH_ON_PICKUP,
    },
    {
      carId: cars[1]?.id,
      partId: null,
      employeeId: employees[2]?.id,
      customerId: customers[2].id,
      saleDate: new Date('2024-03-05T14:00:00Z'),
      totalPrice: 18000.00,
      wayOfPayment: WayOfPayment.CARD,
    },
    {
      carId: null,
      partId: parts[1]?.id,
      employeeId: employees[3]?.id,
      customerId: customers[3].id,
      saleDate: new Date('2024-04-10T09:00:00Z'),
      totalPrice: 350.00,
      wayOfPayment: WayOfPayment.CASH_ON_PICKUP,
    },
    {
      carId: cars[2]?.id,
      partId: null,
      employeeId: employees[4]?.id,
      customerId: customers[4].id,
      saleDate: new Date('2024-05-22T16:45:00Z'),
      totalPrice: 22000.00,
      wayOfPayment: WayOfPayment.CARD,
    },
  ];

  for (const sale of salesData) {
    await prisma.sale.create({ data: sale });
  }

  console.log('✅ Sales seeded');
};