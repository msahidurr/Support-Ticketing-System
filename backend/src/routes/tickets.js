const express = require('express');
const {
  createTicket,
  getAllTickets,
  getCustomerTickets,
  updateTicket,
  deleteTicket,
} = require('../controllers/ticketController');
const { verifyToken, isAdmin } = require('../middleware/authMiddleware');
const router = express.Router();

// Routes
router.post('/create', verifyToken, createTicket); // Customer creates a ticket
router.get('/admin', verifyToken, isAdmin, getAllTickets); // Admin views all tickets
router.get('/', verifyToken, getCustomerTickets); // Customer views their tickets
router.put('/update/:id', verifyToken, isAdmin, updateTicket); // Admin updates a ticket
router.delete('/destroy/:id', verifyToken, deleteTicket); // Customer deletes their ticket

module.exports = router;
