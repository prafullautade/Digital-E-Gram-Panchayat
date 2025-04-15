const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
const logger = require('./logger'); // optional for logging
const requestsRoute = require('./routes/requests');
const notificationsRoute = require('./routes/notifications');

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(cors());
app.use(express.json());

// Routes
app.use('/auth', authRoutes);
app.use('/services', require('./routes/serviceRoutes'));
app.use('/requests', requestsRoute);
app.use('/notifications', notificationsRoute);

// Start server
app.listen(PORT, () => {
  logger.info(`🚀 Server running on http://localhost:${PORT}`);
});
