const express = require('express');
const bodyParser = require('body-parser');
const studentsRouter = require('./routes/students');
const propertiesRouter = require('./routes/properties');
const dotenv = require('dotenv');
dotenv.config();

const app = express();
app.use(bodyParser.json());

// Simple logger
app.use((req,res,next) => {
  console.log(`${new Date().toISOString()} ${req.method} ${req.originalUrl}`);
  next();
});

app.use('/students', studentsRouter);
app.use('/properties', propertiesRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
