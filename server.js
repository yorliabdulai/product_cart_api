require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const setupSwagger = require('./config/swagger');
const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const cartRoutes = require('./routes/cartRoutes');
const { errorHandler } = require('./middlewares/errorHandler');

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Connect Database
connectDB();

// Setup Swagger
setupSwagger(app);

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);

// Error Handling
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

module.exports = app;