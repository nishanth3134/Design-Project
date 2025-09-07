import mongoose from 'mongoose';

const EligibilitySchema = new mongoose.Schema({
  minAge: Number,
  maxAge: Number,
  maxIncome: Number,
  gender: { type: String, default: 'any' },
  occupations: [String]
}, { _id: false });

const SchemeSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true }, // e.g., pm-kisan
  name: { type: String, required: true },
  category: String,
  states: { type: [String], default: ['ALL'] }, // 'ALL' or explicit states
  description: String,
  benefits: String,
  documents: [String],
  application: String,
  officialLink: String,
  eligibility: { type: EligibilitySchema, default: {} }
}, { timestamps: true });

export default mongoose.model('Scheme', SchemeSchema);
