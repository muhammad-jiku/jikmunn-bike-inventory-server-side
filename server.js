require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion } = require('mongodb');

const port = process.env.PORT || 5000;
const app = express();

// middleware
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hello there! welcome');
});

// Database
const uri = `mongodb+srv://${process.env.DB_AUTHOR}:${process.env.DB_PASSWORD}@cluster0.xapan.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});
client.connect((err) => {
  const collection = client.db('bikeInventories').collection('inventories');
  // perform actions on the collection object
  client.close();
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
