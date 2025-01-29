import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import authRoutes from './routes/auth';
import gadgetRoutes from './routes/gadget';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8000;

// Middleware
app.use(cors());
app.use(express.json());

// root route
app.get("/", (req: Request, res: Response) => {
  res.status(200).json({ success: true, message: "welcome to IMF_GADGET_API" });
});

// Routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/gadgets', gadgetRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

