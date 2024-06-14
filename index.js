const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config()
const app= express()
const port= process.env.PORT || 5000

// middleware
app.use(cors())
app.use(express.json())

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.awpu5n8.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

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
    // await client.connect();

    const productCollection= client.db("ProductDb").collection("product")


    app.get('/allProduct',async(req,res)=>{

      const cursor= productCollection.find()
      const result= await cursor.toArray()
      res.send(result);
    })
    app.get('/allProduct/:id', async (req, res) => {
      const id = req.params.id
      const query = { _id: new ObjectId(id) }
      const result = await productCollection.findOne(query)
      res.send(result)
    })
    app.get('/myCraft/:email', async(req, res)=>{
      const email= req.params.email
      const query = { email: email}
      const result = await productCollection.find(query).toArray()
      res.send(result)
    })
    app.get('/categories/:subName', async(req, res)=>{
      const subName= req.params.subName
      const query = { subName: subName}
      const result = await productCollection.find(query).toArray()
      res.send(result)
    })
    app.post('/allProduct', async(req, res)=>{
      const newProduct= req.body
      console.log(newProduct)
      const result= await productCollection.insertOne(newProduct)
      res.send(result)
      
    })
    app.put('/allProduct/:id', async (req, res) => {
      const id = req.params.id
      const updateProduct = req.body
      const filter = { _id: new ObjectId(id) }
      const options = { upsert: true };
      const product = {
        $set: {
          name: updateProduct.name,
          subName: updateProduct.subName,
          price: updateProduct.price,
          rating: updateProduct.rating,
          time: updateProduct.time,
          details: updateProduct.details,
          customization: updateProduct.customization,
          stock: updateProduct.stock,
          photoURL: updateProduct.photoURL
        }
      }
      const result = await productCollection.updateOne(filter, product, options)
      res.send(result)
    })
    app.delete('/allProduct/:id', async(req,res)=>{
      const id = req.params.id
      const query= { _id: new ObjectId(id)}
      const result= await productCollection.deleteOne(query)
      res.send(result)
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


app.get('/', (req, res)=>{
    res.send('B9A10 server is running smoothly')
})
app.listen(port, ()=>{
console.log(`server running at port: ${port}`)
})