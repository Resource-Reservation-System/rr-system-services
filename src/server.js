const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
dotenv.config();
const mongoose = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const labRoutes = require('./routes/labRoutes');
const userRoutes = require('./routes/userRoutes');
const componentRoutes = require('./routes/componentRoutes');
const requestRoutes = require('./routes/requestRoutes');
const notificationRoutes = require('./routes/notificationRoutes');
const trendsRoutes = require('./routes/trendsRoutes');


const app = express();

app.use(express.json());

app.use(cors({
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}))

app.use('/api/auth', authRoutes);
app.use('/api/labs', labRoutes);
app.use('/api/users', userRoutes); 
app.use('/api/components', componentRoutes);
app.use('/api/requests', requestRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/trends', trendsRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
