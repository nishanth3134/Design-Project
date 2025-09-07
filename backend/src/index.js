import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import schemesRoutes from './routes/Schemes.js';
import eligibilityRoutes from './routes/eligibility.js';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Connect to MongoDB
const MONGO = process.env.MONGO_URI || 'mongodb://localhost:27017/';
mongoose.connect(MONGO, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(()=> console.log('✅ MongoDB connected'))
  .catch(err => { console.error('Mongo connection error', err); process.exit(1); });

app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

app.use('/api/schemes', schemesRoutes);
app.use('/api/eligibility', eligibilityRoutes);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`🚀 Backend running: http://localhost:${PORT}`));
