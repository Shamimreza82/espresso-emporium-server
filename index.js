const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express(); 
const port = process.env.PORT || 5000; 


app.use(cors()); 
app.use(express.json())


///----------------------------------------mongodb -------------------------------------------------------------

const uri = `mongodb+srv://${process.env.USER_DB}:${process.env.PASS_DB}@cluster0.hxvv6ba.mongodb.net/?retryWrites=true&w=majority`;


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
    // Send a ping to confirm a successful connection

    const database = client.db("ALLCoffeeDB");
    const coffeeCollection= database.collection("Coffee");

    app.get('/coffee', async (req, res) => {
        const result = await coffeeCollection.find().toArray(); 
        res.send(result) 
    })

    app.get('/coffee/:id', async (req, res) => {
        const id = req.params.id; 
        const query = {_id: new ObjectId(id) } 
        const result = await coffeeCollection.findOne(query) 
        res.send(result) 

    })

    app.delete('/coffee/:id', async (req, res) => {
        const id = req.params.id; 
        console.log(id);
        const query = {_id: new ObjectId(id) }
        const result = await coffeeCollection.deleteOne(query) 
        res.send(result) 
    })

    app.put('/coffee/:id', async (req, res) => {
        const id = req.params.id; 
        const coffeeInfo = req.body;
        const options = { upsert: true }; 
        const filter = {_id: new ObjectId(id) } 
         const coffee = {
            $set: {
                name: coffeeInfo.name,
                 supplier: coffeeInfo.supplier,
                 category: coffeeInfo.category,
                 chef: coffeeInfo.chef,
                 taste: coffeeInfo.taste,
                 details: coffeeInfo.details,
                 photo: coffeeInfo.photo,
            }
         }
         const result = await coffeeCollection.updateOne(filter, coffee, options)  
         res.send(result)   

    })

    app.post('/coffee', async (req, res) => {
        const coffeeInfo = req.body; 
        console.log(coffeeInfo);
        const result = await coffeeCollection.insertOne(coffeeInfo)
        res.send(result) 
    })


    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

///----------------------------------------mongodb -------------------------------------------------------------


app.get('/', (req, res) => {
    res.send('Hello World!') 
})

app.listen(port, ()=> {
    console.log(`Server is running on port ${port}`) 
})