const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Contact = require('../models/Contact');

// Get all contacts
router.get('/', auth, async (req, res) => {
  try {
    const contacts = await Contact.find({ user: req.user.id });
    res.json(contacts);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

// Add a contact
router.post('/', auth, async (req, res) => {
  const { name, email, phone } = req.body;
  if (!name || !email || !phone) {
    return res.status(400).json({ msg: 'Name, email, and phone are required.' });
  }
  // Optionally validate email/phone format
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ msg: 'Invalid email format.' });
  }
  if (!/^\d{10,15}$/.test(phone)) {
    return res.status(400).json({ msg: 'Invalid phone number.' });
  }
  try {
    const contact = new Contact({ ...req.body, user: req.user.id });
    await contact.save();
    res.json(contact);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

// Update a contact
router.put('/:id', auth, async (req, res) => {
  try {
    const contact = await Contact.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      req.body,
      { new: true }
    );
    if (!contact) return res.status(404).json({ msg: 'Contact not found.' });
    res.json(contact);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

// Delete a contact
router.delete('/:id', auth, async (req, res) => {
  try {
    const contact = await Contact.findOneAndDelete({ _id: req.params.id, user: req.user.id });
    if (!contact) return res.status(404).json({ msg: 'Contact not found.' });
    res.json({ msg: 'Contact deleted' });
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

module.exports = router;