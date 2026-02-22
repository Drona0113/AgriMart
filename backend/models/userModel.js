import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    mobile: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    isAdmin: {
      type: Boolean,
      required: true,
      default: false,
    },
    role: {
      type: String,
      default: 'user', // Possible values: 'user', 'farmer', 'supplier', 'secretariat_staff'
    },
    isFarmer: {
      type: Boolean,
      required: true,
      default: false,
    },
    isSupplier: {
      type: Boolean,
      required: true,
      default: false,
    },
    govtId: {
      type: String,
      default: null,
      validate: {
        validator: function (v) {
          // If no ID is provided (null/undefined), it's valid (for regular users)
          if (!v) return true;
          // If ID is provided, it must be alphanumeric and between 10-16 characters
          return /^[A-Z0-9]{10,16}$/i.test(v);
        },
        message: (props) => `${props.value} is not a valid Government ID format! Must be 10-16 alphanumeric characters.`,
      },
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    image: {
      type: String,
    },
    farmDetails: {
      farmSize: String,
      cropTypes: [String],
      location: String,
    },
    address: {
      street: String,
      city: String,
      state: String,
      pincode: String,
      landmark: String,
    },
  },
  {
    timestamps: true,
  }
);

userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

const User = mongoose.model('User', userSchema);

export default User;
