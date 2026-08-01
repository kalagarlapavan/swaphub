import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import User from './models/User.js';
import Item from './models/Item.js';
import ExchangeRequest from './models/ExchangeRequest.js';
import { mockUsers, mockItems } from './seedData.js';

dotenv.config();

const seedDB = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/swaphub';
    console.log(`Connecting to MongoDB at ${mongoUri}...`);
    await mongoose.connect(mongoUri);
    console.log('Connected successfully!');

    // Clear existing data
    console.log('Clearing old data collections...');
    await User.deleteMany();
    await Item.deleteMany();
    await ExchangeRequest.deleteMany();
    console.log('Collections cleared.');

    // Encrypt passwords of seed users
    const saltedUsers = await Promise.all(
      mockUsers.map(async (u) => {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(u.password, salt);
        return {
          ...u,
          password: hashedPassword,
        };
      })
    );

    // Insert Users
    console.log('Inserting seed users...');
    const createdUsers = await User.insertMany(saltedUsers);
    console.log(`Inserted ${createdUsers.length} users.`);

    // Map item owners to created users database IDs
    // index 0, 3 -> User 0 (Alice)
    // index 2, 4 -> User 1 (Bob)
    // index 1, 5 -> User 2 (Clara)
    const updatedItems = mockItems.map((item, idx) => {
      let ownerId;
      if (idx === 0 || idx === 3) ownerId = createdUsers[0]._id;
      else if (idx === 2 || idx === 4) ownerId = createdUsers[1]._id;
      else ownerId = createdUsers[2]._id;

      // Delete hardcoded string _id so mongoose creates native ObjectIds
      const { _id, ...itemFields } = item;
      return {
        ...itemFields,
        owner: ownerId,
      };
    });

    // Insert Items
    console.log('Inserting seed items...');
    const createdItems = await Item.insertMany(updatedItems);
    console.log(`Inserted ${createdItems.length} items.`);

    console.log('Database Seeding Successful! 🎉');
    process.exit(0);
  } catch (error) {
    console.error('Seeding database failed:', error.message);
    process.exit(1);
  }
};

seedDB();
