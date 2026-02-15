import path from 'path';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

const __dirname = path.resolve();
dotenv.config();

import users from './data/users.js';
import products from './data/products.js';
import knowledgePosts from './data/knowledge.js';
import User from './models/userModel.js';
import Product from './models/productModel.js';
import Order from './models/orderModel.js';
import Knowledge from './models/knowledgeModel.js';
import connectDB from './config/db.js';

const importData = async () => {
  try {
    // Wait for connection to be established before doing anything
    await connectDB();
    
    console.log('Deleting existing data...');
    await Order.deleteMany();
    await Product.deleteMany();
    await User.deleteMany();
    await Knowledge.deleteMany();

    console.log('Inserting users...');
    // We insert users one by one to ensure the 'save' middleware (password hashing) runs
    const createdUsers = [];
    for (const u of users) {
      const user = new User(u);
      await user.save();
      createdUsers.push(user);
    }
    console.log(`Inserted ${createdUsers.length} users`);

    const adminUser = createdUsers[0]._id;

    const sampleProducts = products.map((product) => {
      return { ...product, user: adminUser };
    });

    console.log('Inserting products...');
    await Product.insertMany(sampleProducts);
    console.log('Inserting knowledge posts...');
    await Knowledge.insertMany(knowledgePosts);

    console.log('Data Imported!');
    process.exit();
  } catch (error) {
    console.error(`${error}`);
    process.exit(1);
  }
};

const destroyData = async () => {
  try {
    await connectDB();
    await Order.deleteMany();
    await Product.deleteMany();
    await User.deleteMany();
    await Knowledge.deleteMany();

    console.log('Data Destroyed!');
    process.exit();
  } catch (error) {
    console.error(`${error}`);
    process.exit(1);
  }
};

if (process.argv[2] === '-d') {
  destroyData();
} else {
  importData();
}
