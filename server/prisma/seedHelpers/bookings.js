const { BookingStatus, BookingType } = require('@prisma/client');

module.exports = async function seedBookings(prisma) {
  await prisma.booking.deleteMany();

  const customers = await prisma.user.findMany({ where: { role: 'KLIJENT' } });
  const staffMembers = await prisma.user.findMany({ where: { role: 'ZAPOSLENIK' } });
  const cars = await prisma.car.findMany();

  if (customers.length === 0 || staffMembers.length === 0 || cars.length === 0) {
    console.warn('⚠️ No customers, staff, or cars found. Skipping bookings seed.');
    return;
  }

  if (cars.length < 4 || customers.length < 5 || staffMembers.length < 5) {
    console.warn('⚠️ Not enough data to create all sample bookings.');
    return;
  }

  const bookings = [
    {
      customerId: customers[0].id,
      staffId: staffMembers[0 % staffMembers.length].id,
      carId: cars[0]?.id,
      bookingType: BookingType.TEST_DRIVE,
      date: new Date('2025-07-01T10:00:00'),
      status: BookingStatus.CONFIRMED,
    },
    {
      customerId: customers[1 % customers.length].id,
      staffId: staffMembers[1 % staffMembers.length].id,
      carId: cars[1 % cars.length]?.id,
      bookingType: BookingType.INSPECTION,
      date: new Date('2025-07-03T13:00:00'),
      status: BookingStatus.PENDING,
    },
    {
      customerId: customers[2 % customers.length].id,
      staffId: staffMembers[2 % staffMembers.length].id,
      carId: cars[2 % cars.length]?.id,
      bookingType: BookingType.SERVICE,
      date: new Date('2025-07-05T15:30:00'),
      status: BookingStatus.COMPLETED,
    },
    {
      customerId: customers[3 % customers.length].id,
      staffId: staffMembers[3 % staffMembers.length].id,
      carId: cars[3 % cars.length]?.id,
      bookingType: BookingType.SERVICE,
      date: new Date('2025-07-07T11:00:00'),
      status: BookingStatus.CANCELLED,
    },
    {
      customerId: customers[4 % customers.length].id,
      staffId: staffMembers[4 % staffMembers.length].id,
      carId: cars[0]?.id,
      bookingType: BookingType.TEST_DRIVE,
      date: new Date('2025-07-09T09:30:00'),
      status: BookingStatus.CONFIRMED,
    },
  ];

  for (const booking of bookings) {
    await prisma.booking.create({ data: booking });
  }

  console.log('✅ Bookings seeded');
};