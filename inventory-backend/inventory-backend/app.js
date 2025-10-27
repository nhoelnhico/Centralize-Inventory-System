require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const employeesRouter = require('./routes/employees');
const devicesRouter = require('./routes/devices');
const transmittalsRouter = require('./routes/transmittals');
const downloadsRouter = require('./routes/downloads');

const app = express();
app.use(cors());
app.use(bodyParser.json({ limit: '15mb' }));
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/api/employees', employeesRouter);
app.use('/api/devices', devicesRouter);
app.use('/api/transmittals', transmittalsRouter);
app.use('/api/downloads', downloadsRouter);

const PORT = process.env.PORT || 4000;
app.listen(PORT, ()=> console.log(`Server running on port ${PORT}`));
