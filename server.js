require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

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

    // loading single inventory data
    app.get('/bikeinventory/:bikeInventoryId', async (req, res) => {
      const id = req.params.bikeInventoryId;
      const query = { _id: ObjectId(id) };
      const inventory = await bikeInventoriesCollection.findOne(query);
      res.send(inventory);
    });

    // updating inventory data
    app.put('/bikeinventory/:bikeInventoryId', async (req, res) => {
      const id = req.params.bikeInventoryId;
      const updateQuantity = req.body;
      console.log(updateQuantity);
      const filter = { _id: ObjectId(id) };
      const options = { upsert: true };
      const updateDoc = {
        $set: {
          quantity: updateQuantity.quantity,
        },
      };
      const updateResult = await bikeInventoriesCollection.updateOne(
        filter,
        updateDoc,
        options
      );
      res.send(updateResult);
    });
  } finally {
    // await client.close();
  }
};
run().catch(console.dir);

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
