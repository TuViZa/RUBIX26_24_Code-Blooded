const mongoose = require('mongoose');
const Hospital = require('./models/Hospital');

const MONGODB_URI = 'mongodb+srv://nishipvt23_db_user:ZTuw5z0bXm183nJq@cluster0.3xogzvi.mongodb.net/hospital-sync?retryWrites=true&w=majority&appName=Cluster0';

// Generate realistic inventory for each hospital
function generateInventory() {
  const expiryDate = new Date();
  expiryDate.setDate(expiryDate.getDate() + 5); // 5 days from now
  
  return [
    {
      name: 'Paracetamol',
      stock: 500,
      unit: 'tablets',
      expiryDate: expiryDate,
      category: 'Medicine'
    },
    {
      name: 'Oxygen Tanks',
      stock: 20,
      unit: 'cylinders',
      expiryDate: null,
      category: 'Equipment'
    },
    {
      name: 'Vaccines',
      stock: 100,
      unit: 'doses',
      expiryDate: expiryDate,
      category: 'Medicine'
    }
  ];
}

// Tier 1 - Real Mumbai Hospitals (Big 6)
const tier1Hospitals = [
  {
    name: 'KEM Hospital',
    location: { lat: 19.002, lng: 72.842 },
    totalBeds: 1800,
    occupiedBeds: 1600,
    inventory: generateInventory()
  },
  {
    name: 'Lilavati Hospital',
    location: { lat: 19.051, lng: 72.829 },
    totalBeds: 300,
    occupiedBeds: 280,
    inventory: generateInventory()
  },
  {
    name: 'Tata Memorial',
    location: { lat: 19.006, lng: 72.841 },
    totalBeds: 600,
    occupiedBeds: 590,
    inventory: generateInventory()
  },
  {
    name: 'Kokilaben Ambani',
    location: { lat: 19.131, lng: 72.823 },
    totalBeds: 750,
    occupiedBeds: 400,
    inventory: generateInventory()
  },
  {
    name: 'Hiranandani Hospital',
    location: { lat: 19.118, lng: 72.911 },
    totalBeds: 240,
    occupiedBeds: 200,
    inventory: generateInventory()
  },
  {
    name: 'Sion Hospital',
    location: { lat: 19.040, lng: 72.860 },
    totalBeds: 1400,
    occupiedBeds: 1350,
    inventory: generateInventory()
  }
];

// Generate Tier 2 - City Health Centers (44 clinics)
function generateTier2Hospitals() {
  const tier2Hospitals = [];
  const mumbaiCenter = { lat: 19.0760, lng: 72.8777 };
  
  for (let i = 1; i <= 44; i++) {
    const totalBeds = Math.floor(Math.random() * 31) + 20; // 20-50 beds
    const occupiedBeds = Math.floor(Math.random() * totalBeds);
    
    tier2Hospitals.push({
      name: `City Health Center #${i}`,
      location: {
        lat: mumbaiCenter.lat + (Math.random() - 0.5) * 0.2, // ±0.1 degrees
        lng: mumbaiCenter.lng + (Math.random() - 0.5) * 0.2  // ±0.1 degrees
      },
      totalBeds: totalBeds,
      occupiedBeds: occupiedBeds,
      inventory: generateInventory()
    });
  }
  
  return tier2Hospitals;
}

async function seedDatabase() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB Atlas');
    
    // Clear existing data
    await Hospital.deleteMany({});
    console.log('Cleared existing hospital data');
    
    // Combine Tier 1 and Tier 2 hospitals
    const allHospitals = [...tier1Hospitals, ...generateTier2Hospitals()];
    
    // Insert all hospitals
    await Hospital.insertMany(allHospitals);
    console.log(`Database Seeded with ${allHospitals.length} hospitals!`);
    console.log(`- 6 Tier 1 (Real Hospitals)`);
    console.log(`- 44 Tier 2 (City Health Centers)`);
    console.log(`- Each hospital has inventory: Paracetamol (500), Oxygen Tanks (20), Vaccines (100)`);
    
  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

seedDatabase();
