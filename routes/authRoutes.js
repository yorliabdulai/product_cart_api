const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const router = express.Router();

// Ensure a valid password is used
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'defaultSecurePassword';
const saltRounds = 10;

// Pre-hash the password
const hashedPassword = bcrypt.hashSync(ADMIN_PASSWORD, saltRounds);

router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    if (username !== process.env.ADMIN_USERNAME) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Compare passwords
    const isMatch = bcrypt.compareSync(password, hashedPassword);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Generate token
    const token = jwt.sign(
      { user: { id: username } }, 
      process.env.JWT_SECRET, 
      { expiresIn: '1h' }
    );

    res.json({ token });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;