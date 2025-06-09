module.exports = async function seedInventory(prisma) {
  // Pretpostavimo da vec postoji 5 auta (id 1-5) i 5 dijelova (id 1-5)
  const inventoryItems = [
    { carId: 1, quantity: 3 },
    { carId: 2, quantity: 2 },
    { carId: 3, quantity: 4 },
    { partId: 1, quantity: 50 },
    { partId: 2, quantity: 75 },
    { partId: 3, quantity: 20 },
    { partId: 4, quantity: 15 },
    { partId: 5, quantity: 10 },
    { carId: 4, quantity: 1 },
    { carId: 5, quantity: 2 },
  ];

  for (const item of inventoryItems) {
    await prisma.inventory.create({ data: item });
  }

  console.log('✅ Inventory seeded');
};