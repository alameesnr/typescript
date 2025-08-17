
import express from 'express';
import dotenv from 'dotenv';
import { connectDB } from './config/db';
import authRoutes from './routes/authRoutes';
import hospitalRoutes from "./routes/hos.routes";

dotenv.config();

const app = express();
const port = process.env.PORT || 1010;
app.use(express.json());
app.use(express.json());
app.use(express.urlencoded({ extended: true })); 


app.use('/api/auth', authRoutes);
app.use("/api", hospitalRoutes);


app.get('/', (req, res) => {
  res.send('API is running...');
});


connectDB()
  .then(() => {
    app.listen(port, () => {
      console.log(`Server is running on http://localhost:${port}`);
    });
  })
  .catch((err) => {
    console.error('Failed to connect to DB:', err);
    process.exit(1);
  });
