require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const sequelize = require('./config/database');
const authRoutes = require('./routes/auth');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use('/api/auth', authRoutes);
const ticketRoutes = require('./routes/tickets');
app.use('/api/tickets', ticketRoutes);

// Test database connection and sync models
sequelize
  .sync()
  .then(() => console.log('Database synced'))
  .catch(err => console.log('Error syncing database: ', err));

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
