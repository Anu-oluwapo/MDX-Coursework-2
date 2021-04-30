const express = require("express");
const app  = express();
const path = require("path")
const fs = require("fs")
const bodyParser = require('body-parser');
const cors = require('cors');

app.use(bodyParser.json())
app.use(cors())



app.use(express.json())

const http = require('http');
const port = process.env.PORT || 2000;;
const server = http.createServer(app);


app.use(function(request, response, next){
  console.log("In comes a " + request.method + " Request to: " + request.url);
  next();
});

app.use(function(req, res, next){
  var filePath = path.join(__dirname, "static", req.url)
  fs.stat(filePath, function(err, fileInfo){
      if(err){
          next();
          return;
      }
      if(fileInfo.isFile()) res.sendFile(filePath)
      else next()
  });
});

// app.use(function(req, res){
//   res.status(404)
//   res.send('File not found')
// })


// Connect to MongoDb Atlas
const MongoClient = require('mongodb').MongoClient;
 let db;
  MongoClient.connect('mongodb+srv://anu:kntjf04mwl06@cluster0.rpda3.mongodb.net/coursework2?retryWrites=true&w=majority', (err, client) => {
      db = client.db('coursework2');
 })

 // Get the collection Name 
 app.param('collectionName', (req, res, next, collectionName)=>{
     req.collection = db.collection(collectionName)
     return next();
 })

 // Display Message for the root path to show the API is working
 app.get('/', (req, res) =>{
     res.send('Api is working, Please select a collection, eg collection/messages');
 })

 //Retrieve all the objects from a collection within MongoDB
 app.get('/collection/:collectionName', (req, res) =>{
     req.collection.find({}).toArray((e, results) => {
         if (e) return next(e)
         res.setHeader('Access-Control-Allow-Origin', '*');
         res.writeHead(200, {'Content-Type': 'text/plain'});
         res.end(JSON.stringify(results));
         
     })
 })


//Add an object to Mongodb
app.post('/collection/:collectionName', (req,res,next) => {
 try{ req.collection.insert(req.body, (e, results) => {
      if (e) return next (e)
      res.send(results.ops)
  })
} catch(error){
  res.status(500).json({message:"Error Message"})
  console.log(error);
}
})


app.put('/collection/:collectionName', (req,res,next) => {
    req.collection.bulkWrite(
        req.body.map(lesson => {
            return {
                updateMany : {
                    filter : {
                        id:lesson.id
                    },
                    update : {
                        $set:{
                            id:lesson.id, 
                            subject:lesson.subject,
                            location:lesson.location,
                            price:lesson.price,
                            availablespace:lesson.availablespace,
                            rating:lesson.rating,
                        }
                    }
                }
            }
        })
    )
res.status(202).send();

   })


server.listen(port);
console.log('Sever Is Now Running On Port 2000');

