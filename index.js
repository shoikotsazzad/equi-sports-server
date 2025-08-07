const express = require('express');
const cors = require('cors');
require('dotenv').config(); // Load environment variables from .env file
const app = express();
const port = 4000;
const { MongoClient, ServerApiVersion } = require('mongodb');

app.use(cors());
app.use(express.json());



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.hpxccpu.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;


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


        const equipmentCollection = client.db("sportsEquipment").collection("equipment");

        app.post('/sports', async (req, res) => {
            const newEquip = req.body;
            console.log(newEquip);
            const result = await equipmentCollection.insertOne(newEquip);
            res.send(result);
        });



        app.get('/', (req, res) => {
            res.send('Sports Equipment Server is running');
        })

        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } catch (error) {
        // Ensures that the client will close when you finish/error
        console.error("MongoDB Connection Error:", error);
    }
}
run();



app.listen(port, () => {
    console.log(`Server is running on port :${port}`);
})