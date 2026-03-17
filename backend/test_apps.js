const mongoose = require('mongoose');
require('dotenv').config();

const Pet = require('./models/Pet');

const run = async () => {
  await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/fyp_db');
  const pets = await Pet.find({}).populate('rehomer', 'name');
  
  pets.forEach(p => {
    if (p.applications && p.applications.length > 0) {
      console.log(`Pet: ${p.name} (${p.status})`);
      p.applications.forEach(a => {
        console.log(`  App from: ${a.adopter} - Status: ${a.status}`);
      });
    }
  });
  console.log('Done!');
  process.exit(0);
};
run();
