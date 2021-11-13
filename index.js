const express = require('express')
const app = express()
const cors = require('cors');
// const admin = require("firebase-admin");
require('dotenv').config();
const { MongoClient } = require('mongodb')
const ObjectId = require('mongodb').ObjectId

const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json())

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.3fsfu.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try {
        await client.connect();
        const database = client.db('Bikers')
        const usersCollection = database.collection('users');
        const bikeCollection = database.collection('bikeCollection');
        const orderCollection = database.collection('order');

        // insert user in user table
        app.post('/users', async (req, res) => {
            const user = req.body;
            const result = await usersCollection.insertOne(user);
            res.json(result);
        });


        // get all bike product

        app.get('/bike-collection', async (req, res) => {
            const cursor = bikeCollection.find({})
            const result = await cursor.toArray()
            res.json(result)
        })

        // get single bike by id

        app.get('/bike-collection/:id', async (req, res) => {
            const id = req.params.id
            const query = { _id: ObjectId(id) }
            const result = await bikeCollection.findOne(query)
            res.json(result)
        })
        // add rating
        app.put('/bike-collection/', async (req, res) => {
            const user = req.body;
            const filter = { _id: ObjectId(user._id) };
            // const options = { upsert: true };
            const updateDoc = { $set: {rating : user.rating} };
            const result = await bikeCollection.updateOne(filter, updateDoc );
            res.json(result);
        })

        // place bike order
        app.post('/bike-order', async (req, res) => {
            const order = req.body
            const result = await orderCollection.insertOne(order)
            res.json(result)
        })

        // get all order by user email
        app.get('/bike-order/:email', async (req, res) => {
            const email = req.params.email
            const cursor = orderCollection.find({ email: email })
            const result = await cursor.toArray()
            res.json(result)
        })

        // delte bike oder
        app.delete('/bike-orders/:id', async (req, res) => {
            const id = req.params.id
            const query = { _id: ObjectId(id) }
            const result = await orderCollection.deleteOne(query)
            res.json(result)
        })

    }
    finally {
        // await client.close();
    }
}

run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('Hello Bikers Gang!')
})

app.listen(port, () => {
    console.log(`listening at ${port}`)
})
