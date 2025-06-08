const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const JWT_SECRET = process.env.JWT_SECRET;

async function registerUser(req, res) {
  const { firstName, lastName, email, password, role } = req.body;

  try {
    // Provjera postoji li korisnik
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: 'Email već postoji' });
    }

    // Hashiranje lozinke
    const hashedPassword = await bcrypt.hash(password, 10);

    // Kreiranje korisnika
    const user = await prisma.user.create({
      data: {
        firstName,
        lastName,
        email,
        password: hashedPassword,  // **VAŽNO** - dodaj polje password u User model u Prisma schema!
        role,
      },
    });

    res.status(201).json({ message: 'Korisnik uspješno registriran' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Greška na serveru' });
  }
}

async function loginUser(req, res) {
  const { email, password } = req.body;

  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(400).json({ message: 'Neispravan email ili lozinka' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Neispravan email ili lozinka' });

    // Generiraj JWT token
    const token = jwt.sign(
      { userId: user.id, role: user.role },
      JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.json({ token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Greška na serveru' });
  }
}

module.exports = {
  registerUser,
  loginUser,
};