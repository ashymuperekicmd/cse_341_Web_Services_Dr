const express = require('express');
const router = express.Router();
const { isValidObjectId } = require('mongoose');
const Contact = require('../models/contact');

// Async handler wrapper
const asyncHandler = fn => (req, res, next) => 
  Promise.resolve(fn(req, res, next)).catch(next);

/**
 * @swagger
 * tags:
 *   name: Contacts
 *   description: Contact management
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Contact:
 *       type: object
 *       required:
 *         - firstName
 *         - lastName
 *         - email
 *         - favoriteColor
 *         - birthday
 *       properties:
 *         _id:
 *           type: string
 *           description: The auto-generated ID of the contact
 *         firstName:
 *           type: string
 *           description: The first name of the contact
 *         lastName:
 *           type: string
 *           description: The last name of the contact
 *         email:
 *           type: string
 *           format: email
 *           description: The email address of the contact
 *         favoriteColor:
 *           type: string
 *           description: The favorite color of the contact
 *         birthday:
 *           type: string
 *           format: date
 *           description: The birthday of the contact (YYYY-MM-DD)
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: The date the contact was created
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: The date the contact was last updated
 *       example:
 *         _id: 507f1f77bcf86cd799439011
 *         firstName: John
 *         lastName: Doe
 *         email: john@example.com
 *         favoriteColor: blue
 *         birthday: 1990-01-01
 *         createdAt: 2023-01-01T00:00:00.000Z
 *         updatedAt: 2023-01-01T00:00:00.000Z
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
 *           default: 20
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
 *       500:
 *         description: Server error
 */
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
 *       400:
 *         description: Invalid ID format
 *       404:
 *         description: Contact not found
 *       500:
 *         description: Server error
 */
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
 *       500:
 *         description: Server error
 */
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
 *       400:
 *         description: Invalid ID format or validation error
 *       404:
 *         description: Contact not found
 *       500:
 *         description: Server error
 */
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
 *       400:
 *         description: Invalid ID format
 *       404:
 *         description: Contact not found
 *       500:
 *         description: Server error
 */
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