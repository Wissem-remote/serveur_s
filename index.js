const express = require('express')
const app = express()
const port = process.env.PORT || 2000
const routes = express.Router()
const bodyParser = require('body-parser')
const cors = require('cors')
const { MongoClient } = require('mongodb');
const dotenv = require('dotenv')

dotenv.config();
// Route Midleware

app.use('/', routes)

// Cors
routes.use(cors())

// Body Parser

routes.use(bodyParser.urlencoded({ extended: false }))
routes.use(bodyParser.json())
const jsonParser = bodyParser.json();



// on creés notre Midleware

routes.get('/', (req, res) => {
    res.send('Hel World!')
})

// connection a notre BD


const uri = process.env.DB_CONNECT;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
    if(err){
        throw (err)
    }
    const admin = client.db("school").collection("admin");
    const users = client.db("school").collection("users");
    const form = client.db("school").collection("formation");
    console.log(`Successfully Connect.`)
  // perform actions on the collection object
            routes.get('/admin', (req, res) => {
            admin.find()
            .toArray()
            .then((error, item) => {
                error? res.send(error): res.send(item)
                
                
            })
            .catch(err =>  res.send(err))
        })
        routes.get('/form', (req, res) => {
            form.find()
            .toArray()
            .then((error, item) => {
                error? res.send(error): res.send(item)
                
                
            })
            .catch(err =>  res.send(err))
        })
        
        routes.post("/form/add", jsonParser, function (req, res) {

            form.insertOne(req.body)
                .then(() => res.status(200).send("successfully inserted new document"))
                .catch((err) => {
                    console.log(err);
                    res.send(err);
                });
            });

    routes.post("/users/add", jsonParser, function (req, res) {

        users.insertOne(req.body)
            .then(() => res.status(200).send("successfully inserted new document"))
            .catch((err) => {
                console.log(err);
                res.send(err);
            });
        });

            routes.get('/users', (req, res) => {
                users.find()
                .toArray()
                .then((error, item) => {
                    error? res.send(error): res.send(item)
                    
                    
                })
                .catch(err =>  res.send(err))
            })
            

            routes.post("/user/update", jsonParser, function (req, res) {
                const user = req.body.user
                    users
                        .updateOne({"user": user},{$set:req.body })
                        .then(() => res.status(200).send("successfully update  document"))
                        .catch((err) => {
                            console.log(err);
                            res.send(err);
                        });
                    });
                    routes.post("/form/update", jsonParser, function (req, res) {
                        const id = req.body.id
                            form
                                .updateOne({"id": id},{$set:req.body })
                                .then(() => res.status(200).send("successfully update  document"))
                                .catch((err) => {
                                    console.log(err);
                                    res.send(err);
                                });
                            });
                            routes.delete("/form/delete/:id", function (req, res) {
                                
                                form
                                    .deleteOne({"id": req.params.id})
                                    .then(() => res.status(200).send("successfully delete"))
                                    .catch((err) => {
                                        console.log(err);
                                        res.send(err);
                                    });
                                });

                                routes.delete("/user/delete/:id", function (req, res) {
                                
                                    users
                                        .deleteOne({"user": req.params.id})
                                        .then(() => res.status(200).send("successfully delete"))
                                        .catch((err) => {
                                            console.log(err);
                                            res.send(err);
                                        });
                                    });
            
            
});

// on ecoute aux port 2000

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})