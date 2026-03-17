const mongoose = require('mongoose');
require('dotenv').config();

const Pet = require('./models/Pet');

const run = async () => {
  await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/fyp_db');
  const pets = await Pet.find({ status: 'pending' });
  let fixedCount = 0;

  for (const pet of pets) {
    // Check if there are any active applications
    const hasActiveApps = pet.applications && pet.applications.some(
      a => a.status === 'pending' || a.status === 'reviewing'
    );
    
    if (!hasActiveApps) {
      console.log(`Fixing pet ${pet.name}: changing status from pending to available`);
      pet.status = 'available';
      await pet.save();
      fixedCount++;
    }
  }
  
  console.log(`Fixed ${fixedCount} stranded pets.`);
  process.exit(0);
};
run();
