// Dependencies
var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var http = require("http");
var https = require("https");

// Uses for getting page elements
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());
app.use(express.static(__dirname));

// Connect to DB with mongoose
mongoose.Promise = global.Promise;
mongoose.connect("mongodb://localhost:27017/MunchDB", function(err){
  if(err){
    console.log("Error: " + err);
  }
  else {
    console.log("Connected to Database")
  }
});

// Mongoose Schema - New Candy
var Route = mongoose.model("Route",{
  city:String,
  cusineOne:String,
  cusineTwo:String,
  cusineThree:String,
  locationOne:Object,
  locationTwo:Object,
  locationThree:Object
});

var Cuisine = mongoose.model("Cusine",{
  type:String
});

// Here I need to write the http request to get the locations server side - https://stackoverflow.com/questions/9577611/http-get-request-in-node-js-express
// Need from the user thier location
// send back json with results

// CREATE - POST candy to DB
app.post("/saveRoute",function(request, response){
    var newRoute = new Route(request.body);
    newRoute.save();
    newRoute.status(201);
    newRoute.send(newRoute);
});

// READ - GET all candy from DB
app.get("/getallRoutes", function(request, response){
   Route.find({}).exec(function(err,route){
       if(err){
           console.log("Error" + " " + err);
       }
       else{
           response.send(route);
           console.log("Routes Loaded and sent back to FE");
       }
   }) 
});

// UPDATE - PUT (update) a candy in the DB by the id
app.put("/editRoute/:_id", function(request, response){
    
    var editRoute = request.body;

    Route.findOne({_id:request.params._id}).exec(function(err,singleRoute){
        if(err){
            console.log("Error" + " " + err);
        }
        else{
            if(singleRoute){
                singleRoute.locationOne = request.body.newLocationOne;
                singleRoute.locationTwo = request.body.newLocationTwo;
                singleRoute.locationThree = request.body.newLocationThree;
                singleRoute.save();
                response.send(singleRoute);
            }
            else{
                console.log("There was an issue editing the route. The error was: " + " " + err.status);
            }      
        }
    })
});

// DELETE - delete specific candy from the DB
app.delete("/deleteRoute/:_id",function(request,response){
    Route.remove({_id:request.params._id}).exec(function(err,deletedRoute){
        if(err){
            console.log("Error" + " " + err)
        }
        else{
            response.status(204);
            response.send("Route has been removed from the DB");
        }
    })
});

// allows the server to connect on port 3000 
app.listen(3000,function(){
  console.log("Listening on http://localhost:3000");
});
