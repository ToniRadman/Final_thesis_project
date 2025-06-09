module.exports = async function seedServiceParts(prisma) {
  await prisma.servicePart.deleteMany();
  const serviceRecords = await prisma.serviceRecord.findMany({ take: 5 });
  const parts = await prisma.part.findMany({ take: 5 });

  if (serviceRecords.length === 0 || parts.length === 0) {
    console.warn('❗ Skipping ServiceParts seed: Missing service records or parts');
    return;
  }

  const servicePartsData = [
    { serviceId: serviceRecords[0].id, partId: parts[0].id, quantity: 2 },
    { serviceId: serviceRecords[0].id, partId: parts[1].id, quantity: 1 },
    { serviceId: serviceRecords[1].id, partId: parts[2].id, quantity: 3 },
    { serviceId: serviceRecords[2].id, partId: parts[3].id, quantity: 2 },
    { serviceId: serviceRecords[3].id, partId: parts[4].id, quantity: 1 },
  ];

  for (const sp of servicePartsData) {
    await prisma.servicePart.create({ data: sp });
  }

  console.log('✅ ServiceParts seeded');
};