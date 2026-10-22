import bcrypt from 'bcryptjs';

const users = [
  {
    name: 'Admin User',
    email: 'admin@example.com',
    mobile: '9876543210',
    password: 'password123',
    isAdmin: true,
    isVerified: true,
  },
  {
    name: 'Farmer John',
    email: 'john@example.com',
    mobile: '9876543211',
    password: 'password123',
    isAdmin: false,
    isVerified: true,
    farmDetails: {
      farmSize: '5 Acres',
      cropTypes: ['Wheat', 'Rice'],
      location: 'Punjab',
    },
  },
  {
    name: 'Farmer Sam',
    email: 'sam@example.com',
    mobile: '9876543212',
    password: 'password123',
    isAdmin: false,
    farmDetails: {
      farmSize: '2 Acres',
      cropTypes: ['Tomato', 'Chilli'],
      location: 'Karnataka',
    },
  },
];

export default users;
