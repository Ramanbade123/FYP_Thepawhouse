const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

// Models
const Pet = require('../models/Pet');
const User = require('../models/User');

// Load env vars
dotenv.config({ path: path.join(__dirname, '../.env') });

const cleanup = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/pawhouse');
    console.log('📦 Connected to database for cleanup...');

    // 1. Get all pets
    const pets = await Pet.find({});
    console.log(`🔍 Checking ${pets.length} pets...`);

    let deletedCount = 0;

    for (const pet of pets) {
      if (!pet.rehomer) {
        console.log(`🚮 Deleting pet "${pet.name}" (No rehomer ID)`);
        await Pet.deleteOne({ _id: pet._id });
        deletedCount++;
        continue;
      }

      // 2. Check if rehomer exists
      const rehomerExists = await User.exists({ _id: pet.rehomer });
      
      if (!rehomerExists) {
        console.log(`🚮 Deleting orphaned pet "${pet.name}" (Rehomer ${pet.rehomer} no longer exists)`);
        await Pet.deleteOne({ _id: pet._id });
        deletedCount++;
      }
    }

    console.log(`✅ Cleanup complete. Deleted ${deletedCount} orphaned pets.`);
    process.exit(0);
  } catch (err) {
    console.error('❌ Cleanup failed:', err);
    process.exit(1);
  }
};

cleanup();
