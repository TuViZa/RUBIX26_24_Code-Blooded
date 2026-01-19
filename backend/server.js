const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const http = require('http');
const socketIo = require('socket.io');
const hospitalRoutes = require('./routes/hospitalRoutes');
const Hospital = require('./models/Hospital');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "http://localhost:8080",
    methods: ["GET", "POST"]
  }
});

const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://nishipvt23_db_user:ZTuw5z0bXm183nJq@cluster0.3xogzvi.mongodb.net/hospital-sync?retryWrites=true&w=majority&appName=Cluster0';

// Middleware
app.use(cors());
app.use(express.json());

// Global request logger
app.use((req, res, next) => {
  console.log(req.method, req.path);
  next();
});

// MongoDB connection
mongoose.connect(MONGODB_URI)
  .then(() => console.log('Connected to MongoDB Atlas'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Inventory Alert Functions
function checkExpiryDates() {
  const sevenDaysFromNow = new Date();
  sevenDaysFromNow.setDate(sevenDaysFromNow.getDate() + 7);
  
  Hospital.find({})
    .then(hospitals => {
      hospitals.forEach(hospital => {
        if (hospital.inventory) {
          hospital.inventory.forEach(item => {
            if (item.expiryDate && new Date(item.expiryDate) <= sevenDaysFromNow) {
              io.emit('inventory_alert', {
                hospitalName: hospital.name,
                itemName: item.name,
                stock: item.stock,
                expiryDate: item.expiryDate,
                daysUntilExpiry: Math.ceil((new Date(item.expiryDate) - new Date()) / (1000 * 60 * 60 * 24))
              });
              console.log(`🚨 Expiry Alert: ${item.name} at ${hospital.name} expires in ${Math.ceil((new Date(item.expiryDate) - new Date()) / (1000 * 60 * 60 * 24))} days`);
            }
          });
        }
      });
    })
    .catch(err => console.error('Error checking expiry dates:', err));
}

function checkLowStock() {
  Hospital.find({})
    .then(hospitals => {
      hospitals.forEach(hospital => {
        if (hospital.inventory) {
          hospital.inventory.forEach(item => {
            if (item.stock < 10) {
              io.emit('low_stock_alert', {
                hospitalName: hospital.name,
                itemName: item.name,
                stock: item.stock,
                unit: item.unit
              });
              console.log(`⚠️ Low Stock Alert: ${item.name} at ${hospital.name} - only ${item.stock} ${item.unit} remaining`);
            }
          });
        }
      });
    })
    .catch(err => console.error('Error checking low stock:', err));
}

// Run inventory checks every 5 minutes
setInterval(() => {
  console.log('🔍 Running inventory checks...');
  checkExpiryDates();
  checkLowStock();
}, 5 * 60 * 1000); // 5 minutes

// Run initial check after 10 seconds
setTimeout(() => {
  console.log('🚀 Starting initial inventory checks...');
  checkExpiryDates();
  checkLowStock();
}, 10000);

// Socket.io connection
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);
  
  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

// Basic route
app.get('/', (req, res) => {
  res.json({ message: 'City Health Sync API is running' });
});

// Hospital routes
app.use('/api/hospital', hospitalRoutes);

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
