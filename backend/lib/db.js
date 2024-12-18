import mongoose from 'mongoose';

export const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`🚀MongoDB Connected`);
  } catch (error) {
    console.log(`🚀Error connect to MongoDB: ${error.message}`);
    process.exit(1);
  }
};
