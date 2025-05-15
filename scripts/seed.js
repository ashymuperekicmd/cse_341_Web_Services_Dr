const mongoose = require('mongoose');
const Contact = require('./models/contact');
require('dotenv').config();

const sampleContacts = [
  {
    firstName: 'John',
    lastName: 'Doe',
    email: 'john@example.com',
    favoriteColor: 'Blue',
    birthday: new Date('1990-01-01')
  },
  {
    firstName: 'Jane',
    lastName: 'Smith',
    email: 'jane@example.com',
    favoriteColor: 'Green',
    birthday: new Date('1985-05-15')
  }
];

async function seedDB() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected for seeding');
    
    await Contact.deleteMany();
    console.log('Cleared existing contacts');
    
    await Contact.insertMany(sampleContacts);
    console.log('Added sample contacts');
    
    process.exit(0);
  } catch (err) {
    console.error('Seeding error:', err);
    process.exit(1);
  }
}

seedDB();