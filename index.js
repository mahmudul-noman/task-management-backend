const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();
const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.uvmqfi7.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        await client.connect();

        // Tasks Collection
        const taskCollection = client.db('taskDb').collection('tasks');


        // Get All Data From Server
        app.get('/allTask', async (req, res) => {
            const result = await taskCollection.find().toArray();
            res.send(result);
        })

        // Insert Data From User
        app.post('/addTask', async (req, res) => {
            const tasks = req.body;
            const result = await taskCollection.insertOne(tasks);
            console.log(result);
            res.send(result);
        })


        // Find Data by User Email
        app.get('/myTask/:email', async (req, res) => {
            console.log(req.params.email);
            const result = await taskCollection.find({ email: req.params.email }).toArray();
            res.send(result);
        });


        // Delete Data
        app.delete('/allTask/:id', async (req, res) => {
            const id = req.params.id;
            console.log(id);
            const query = { _id: new ObjectId(id) }
            const result = await taskCollection.deleteOne(query);
            res.send(result);
        })

        // Find Single Data From Server
        app.get('/allTask/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const result = await taskCollection.findOne(query);
            res.send(result);
        })


        // Update Data APis
        app.put('/allTask/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: new ObjectId(id) }
            const updateTask = req.body;
            const task = {
                $set: {
                    taskTitle: updateTask.taskTitle,
                    taskDesc: updateTask.taskDesc
                }
            }
            const result = await taskCollection.updateOne(filter, task)
            res.send(result)
        })


        // Set Status: Completed
        app.patch('/allTask/:id', async (req, res) => {
            const id = req.params.id
            console.log(id);
            const filter = { _id: new ObjectId(id) }
            const updateDoc = {
                $set: {
                    status: 'completed'
                }
            }
            const result = await taskCollection.updateOne(filter, updateDoc);
            res.send(result);
        })

        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);

// Server Status
app.get('/', (req, res) => {
    res.send('Task Management Server Running');
})

// Server Status
app.listen(port, () => {
    console.log(`Task Management Server Running Port: ${port}`);
})