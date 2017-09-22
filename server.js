// Dependencies
var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var http = require("http");
var https = require("https");
var request = require('request');
var router = express.Router();
var firebase = require("firebase");

// Uses for getting page elements
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(__dirname));
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

// Firebase Config
var config = {
    apiKey: "AIzaSyCnvqFYW0ujrj1MZiV9HgyML872zHRdLeI",
    authDomain: "munch-1505159075646.firebaseapp.com",
    databaseURL: "https://munch-1505159075646.firebaseio.com"
};
firebase.initializeApp(config);

// Connect to DB with mongoose
mongoose.Promise = global.Promise;
mongoose.connect("mongodb://localhost:27017/MunchDB", function(err) {
    if (err) {
        console.log("Error: " + err);
    } else {
        console.log("Connected to Database")
    }
});

// Mongoose Schema - New Candy
var Route = mongoose.model("Route", {
    city: String,
    cusineOne: String,
    cusineTwo: String,
    cusineThree: String,
    locationOne: Object,
    locationTwo: Object,
    locationThree: Object
});

var Cuisine = mongoose.model("Cusine", {
    type: String
});

// API call to google places to get locations list
app.post('/routeOptions', function(req, res) {
    console.log('Requesting Places from Goolge API');
    var base = "https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=";
    var longLat = req.body.location;
    var radius = req.body.radius;
    var type = req.body.type;
    var key = "&key=AIzaSyD32rWtceO4-3aY02cxmsYwihYuNEWVIOw";
    var searchTerm = base + longLat + radius + type + key;
    // console.log(searchTerm);
    request(searchTerm, function(error, response, body) {
        if (!error && response.statusCode == 200) {
            var options = JSON.parse(body)
            // do more stuff
            // console.log(options);
            res.send(options);
            console.log('Places sent to FE');
        }
    })
});

// builds string for image for loaction info
app.post('/getPlaceImage', function(req, res) {
    console.log("Requesting Image url");
    var base = "https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=";
    var location = req.body.ref;
    var sensor = "&sensor=false";
    var key = "&key=AIzaSyD32rWtceO4-3aY02cxmsYwihYuNEWVIOw";
    var photoUrl = base + location + sensor + key;
    res.send(photoUrl);
    console.log("Photo Url sent to FE");
});

// Registers user via firebase SDK
app.post('/registerUser', function(req, res) {
    var email = req.body.email;
    var password = req.body.password;
    firebase.auth().createUserWithEmailAndPassword(email, password)
        .catch(function(error) {
            console.log(error.code);
            console.log(error.message);
        });
});

// CREATE - POST candy to DB
app.post("/saveRoute", function(request, response) {
    var newRoute = new Route(request.body);
    newRoute.save();
    newRoute.status(201);
    newRoute.send(newRoute);
});

// READ - GET all candy from DB
app.get("/getallRoutes", function(request, response) {
    Route.find({}).exec(function(err, route) {
        if (err) {
            console.log("Error" + " " + err);
        } else {
            response.send(route);
            console.log("Routes Loaded and sent back to FE");
        }
    })
});

// UPDATE - PUT (update) a candy in the DB by the id
app.put("/editRoute/:_id", function(request, response) {

    var editRoute = request.body;

    Route.findOne({ _id: request.params._id }).exec(function(err, singleRoute) {
        if (err) {
            console.log("Error" + " " + err);
        } else {
            if (singleRoute) {
                singleRoute.locationOne = request.body.newLocationOne;
                singleRoute.locationTwo = request.body.newLocationTwo;
                singleRoute.locationThree = request.body.newLocationThree;
                singleRoute.save();
                response.send(singleRoute);
            } else {
                console.log("There was an issue editing the route. The error was: " + " " + err.status);
            }
        }
    })
});

// DELETE - delete specific candy from the DB
app.delete("/deleteRoute/:_id", function(request, response) {
    Route.remove({ _id: request.params._id }).exec(function(err, deletedRoute) {
        if (err) {
            console.log("Error" + " " + err)
        } else {
            response.status(204);
            response.send("Route has been removed from the DB");
        }
    })
});

// allows the server to connect on port 3000 
app.listen(3000, function() {
    console.log("Listening on http://localhost:3000");
});