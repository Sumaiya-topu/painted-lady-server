const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
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
        const reviewCollection = client.db('painted-lady').collection("reviews");
        app.get('/services', async (req, res) => {
            const query = {}
            const cursor = serviceCollection.find(query);
            const services = await cursor.toArray();
            res.send(services);
        })
        app.get('/limitedservice', async (req, res) => {
            const query = {}
            const cursor = serviceCollection.find(query);
            const services = await cursor.limit(3).toArray();
            res.send(services);
        });
        app.get('/services/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const service = await serviceCollection.findOne(query);
            console.log(service);
            res.send(service);
        });

        app.post('/services/addreview', async (req, res) => {
            const reviewText = req.body;
            console.log(reviewText);
            const result = await reviewCollection.insertOne(reviewText);
            res.send(result);
        });
        app.get('/review/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const review = await reviewCollection.findOne(query);
            res.send(review);
        });

        app.post('/services', async (req, res) => {
            const service = req.body;
            const result = await serviceCollection.insertOne(service);
            res.send(result);
        })
        app.get('/review', async (req, res) => {
            const postId = req.query.postId;
            const userEmail = req.query.userEmail;

            let query = {};
            if (postId) {
                query = { post_id: postId };
            }
            if (userEmail) {
                query = {
                    userEmail
                };
            }
            const cursor = reviewCollection.find(query);
            const reviews = await cursor.toArray();
            res.send(reviews);
        });

        app.delete('/reviews/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) }
            const result = await reviewCollection.deleteOne(query);
            console.log(result);
            res.send(result);
        });

        app.patch('/review/:id', async (req, res) => {
            const id = req.params.id;
            const editedReviewText = req.body.editedReview;
            const query = { _id: ObjectId(id) };
            console.log(query);
            const updatedDoc = {
                $set: {
                    reviewText: editedReviewText
                },
            };
            const result = await reviewCollection.updateOne(query, updatedDoc)
            res.send(result);
        })
    } finally {

    }
}
run().catch(error => console.error(error))


app.listen(port, () => {
    console.log(`server running on ${port}`);
})