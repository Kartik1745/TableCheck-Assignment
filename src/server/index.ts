import express from 'express';
import cors from 'cors';
import { config } from 'dotenv';
import { connectDB } from './db/connect.js';
import { Party } from './models/Party.js';
import { TOTAL_SEATS } from '../lib/constants.js';

// Load environment variables
config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
connectDB();

/**
 * **GET /api/waitlist**
 * Fetches all parties currently on the waitlist.
 * If a `userId` query parameter is provided, it fetches only the waitlist parties associated with that user.
 * Sorts the results by timestamp (earliest added first).
 */
app.get('/api/waitlist', async (req, res) => {
  const { userId } = req.query;

  try {
    let query = { status: 'waiting' };
    if (userId) {
      query = { ...query, userId: userId };
    }

    const parties = await Party.find(query).sort({ timestamp: 1 });
    res.json(parties);
  } catch (error) {
    console.error('Error fetching waitlist:', error);
    res.status(500).json({ error: 'Failed to fetch waitlist' });
  }
});

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

app.delete('/api/waitlist/:id', async (req, res) => {
  try {
    await Party.findByIdAndDelete(req.params.id);
    res.status(204).send();
  } catch (error) {
    console.error('Error removing party:', error);
    res.status(500).json({ error: 'Failed to remove party from waitlist' });
  }
});

/**
 * **GET /api/active-tables**
 * Fetches all parties currently at active tables (statuses: 'reserved', 'checked-in').
 * If a `userId` query parameter is provided, it fetches only the active parties associated with that user.
 */
app.get('/api/active-tables', async (req, res) => {
  const { userId } = req.query;

  try {
    let query = { 
      status: { $in: ['reserved', 'checked-in'] }
    };
    
    if (userId) {
      query = { ...query, userId: userId };
    }

    const parties = await Party.find(query).sort({ timestamp: 1 });
    res.json(parties);
  } catch (error) {
    console.error('Error fetching active tables:', error);
    res.status(500).json({ error: 'Failed to fetch active tables' });
  }
});

app.get('/api/active-tables/available-seats', async (req, res) => {
  try {
    const activeParties = await Party.find({
      status: { $in: ['reserved', 'checked-in'] }
    });
    
    const occupiedSeats = activeParties.reduce((total, party) => total + party.size, 0);
    const availableSeats = TOTAL_SEATS - occupiedSeats;
    
    res.json({ availableSeats });
  } catch (error) {
    console.error('Error calculating available seats:', error);
    res.status(500).json({ error: 'Failed to calculate available seats' });
  }
});

app.post('/api/active-tables/:id/check-in', async (req, res) => {
  try {
    const party = await Party.findById(req.params.id);
    if (!party) {
      return res.status(404).json({ error: 'Party not found' });
    }

    const serviceEndTime = Date.now() + (party.size * 3000);
    
    party.status = 'checked-in';
    party.serviceEndTime = serviceEndTime;
    await party.save();
    
    res.json(party);
  } catch (error) {
    console.error('Error checking in party:', error);
    res.status(500).json({ error: 'Failed to check in party' });
  }
});

app.post('/api/active-tables/:id/complete', async (req, res) => {
  try {
    await Party.findByIdAndDelete(req.params.id);
    res.status(204).send();
  } catch (error) {
    console.error('Error completing party:', error);
    res.status(500).json({ error: 'Failed to complete party' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});