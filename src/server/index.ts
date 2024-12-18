import express from 'express';
import cors from 'cors';
import { config } from 'dotenv';
import { connectDB } from './db/connect.js';
import { Party } from './models/Party.js';

// Load environment variables
config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
connectDB();

// Get all waiting parties
app.get('/api/waitlist', async (req, res) => {
  try {
    const parties = await Party.find({ status: 'waiting' }).sort({ timestamp: 1 });
    res.json(parties);
  } catch (error) {
    console.error('Error fetching waitlist:', error);
    res.status(500).json({ error: 'Failed to fetch waitlist' });
  }
});

// Add party to waitlist
app.post('/api/waitlist', async (req, res) => {
  try {
    const party = new Party(req.body);
    await party.save();
    res.status(201).json(party);
  } catch (error) {
    console.error('Error adding party:', error);
    res.status(500).json({ error: 'Failed to add party to waitlist' });
  }
});

// // Remove party from waitlist
app.delete('/api/waitlist/:id', async (req, res) => {
  try {
    await Party.findByIdAndDelete(req.params.id);
    res.status(204).send();
  } catch (error) {
    console.error('Error removing party:', error);
    res.status(500).json({ error: 'Failed to remove party from waitlist' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});