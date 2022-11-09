const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion } = require('mongodb');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

//middle wares
app.use(cors());
app.use(express.json());

//password: 3CYy211OWL4L2BoP
console.log(process.env.DB_USER, process.env.DB_PASSWORD);
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.qkzu9ty.mongodb.net/?retryWrites=true&w=majority`;
console.log(uri);
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        const serviceCollection = client.db('painted-lady').collection("services");
        app.get('/services', async (req, res) => {
            const query = {}
            const cursor = serviceCollection.find(query);
            const services = await cursor.toArray();
            res.send(services);
        })
    } finally {

    }
}
run().catch(error => console.error(error))

app.get('/', (req, res) => {
    res.send('simple server running');
})

app.listen(port, () => {
    console.log(`server running on ${port}`);
})