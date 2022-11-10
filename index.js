const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config()
const app = express();
const port = process.env.PORT || 5000;


app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.nfm1t0q.mongodb.net/?retryWrites=true&w=majority`;
console.log(uri);
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
async function run(){
    try{
        const serviceCollection = client.db("dentalSurgeon").collection("services");
        const myServiceCollection = client.db("dentalDoctor").collection("dentalService");
        // get data from database
        // http://localhost:5000/services
        app.get('/services', async(req,res)=>{
            const query = {};
            const cursor = serviceCollection.find(query);
            const services = await cursor.toArray();
            res.send(services);
        })
        // get limit data from database
        // http://localhost:5000/service
        // app.get('/service', async(req,res)=>{
        //     const query = {};
        //     const cursor = serviceCollection.find(query);
        //     const services = await cursor.limit(3).toArray();
        //     res.send(services);
        // })
        //Get Limit data from database
        
        // add data from database
        app.get('/doctorServices',async(req,res)=>{
            const query = {};
            const cursor = myServiceCollection.find(query).sort({"title":1})
            const result = await cursor.toArray()
            res.send(result)
        })
        //Get Limit Data from database
        app.get('/doctorService',async(req,res)=>{
            const query ={}
            const cursor = serviceCollection.find(query).sort({"title":1})
            const result = await cursor.limit(3).toArray();
            res.send(result)
        })
        // get single data from database
        app.get('/doctorServices/:id', async(req,res)=>{
            const id = req.params.id;
            const query ={_id:ObjectId(id)};
            const result = await myServiceCollection.findOne(query)
            res.send(result)
        })
        // add service from clint site
        app.post('/doctorServices',async (req,res)=>{
            const result = await myServiceCollection.insertOne(req.body);
            res.send(result);
        })
    }finally{

    }
}
run().catch(err=>console.error(err));

app.get('/', (req, res) => {
    res.send("Dental Surgioun server is running");
})

app.listen(port, () => {
    console.log("Dental servie is Working");
})