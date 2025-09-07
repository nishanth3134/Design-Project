import express from 'express';
import Scheme from '../models/Scheme.js';
import adminAuth from '../middleware/adminAuth.js';

const router = express.Router();

// GET /api/schemes?q=&state=&category=&limit=
router.get('/', async (req, res) => {
  try {
    const { q, state, category, limit = 50 } = req.query;
    const query = {};

    if (category) query.category = category;

    // q searches name, description, category (case-insensitive)
    if (q) {
      const re = new RegExp(q, 'i');
      query.$or = [
        { name: re },
        { description: re },
        { category: re }
      ];
    }

    // If state provided, ensure either 'ALL' or includes that state
    if (state) {
      query.$and = query.$and || [];
      query.$and.push({ states: { $in: ['ALL', state] } });
    }

    const results = await Scheme.find(query).limit(Number(limit)).sort({ createdAt: -1 });
    res.json({ count: results.length, results });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// GET /api/schemes/:id
router.get('/:id', async (req, res) => {
  try {
    const s = await Scheme.findOne({ id: req.params.id });
    if (!s) return res.status(404).json({ error: 'Not found' });
    res.json(s);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// POST /api/schemes  (admin)
router.post('/', adminAuth, async (req, res) => {
  try {
    const doc = await Scheme.create(req.body);
    res.status(201).json(doc);
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: err.message });
  }
});

// PUT /api/schemes/:id (admin)
router.put('/:id', adminAuth, async (req, res) => {
  try {
    const doc = await Scheme.findOneAndUpdate({ id: req.params.id }, req.body, { new: true, upsert: false });
    if (!doc) return res.status(404).json({ error: 'Not found' });
    res.json(doc);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// DELETE /api/schemes/:id (admin)
router.delete('/:id', adminAuth, async (req, res) => {
  try {
    const doc = await Scheme.findOneAndDelete({ id: req.params.id });
    if (!doc) return res.status(404).json({ error: 'Not found' });
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
