const express = require('express')
const app = express()
const cors = require('cors');
// const admin = require("firebase-admin");
require('dotenv').config();
const { MongoClient } = require('mongodb')

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

        // insert user in user table
        app.post('/users', async (req, res) => {
            const user = req.body;
            const result = await usersCollection.insertOne(user);
            res.json(result);
        });
       
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
