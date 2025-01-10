const Ticket = require('../models/Ticket');
const User = require('../models/User');

// Create a new ticket
exports.createTicket = async (req, res) => {
  const { subject, description } = req.body;
  const customerId = req.user.id; // Assuming user ID is extracted from the JWT in middleware.

  try {
    const ticket = await Ticket.create({
      subject,
      description,
      customer_id: customerId,
      admin_id: null, // Automatically assign to Admin (can be updated later)
    });

    res.status(201).json({ message: 'Ticket created successfully', ticket });
  } catch (err) {
    res.status(500).json({ message: 'Error creating ticket', error: err });
  }
};

// Get all tickets (Admin only)
exports.getAllTickets = async (req, res) => {
  try {
    const tickets = await Ticket.findAll({
      include: [
        { model: User, as: 'customer', attributes: ['username'] },
        { model: User, as: 'admin', attributes: ['username'] },
      ],
      order: [['updatedAt', 'DESC']]
    });

    res.status(200).json({ tickets });
  } catch (err) {
    res.status(500).json({ message: 'Error fetching tickets', error: err });
  }
};

// Get tickets for a specific customer
exports.getCustomerTickets = async (req, res) => {
  const customerId = req.user.id; // Assuming user ID is extracted from the JWT in middleware.

  try {
    const tickets = await Ticket.findAll({
      where: { customer_id: customerId },
      include: [{ model: User, as: 'admin', attributes: ['username'] }],
      order: [['updatedAt', 'DESC']]
    });

    res.status(200).json({ tickets });
  } catch (err) {
    res.status(500).json({ message: 'Error fetching customer tickets', error: err });
  }
};

// Update a ticket's status or reply (Admin only)
exports.updateTicket = async (req, res) => {
  const { id } = req.params; // Ticket ID
  const { status, subject, description, adminReply } = req.body;

  try {
    const ticket = await Ticket.findByPk(id);
    if (!ticket) return res.status(404).json({ message: 'Ticket not found' });

    // Update ticket status or add admin reply
    ticket.subject = subject;
    ticket.description = description;
    if (status) ticket.status = status;
    if (adminReply) ticket.admin_reply = adminReply;

    await ticket.save();

    res.status(200).json({ message: 'Ticket updated successfully', ticket });
  } catch (err) {
    res.status(500).json({ message: 'Error updating ticket', error: err });
  }
};

// Delete a ticket (Customer only)
exports.deleteTicket = async (req, res) => {
  const { id } = req.params; // Ticket ID
  const customerId = req.user.id; // Assuming user ID is extracted from the JWT in middleware.

  try {
    const ticket = await Ticket.findOne({ where: { id, customer_id: customerId } });
    if (!ticket) return res.status(404).json({ message: 'Ticket not found or unauthorized' });

    await ticket.destroy();

    res.status(200).json({ message: 'Ticket deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting ticket', error: err });
  }
};
