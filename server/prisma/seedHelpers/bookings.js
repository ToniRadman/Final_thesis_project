const { BookingStatus, BookingType } = require('@prisma/client');

module.exports = async function seedBookings(prisma) {
  await prisma.booking.deleteMany();
  const users = await prisma.user.findMany({ where: { role: 'KLIJENT' } });
  const cars = await prisma.car.findMany();

  if (users.length === 0 || cars.length === 0) {
    console.warn('⚠️ No users or cars found. Skipping bookings seed.');
    return;
  }

  const bookings = [
    {
      userId: users[0].id,
      carId: cars[0]?.id,
      type: BookingType.TEST_DRIVE,
      date: new Date('2025-07-01T10:00:00'),
      status: BookingStatus.CONFIRMED,
    },
    {
      userId: users[1 % users.length].id,
      carId: cars[1 % cars.length]?.id,
      type: BookingType.INSPECTION,
      date: new Date('2025-07-03T13:00:00'),
      status: BookingStatus.PENDING,
    },
    {
      userId: users[2 % users.length].id,
      carId: cars[2 % cars.length]?.id,
      type: BookingType.SERVICE,
      date: new Date('2025-07-05T15:30:00'),
      status: BookingStatus.COMPLETED,
    },
    {
      userId: users[3 % users.length].id,
      carId: null,
      type: BookingType.SERVICE,
      date: new Date('2025-07-07T11:00:00'),
      status: BookingStatus.CANCELLED,
    },
    {
      userId: users[4 % users.length].id,
      carId: cars[0]?.id,
      type: BookingType.TEST_DRIVE,
      date: new Date('2025-07-09T09:30:00'),
      status: BookingStatus.CONFIRMED,
    },
  ];

  for (const booking of bookings) {
    await prisma.booking.create({ data: booking });
  }

  console.log('✅ Bookings seeded');
};