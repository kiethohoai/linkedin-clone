import express from 'express';
import 'dotenv/config';
import authRoutes from './routes/auth.route.js';
import { connectDB } from './lib/db.js';

// App
const app = express();
const PORT = process.env.PORT || 5001;

app.use(express.json());

// Routes
app.use('/api/v1/auth', authRoutes);

app.listen(PORT, async () => {
  console.log(`🚀SERVER RUNNING ON PORT: ${PORT}`);
  await connectDB();
});
