import express from "express";
import "dotenv/config";
import authRoutes from "./routes/auth.route.js";

// App
const app = express();
const PORT = process.env.PORT || 5001;

// Routes
app.use("/api/v1/auth", authRoutes);

app.listen(PORT, () => {
  console.log(`🚀SERVER RUNNING ON PORT: ${PORT}`);
});
