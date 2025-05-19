const express = require('express');
const router = express.Router();
const { isValidObjectId } = require('mongoose');
const Contact = require('../models/contact');

// Async handler wrapper
const asyncHandler = fn => (req, res, next) => 
  Promise.resolve(fn(req, res, next)).catch(next);

// GET all contacts with filtering
router.get('/', asyncHandler(async (req, res) => {
  const { color, limit = 20 } = req.query;
  const query = {};
  
  if (color) query.favoriteColor = color;
  
  const contacts = await Contact.find(query)
    .select('firstName lastName email favoriteColor')
    .limit(parseInt(limit));
  
  res.set('Cache-Control', 'public, max-age=300');
  res.json(contacts);
}));

// GET single contact
router.get('/:id', asyncHandler(async (req, res) => {
  if (!isValidObjectId(req.params.id)) {
    return res.status(400).json({ error: 'Invalid ID format' });
  }
  
  const contact = await Contact.findById(req.params.id)
    .select('-__v');
  
  if (!contact) {
    return res.status(404).json({ error: 'Contact not found' });
  }
  
  res.json(contact);
}));

// POST create new contact
router.post('/', asyncHandler(async (req, res) => {
  const { firstName, lastName, email, favoriteColor, birthday } = req.body;
  
  const newContact = await Contact.create({
    firstName,
    lastName,
    email,
    favoriteColor,
    birthday
  });
  
  res.status(201).json({ 
    _id: newContact._id,
    message: 'Contact created successfully'
  });
}));

// PUT update existing contact
router.put('/:id', asyncHandler(async (req, res) => {
  if (!isValidObjectId(req.params.id)) {
    return res.status(400).json({ error: 'Invalid ID format' });
  }
  
  const updatedContact = await Contact.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true, runValidators: true }
  );
  
  if (!updatedContact) {
    return res.status(404).json({ error: 'Contact not found' });
  }
  
  res.status(200).json({
    message: 'Contact updated successfully'
  });
}));

// DELETE contact
router.delete('/:id', asyncHandler(async (req, res) => {
  if (!isValidObjectId(req.params.id)) {
    return res.status(400).json({ error: 'Invalid ID format' });
  }
  
  const deletedContact = await Contact.findByIdAndDelete(req.params.id);
  
  if (!deletedContact) {
    return res.status(404).json({ error: 'Contact not found' });
  }
  
  res.status(204).end();
}));

module.exports = router;

/**
 * @swagger
 * tags:
 *   name: Contacts
 *   description: Contact management
 */

/**
 * @swagger
 * /contacts:
 *   get:
 *     summary: Get all contacts
 *     tags: [Contacts]
 *     parameters:
 *       - in: query
 *         name: color
 *         schema:
 *           type: string
 *         description: Filter by favorite color
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Limit number of results
 *     responses:
 *       200:
 *         description: List of contacts
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Contact'
 */
router.get('/', asyncHandler(async (req, res) => {
  // ... existing implementation
}));

/**
 * @swagger
 * /contacts/{id}:
 *   get:
 *     summary: Get a contact by ID
 *     tags: [Contacts]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Contact ID
 *     responses:
 *       200:
 *         description: Contact data
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Contact'
 *       404:
 *         description: Contact not found
 *       400:
 *         description: Invalid ID format
 */
router.get('/:id', asyncHandler(async (req, res) => {
  // ... existing implementation
}));

/**
 * @swagger
 * /contacts:
 *   post:
 *     summary: Create a new contact
 *     tags: [Contacts]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Contact'
 *     responses:
 *       201:
 *         description: Contact created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                   description: The created contact ID
 *                 message:
 *                   type: string
 *       400:
 *         description: Validation error
 */
router.post('/', asyncHandler(async (req, res) => {
  // ... existing implementation
}));

/**
 * @swagger
 * /contacts/{id}:
 *   put:
 *     summary: Update a contact
 *     tags: [Contacts]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Contact ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Contact'
 *     responses:
 *       200:
 *         description: Contact updated successfully
 *       404:
 *         description: Contact not found
 *       400:
 *         description: Invalid ID format or validation error
 */
router.put('/:id', asyncHandler(async (req, res) => {
  // ... existing implementation
}));

/**
 * @swagger
 * /contacts/{id}:
 *   delete:
 *     summary: Delete a contact
 *     tags: [Contacts]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Contact ID
 *     responses:
 *       204:
 *         description: Contact deleted successfully
 *       404:
 *         description: Contact not found
 *       400:
 *         description: Invalid ID format
 */
router.delete('/:id', asyncHandler(async (req, res) => {
  // ... existing implementation
}));