const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const port = process.env.PORT || 5000;
require('dotenv').config();

// middle wares
app.use(cors());
app.use(express.json());




const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.kjb9ctc.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });


async function run() {
    try {
        const serviceCollection = client.db('assignment11').collection('services');
        const reviewCollection = client.db('assignment11').collection('review');

        // services api
        app.get('/services', async (req, res) => {
            const query = {};
            const cursor = serviceCollection.find(query).limit(3);
            const services = await cursor.toArray();
            res.send(services)
        });

        // all services api
        app.get('/serviceAll', async (req, res) => {
            const query = {};
            const cursor = serviceCollection.find(query);
            const services = await cursor.toArray();
            res.send(services)
        });

        // all services api id 
        app.get('/serviceAll/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const service = await serviceCollection.findOne(query);
            res.send(service)
        });

        app.get('/user', async (req, res) => {
            const cursor = serviceCollection.find({});
            const users = await cursor.toArray();
            res.send(users);
        })

        app.post('/user', async (req, res) => {
            const user = req.body;
            // users.push(user);
            const result = await serviceCollection.insertOne(user)
            console.log(result);
            user._id = result.insertedId
            res.send(user)
        })

        app.post('/review', async (req, res) => {
            const query = req.body
            const result = await reviewCollection.insertOne(query)
            res.send(result)
        })

        app.get('/review', async (req, res) => {
            let query = {};
            if (req.query.email) {
                query = {
                    email: req.query.email
                }
            }
            const cursor = reviewCollection.find(query);
            const users = await cursor.toArray();
            res.send(users);
        })



        app.get('/singleReview', async (req, res) => {
            let query = {};
            if (req.query.review) {
                query = {
                    review: req.query.review
                }
            }
            const cursor = reviewCollection.find(query);
            const users = await cursor.toArray();
            res.send(users);
        });



        // review button edit
        app.get('/singleReview/:id', async(req,res)=>{
            const id = req.params.id;
            const query = {_id: ObjectId(id)}
            const user = await reviewCollection.findOne(query)
            res.send(user)
        })





        app.delete('/singleReview/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await reviewCollection.deleteOne(query);
            res.send(result);
        })


        // app.put('/singleReview/:id', async(req,res)=>{
        //     const id = req.params.id;
        //     const filter = {_id: ObjectId(id)}
        //     const user = req.body;
        //     const option = {upsert: true};
        //     const updatedUser = {
        //         $set: {
        //             message: user.name,
        //         }
        //     }
        //     const result= await userCollection.updateOne(filter, updatedUser, option);
        //     res.send(result)
        // })



    }
    finally {

    }

}

run().catch(error => {
    console.log(error);
})






app.get('/', (req, res) => {
    res.send('assignment 11 server is running')
})

app.listen(port, (req, res) => {
    console.log(`assignment-11 server runnint on  ${port}`);
})