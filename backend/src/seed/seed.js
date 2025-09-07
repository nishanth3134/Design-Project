import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Scheme from '../models/Scheme.js';

dotenv.config();

const MONGO = process.env.MONGO_URI || 'mongodb://localhost:27017/govschemes';

async function run() {
  await mongoose.connect(MONGO, { useNewUrlParser: true, useUnifiedTopology: true });
  console.log('Connected to Mongo for seeding');

  const schemes = [
    {
      id: "pm-kisan",
      name: "PM-KISAN Income Support",
      category: "farmer",
      states: ["ALL"],
      description: "Income support to eligible farmer families (demo).",
      benefits: "Direct income support per official rules.",
      documents: ["Aadhaar", "Bank passbook", "Landholding proof"],
      application: "Apply via state/official portal or CSC.",
      officialLink: "https://myscheme.gov.in/schemes/pm-kisan",
      eligibility: { occupations: ["farmer"] }
    },
    {
      id: "nsp-post-matric",
      name: "NSP - Post Matric Scholarship",
      category: "student",
      states: ["ALL"],
      description: "Scholarships for eligible students (demo).",
      benefits: "Tuition/maintenance support.",
      documents: ["Aadhaar", "Income certificate", "Bonafide certificate"],
      application: "Apply via National Scholarship Portal.",
      officialLink: "https://myscheme.gov.in/schemes/nsp",
      eligibility: { maxIncome: 250000, occupations: ["student"] }
    },
    {
      id: "pmuy",
      name: "Pradhan Mantri Ujjwala Yojana (PMUY)",
      category: "welfare",
      states: ["ALL"],
      description: "LPG connection assistance for eligible women.",
      benefits: "Support for new LPG connection.",
      documents: ["Aadhaar", "Ration card"],
      application: "Apply at LPG distributor or online.",
      officialLink: "https://myscheme.gov.in/schemes/pmuy",
      eligibility: { gender: "female", maxIncome: 200000 }
    },
    {
      id: "mgnrega",
      name: "MGNREGA",
      category: "employment",
      states: ["ALL"],
      description: "Wage employment guarantee for rural households (demo).",
      benefits: "Guaranteed wage employment as per Act.",
      documents: ["Job card", "Aadhaar"],
      application: "Apply at Gram Panchayat.",
      officialLink: "https://myscheme.gov.in/schemes/mgnrega",
      eligibility: { occupations: ["unemployed", "worker"] }
    },
    {
      id: "tn-pudhumai-penn",
      name: "Tamil Nadu - Pudhumai Penn Scheme",
      category: "student",
      states: ["Tamil Nadu"],
      description: "Support for girls in government schools (demo).",
      benefits: "Monthly financial assistance.",
      documents: ["Aadhaar", "Bonafide certificate"],
      application: "Apply via Tamil Nadu portal/school.",
      officialLink: "https://www.tn.gov.in/",
      eligibility: { gender: "female", occupations: ["student"], minAge: 16, maxIncome: 250000 }
    }
  ];

  await Scheme.deleteMany({});
  await Scheme.insertMany(schemes);
  console.log('Seeding complete');
  process.exit(0);
}

run().catch(err => { console.error(err); process.exit(1); });
