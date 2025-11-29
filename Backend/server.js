const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
require('./utils/scheduler'); // this will auto-run the cron job



const authRoutes = require('./routes/auth');
const dashboardRoutes = require('./routes/dashboard');
const dietRoutes = require('./routes/diet');
const sleepRoutes = require('./routes/sleeproutes');
const notificationRoutes = require('./routes/notifications');
const medicationRoutes = require('./routes/medication');
const menstruationRoutes = require('./routes/menstruation');
const fitnessRoutes = require('./routes/fitness');
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

const allowedOrigins = ['http://localhost:5173', 'https://healthvaultt.netlify.app'];

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl)
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    } else {
      return callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  credentials: true
}));

app.use(express.json()); 


// Routes
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/diet', dietRoutes);
app.use('/api/sleep', sleepRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/medication', medicationRoutes);
app.use('/api/menstruation', menstruationRoutes);
app.use('/api/fitness', fitnessRoutes);
// DB connection

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
}).catch(err => {
  console.log('MongoDB connection failed:', err);
});
