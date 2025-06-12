const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const bcrypt = require('bcryptjs');
const { convertBigInts } = require('../utils/ConvertBigInts');

// Dohvati sve korisnike - samo ADMIN može
async function getAllUsers(req, res) {
  try {
    const users = await prisma.user.findMany({
      select: { id: true, firstName: true, lastName: true, email: true, phone: true, role: true },
    });
    res.json(convertBigInts(users));
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Greška na serveru' });
  }
}

// Dohvati korisnika po id-u - ADMIN ili sam korisnik
async function getUserById(req, res) {
  const { id } = req.params;
  const requesterId = req.user.userId;
  const requesterRole = req.user.role;

  if (requesterRole !== 'ADMIN' && requesterId !== Number(id)) {
    return res.status(403).json({ message: 'Nemaš pristup ovom korisniku' });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: Number(id) },
      select: { id: true, firstName: true, lastName: true, email: true, phone: true, role: true },
    });
    if (!user) return res.status(404).json({ message: 'Korisnik nije pronađen' });
    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Greška na serveru' });
  }
}

// Update korisnika - ADMIN ili sam korisnik
async function updateUser(req, res) {
  const { id } = req.params;
  const requesterId = req.user.userId;
  const requesterRole = req.user.role;
  const { firstName, lastName, email, phone, role, password } = req.body;

  if (requesterRole !== 'ADMIN' && requesterId !== Number(id)) {
    return res.status(403).json({ message: 'Nemaš pristup ovoj akciji' });
  }

  try {
    // Ako dolazi password, hashiraj ga prije spremanja
    let hashedPassword;
    if (password) {
      hashedPassword = await bcrypt.hash(password, 10);
    }

    const updatedUser = await prisma.user.update({
      where: { id: Number(id) },
      data: {
        firstName,
        lastName,
        email,
        phone,
        role: requesterRole === 'ADMIN' ? role : undefined, // samo ADMIN može mijenjati ulogu
        password: hashedPassword ? hashedPassword : undefined,
      },
      select: { id: true, firstName: true, lastName: true, email: true, phone: true, role: true },
    });

    res.json(updatedUser);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Greška na serveru' });
  }
}

async function updateOwnProfile(req, res) {
  const userId = req.user.userId;
  const { firstName, lastName, phone } = req.body;

  try {
    const updatedUser = await prisma.user.update({
      where: { id: Number(userId) },
      data: { firstName, lastName, phone },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        phone: true,
        role: true,
      },
    });

    res.json(updatedUser);
  } catch (error) {
    console.error('Greška pri ažuriranju profila:', error);
    res.status(500).json({ message: 'Greška na serveru' });
  }
}

// Delete korisnika - samo ADMIN
async function deleteUser(req, res) {
  const { id } = req.params;
  const requesterRole = req.user.role;

  if (requesterRole !== 'ADMIN') {
    return res.status(403).json({ message: 'Samo admin može brisati korisnike' });
  }

  try {
    await prisma.user.delete({ where: { id: Number(id) } });
    res.json({ message: 'Korisnik je obrisan' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Greška na serveru' });
  }
}

module.exports = {
  getAllUsers,
  getUserById,
  updateUser,
  updateOwnProfile,
  deleteUser,
};