import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/userModel.js';
import connectDB from './config/db.js';
import path from 'path';

// Fix path for dotenv
dotenv.config();

const checkUsers = async () => {
  try {
    // Manually pass URI if env fails in this script context
    const uri = process.env.MONGO_URI || 'mongodb://localhost:27017/agrimart';
    console.log(`Connecting to: ${uri}`);
    await mongoose.connect(uri);
    
    const users = await User.find({});
    console.log('--- USER LIST START ---');
    console.log(`Total users found: ${users.length}`);
    users.forEach(u => {
      console.log(`- Name: ${u.name}, Email: ${u.email}, isAdmin: ${u.isAdmin}, Mobile: ${u.mobile}`);
    });
    console.log('--- USER LIST END ---');
    process.exit();
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

checkUsers();
