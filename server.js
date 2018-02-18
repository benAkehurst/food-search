// Dependencies
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const request = require('request');
const rp = require('request-promise');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const mongooseUniqueValidator = require('mongoose-unique-validator');

const app = express();
const router = express.Router();

// Schemas
const User = require('./serverModels/user');
const Route = require('./serverModels/rotue');

// Requirements
require('dotenv').config()

// Uses for getting page elements
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(__dirname));
app.use(function(req, res, next) {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.setHeader('Access-Control-Allow-Methods', 'POST, GET, PATCH, DELETE, OPTIONS');
    next();
});

// Connect to DB with mongoose
mongoose.Promise = global.Promise;
mongoose.connect("mongodb://localhost:27017/MunchDB", function(err) {
    if (err) {
        console.log("Error: " + err);
    } else {
        console.log("Connected to Database")
    }
});
// register user method
app.post('/registerUser', function (req, res, next) {
    var user = new User({
        name: req.body.name,
        email: req.body.email,
        password: bcrypt.hashSync(req.body.password, 10)
    });
    user.save(function (err, result) {
        if (err) {
            return res.status(500).json({
                title: 'An error occurred with sign up',
                error: err
            });
        }
        res.status(201).json({
            message: 'User created',
            obj: result
        });
    });
});
// Login user method
app.post('/login', function (req, res, next) {
    User.findOne({ email: req.body.email }, function (err, user) {
        if (err) {
            return res.status(500).json({
                title: 'An error occurred',
                error: err
            });
        }
        if (!user) {
            return res.status(401).json({
                title: 'Login failed',
                error: { message: 'Invalid login credentials' }
            });
        }
        if (!bcrypt.compareSync(req.body.password, user.password)) {
            return res.status(401).json({
                title: 'Login failed',
                error: { message: 'Invalid login credentials' }
            });
        }
        var token = jwt.sign({ user: user }, 'secret', { expiresIn: 7200 });
        res.status(200).json({
            message: 'Successfully logged in',
            token: token,
            userId: user._id
        });
    });
});

// Get the users location via IP address
var userLocaionViaIP = '';
var options = { uri: 'http://ipinfo.io', headers: { 'User-Agent': 'Request-Promise'}, json: true };
rp(options)
.then(function (userLocation) {
    userLocaionViaIP = userLocation;
})
.catch(function (err) {
    if(err){
        userLocaionViaIP = 'error finding location';
    }
});

// API call to google places to get locations list
app.post('/routeOptions', function(req, res) {
    console.log('Requesting Places from Goolge API');
    var base = "https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=";
    var longLat = userLocaionViaIP.loc;
    var radius = req.body.radius;
    var type = req.body.type;
    var key = "&key=" + process.env.GOOGLE_PLACES_API_KEY;
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
    var key = "&key=" + process.env.GOOGLE_PLACES_API_KEY;
    var photoUrl = base + location + sensor + key;
    res.send(photoUrl);
    console.log("Photo Url sent to FE");
});
// Save a route to DB
app.post("/saveRoute/:id", function(request, response) {
    console.log(request.body.uid);
    User.findOne({
        uid: request.body.uid,
    }).exec(function(err, user) {
        if (err) {
            console.log("Error: " + err)
        } else
        if (user) {
            User.routes.push({
                loc1: request.body.routes.loc1,
                loc2: request.body.routes.loc2,
                loc3: request.body.routes.loc3,
            })
            user.save();
            response.send(User);
        }
    })
});
//Gets user details in profile
app.get("/userInfo/:userId", function (req, res) {
    User.findById({ _id: req.params.userId }).exec(function (err, user) {
        if (err) {
            console.log("Error: " + " " + err);
        } else {
            // console.log(user);
            res.send(user);
            console.log("Returned user to login");
        }
    })
});
// Get all saved routes from DB for profile
app.get("/getallRoutes/:id", function(request, response) {
    // console.log(request.params.id);
    User.findOne({
        uid: request.params.id,
    }).exec(function(err, user) {
        if (err) {
            console.log("Error: " + err);
        } else {
            // console.log(user);
            response.send(user);
        }
    })
});

// DELETE - delete specific candy from the DB
app.delete("/deleteRoute/:uid/:_id", function(request, response) {
    // console.log("ID" + request.params.id);
    User.findOne({ id: request.body.id })
        .exec(function(err, user) {
            if (err) {
                console.log("Error" + " " + err)
            } else {
                if (user) {
                    console.log("User " + user);
                    for (var i = 0; i < user.routes.length; i++) {
                        if (user.routes[i]._id == request.params._id) {
                            user.routes.splice(i, 1)
                            user.save();
                        }
                    }
                    response.send(user);
                }
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


// allows the server to connect on port 3000 
app.listen(3000, function() {
    console.log("Listening on http://localhost:3000");
});