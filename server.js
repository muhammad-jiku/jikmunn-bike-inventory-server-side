require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const jwt = require('jsonwebtoken');

const port = process.env.PORT || 5000;
const app = express();

// middleware
app.use(cors());
app.use(express.json());

const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).send({ message: 'Unauthorized access' });
  }
  console.log('token: ', authHeader);
  const token = authHeader.split(' ')[1];
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).send({ message: 'Forbidden acess' });
    }
    req.decoded = decoded;
    // console.log('Decoded : ', decoded);
    next();
  });
};

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
    const testimonialsCollection = client
      .db('tesitmonials')
      .collection('testimonial');
    const imagesCollection = client.db('images').collection('image');
    const servicesCollection = client.db('services').collection('service');
    const myCollections = client.db('myCollections').collection('myCollection');

    // authentication jwt
    app.post('/login', async (req, res) => {
      const user = req.body;
      const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: '1d',
      });
      res.send({ accessToken });
    });

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

    // displaying inventory data according to added by email
    app.get('/bikeinventory', verifyToken, async (req, res) => {
      const decodedEmail = req.decoded.email;
      const email = req.query.email;
      // console.log(email);
      if (email === decodedEmail) {
        const query = { email };
        const cursor = bikeInventoriesCollection.find(query);
        const items = await cursor.toArray();
        res.send(items);
      } else {
        res.status(403).send({ message: 'Forbidden access' });
      }
    });

    // testimonials data
    app.get('/testimonials', async (req, res) => {
      const query = {};
      const cursor = testimonialsCollection.find(query);
      const testimonial = await cursor.toArray();
      res.send(testimonial);
    });

    // images data
    app.get('/images', async (req, res) => {
      const query = {};
      const cursor = imagesCollection.find(query);
      const image = await cursor.toArray();
      res.send(image);
    });

    // services data displaying
    app.get('/services', async (req, res) => {
      const query = {};
      const cursor = servicesCollection.find(query);
      const service = await cursor.toArray();
      res.send(service);
    });

    // services data displaying
    app.get('/mycollections', async (req, res) => {
      const query = {};
      const cursor = myCollections.find(query);
      const myCollection = await cursor.toArray();
      res.send(myCollection);
    });

    // adding inventory to database
    app.post('/bikeinventory', async (req, res) => {
      const newBikeInventory = req.body;
      const result = await bikeInventoriesCollection.insertOne(
        newBikeInventory
      );
      res.send(result);
    });

    // updating inventory data
    app.put('/bikeinventory/:bikeInventoryId', async (req, res) => {
      const id = req.params.bikeInventoryId;
      const updateQuantity = req.body;
      // console.log(updateQuantity);
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

    // delete inventory from server
    app.delete('/bikeinventory/:bikeInventoryId', async (req, res) => {
      const id = req.params.bikeInventoryId;
      const query = { _id: ObjectId(id) };
      const deleteInventoryResult = await bikeInventoriesCollection.deleteOne(
        query
      );
      res.send(deleteInventoryResult);
    });
  } finally {
    // await client.close();
  }
};
run().catch(console.dir);

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
