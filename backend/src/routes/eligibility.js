import express from 'express';
import Scheme from '../models/Scheme.js';

const router = express.Router();

function normalize(s) { return (s || '').toString().trim().toLowerCase(); }

function scoreScheme(s, profile) {
  const el = s.eligibility || {};
  let score = 0;
  const reasons = [];

  // Hard constraints (if present) — if they fail, add a reason but still compute
  if (el.minAge != null) {
    if (Number(profile.age) >= el.minAge) score += 2;
    else reasons.push(`Minimum age ${el.minAge}`);
  }
  if (el.maxAge != null) {
    if (Number(profile.age) <= el.maxAge) score += 2;
    else reasons.push(`Maximum age ${el.maxAge}`);
  }
  if (el.maxIncome != null && profile.income != null) {
    if (Number(profile.income) <= el.maxIncome) score += 2;
    else reasons.push(`Income must be ≤ ${el.maxIncome}`);
  }
  // Gender
  if (el.gender && el.gender.toLowerCase() !== 'any') {
    if (normalize(profile.gender) === normalize(el.gender)) score += 1;
    else reasons.push(`Only for ${el.gender}`);
  } else {
    // small score for no gender restriction
    score += 0.2;
  }
  // Occupation
  if (el.occupations && el.occupations.length) {
    const occOK = el.occupations.map(normalize).includes(normalize(profile.occupation));
    if (occOK) score += 2;
    else reasons.push(`Eligible occupations: ${el.occupations.join(', ')}`);
  }

  // State availability
  if (!s.states || s.states.length === 0 || s.states.includes('ALL')) {
    score += 1;
  } else if (profile.state && s.states.map(normalize).includes(normalize(profile.state))) {
    score += 2;
  } else {
    reasons.push(`Available in: ${s.states.join(', ')}`);
  }

  // small boost for having low number of restrictions (more general)
  const restrictionCount = (el.minAge ? 1 : 0) + (el.maxAge ? 1 : 0) + (el.maxIncome ? 1 : 0) + (el.occupations?.length ? 1 : 0);
  if (restrictionCount === 0) score += 0.5;

  return { scheme: s, score: Math.round(score * 10) / 10, reasons };
}

router.post('/check', async (req, res) => {
  try {
    const profile = req.body || {};
    const schemes = await Scheme.find({});
    const scored = schemes.map(s => scoreScheme(s, profile))
      // only include if score meets a threshold (tuneable)
      .filter(x => x.score >= 2.5)
      .sort((a, b) => b.score - a.score);

    res.json({ profile, matches: scored });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
