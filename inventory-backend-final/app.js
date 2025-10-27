require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const employeesRouter = require('./routes/employees');
const devicesRouter = require('./routes/devices');
const transmittalsRouter = require('./routes/transmittals');
const downloadsRouter = require('./routes/downloads');

const app = express();

app.use(cors({ origin: process.env.CORS_ORIGIN || '*' }));
app.use(bodyParser.json({ limit: '20mb' }));
app.use(bodyParser.urlencoded({ extended: true }));

// ✅ Ensure correct charset for all responses
app.use((req, res, next) => {
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  next();
});

app.use('/api/employees', employeesRouter);
app.use('/api/devices', devicesRouter);
app.use('/api/transmittals', transmittalsRouter);
app.use('/api/downloads', downloadsRouter);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
