const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const router = express.Router();

// One-time password hash generation (do this ONCE)
const hashedAdminPassword = bcrypt.hashSync(process.env.ADMIN_PASSWORD, 10);

router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    // Validate username
    if (username !== process.env.ADMIN_USERNAME) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Secure password comparison
    const isMatch = await bcrypt.compare(password, hashedAdminPassword);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Generate secure JWT token
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