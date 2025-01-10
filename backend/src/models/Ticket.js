const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./User');

const Ticket = sequelize.define('Ticket', {
  subject: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  admin_reply: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  status: {
    type: DataTypes.ENUM('Open', 'Resolved', 'Closed'),
    defaultValue: 'Open',
  },
});

Ticket.belongsTo(User, { as: 'customer', foreignKey: 'customer_id' });
Ticket.belongsTo(User, { as: 'admin', foreignKey: 'admin_id' });

module.exports = Ticket;
