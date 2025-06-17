// prisma/seedHelpers/sales.js

module.exports = async function seedSales(prisma) {
  await prisma.saleItem.deleteMany();
  await prisma.sale.deleteMany();

  const customers = await prisma.user.findMany({ where: { role: 'KLIJENT' }, take: 5 });
  const inventories = await prisma.inventory.findMany({
    where: {
      OR: [
        { carId: { not: null } },
        { partId: { not: null } },
      ],
    },
    take: 10,
  });

  if (!customers.length || !inventories.length) {
    console.log('❌ Nedovoljno podataka za seedanje prodaja');
    return;
  }

  const paymentMethods = ['CARD', 'CASH'];

  for (let i = 0; i < 5; i++) {
    const customer = customers[i % customers.length];
    const inventoryItem = inventories[i % inventories.length];

    // Dobavi cijenu iz povezane tabele car ili part
    let unitPrice = 1000;
    if (inventoryItem.carId) {
      const car = await prisma.car.findUnique({ where: { id: inventoryItem.carId } });
      unitPrice = parseFloat(car?.price?.toString() ?? '10000');
    } else if (inventoryItem.partId) {
      const part = await prisma.part.findUnique({ where: { id: inventoryItem.partId } });
      unitPrice = parseFloat(part?.price?.toString() ?? '100');
    }

    // quantity je random između 1 i 3, a inventory.quantity je BigInt - konvertiraj na Number
    const maxQty = Number(inventoryItem.quantity);
    const quantity = Math.min(Math.floor(Math.random() * 3) + 1, maxQty > 0 ? maxQty : 1);

    const total = unitPrice * quantity;

    await prisma.sale.create({
      data: {
        userId: customer.id,
        paymentMethod: paymentMethods[i % paymentMethods.length],
        total,
        createdAt: new Date(2024, i, 10 + i),
        customerFirstName: customer.firstName,
        customerLastName: customer.lastName,
        customerEmail: customer.email,
        customerPhone: customer.phone ?? '',
        customerAddress: 'N/A', // Ako nemaš adresu u useru, možeš staviti placeholder
        customerCity: 'N/A',
        customerPostalCode: 'N/A',
        saleItems: {
          create: {
            inventoryId: inventoryItem.id,
            quantity,
            price: unitPrice,
          }
        }
      }
    });
  }

  console.log('✅ Sales with SaleItems seeded successfully');
};