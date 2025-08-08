const express = require('express');
const cors = require('cors');
require('dotenv').config(); // Load environment variables from .env file
const app = express();
const port = 4000;
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

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
        const userCollection =client.db("sportsEquipment").collection("users");


        app.get('/sports',async(req,res)=>{
            const cursor = equipmentCollection.find();
            const result = await cursor.toArray();
            res.send(result);
        })

        app.get('/sports/:id', async (req, res) =>{
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const result = await equipmentCollection.findOne(query);
            res.send(result);
        })


        app.post('/sports', async (req, res) => {
            const newEquip = req.body;
            console.log(newEquip);
            const result = await equipmentCollection.insertOne(newEquip);
            res.send(result);
        });

        app.put('/sports/:id', async(req, res) =>{
            const id = req.params.id;
            const filter = {_id: new ObjectId(id)};
            const options = { upsert: true };
            const updatedEquip = req.body;
            const equipments = {
                $set: {
                item: updatedEquip.item,
                category: updatedEquip.category,
                description: updatedEquip.description,
                price: updatedEquip.price,
                rating: updatedEquip.rating,
                stock: updatedEquip.stock,
                photo: updatedEquip.photo,
                }
            }
            const result = await equipmentCollection.updateOne(filter, equipments, options);
            res.send(result);
        })

        app.delete('/sports/:id', async (req, res) => {
            const id = req.params.id;
            const query = {_id: new ObjectId(id)};
            const result = await equipmentCollection.deleteOne(query);
            res.send(result);
            
        });

        //Users related APIs
        app.get('/users', async(req, res) =>{
            const cursor = userCollection.find();
            const result = await cursor.toArray();
            res.send(result);
        })

        app.post('/users',async(req, res) =>{
            const newUser = req.body;
            console.log('creating new user', newUser);
            const result = await userCollection.insertOne(newUser);
            res.send(result);

        })

        app.patch('/users', async (req, res) => {
            const email = req.body.email;
            const filter = {email}
            const updatedDoc = {
                $set: {
                    lastSignInTime: req.body.lastSignInTime,
                }
            }
            const result = await userCollection.updateOne(filter, updatedDoc);
            res.send(result);
        })
        
        app.delete('/users/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const result = await userCollection.deleteOne(query);
            res.send(result);
        })


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