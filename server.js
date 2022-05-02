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

// run function
const run = async () => {
  try {
    await client.connect();
    const bikeInventoriesCollection = client
      .db('bikeInventories')
      .collection('inventories');

    // loading all inventories data
    app.get('/bikeinventories', async (req, res) => {
      const query = {};
      const cursor = bikeInventoriesCollection.find(query);
      const bikeInventory = await cursor.toArray();
      res.send(bikeInventory);
    });
  } finally {
    // await client.close();
  }
};
run().catch(console.dir);

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
