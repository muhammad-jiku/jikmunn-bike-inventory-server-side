require('dotenv').config();
const express = require('express');
const cors = require('cors');

const port = process.env.PORT || 5000;
const app = express();

// middleware
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hello there! welcome');
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
