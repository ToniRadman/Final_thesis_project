const jwt = require('jsonwebtoken');

const secretKey = process.env.JWT_SECRET || 'tajni_kljuc'; // koristi svoj tajni ključ

// Middleware za provjeru JWT tokena i autentikaciju
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  if (!authHeader) return res.status(401).json({ message: 'Token nije dostavljen' });

  const token = authHeader.split(' ')[1]; // Bearer <token>
  if (!token) return res.status(401).json({ message: 'Token nije validan' });

  jwt.verify(token, secretKey, (err, user) => {
    if (err) return res.status(403).json({ message: 'Token nije validan ili je istekao' });
    req.user = user; // user sadrži payload tokena (npr. id, email, role)
    next();
  });
}

// Middleware za autorizaciju prema ulozi (role može biti string ili niz stringova dozvoljenih uloga)
function authorizeRoles(allowedRoles) {
  return (req, res, next) => {
    if (!req.user) return res.status(401).json({ message: 'Niste autorizirani' });

    const userRole = req.user.role;
    if (Array.isArray(allowedRoles)) {
      if (!allowedRoles.includes(userRole)) {
        return res.status(403).json({ message: 'Nemate pristup ovoj funkcionalnosti' });
      }
    } else {
      if (userRole !== allowedRoles) {
        return res.status(403).json({ message: 'Nemate pristup ovoj funkcionalnosti' });
      }
    }

    next();
  };
}

module.exports = {
  authenticateToken,
  authorizeRoles,
};