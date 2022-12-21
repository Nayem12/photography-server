const express = require('express');
const cors = require('cors');
const app = express()
const port = process.env.PORT || 5000;
require('dotenv').config()

app.use(cors())
app.use(express.json())

app.get('/', (req, res) => {
    res.send('assignment is running')
})



const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.3e6mwvl.mongodb.net/?retryWrites=true&w=majority`;
console.log(uri)
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {

        const serviceCollection = client.db('photography').collection('services')
        const reviwCollection = client.db('photography').collection('review')

        app.get('/services', async (req, res) => {
            const qurey = {}
            const cursor = serviceCollection.find(qurey)
            const services = await cursor.limit(3).toArray();
            res.send(services)
        })
        app.get('/allservices', async (req, res) => {
            const qurey = {}
            const cursor = serviceCollection.find(qurey)
            const services = await cursor.toArray();
            res.send(services)
        })
        app.get(`/services/:id`, async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) }
            const service = await serviceCollection.findOne(query)
            res.send(service)
        })
        app.post('/review', async (req, res) => {
            const review = req.body;
            console.log(review)
            const cursor = await reviwCollection.insertOne(review)
            res.send(cursor)
        })
        app.post('/allservices', async (req, res) => {
            const review = req.body;
            console.log(review)
            const cursor = await serviceCollection.insertOne(review)
            res.send(cursor)
        })
        app.get('/review', async (req, res) => {
            let query = {};
            const mail = req.query.email
            if (mail) {
                query = {
                    email: req.query.email
                }
            }
            const cursor = reviwCollection.find(query)
            const order = await cursor.toArray();
            res.send(order)
        })
        app.delete('/review/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await reviwCollection.deleteOne(query);
            res.send(result)
        })
    }
    finally {

    }
}

run().catch(e => console.log(e))




app.listen(port, () => {
    console.log(`wow assignment suru korlam  ${port}`)
})