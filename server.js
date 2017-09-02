// Dependencies
var express     = require("express");
var app         = express();
var bodyParser  = require("body-parser");
var morgan      = require('morgan');
var mongoose    = require("mongoose");
var passport    = require('passport');
var config      = require('./config/database');
var User        = require('./app/models/user');
var port        = process.env.PORT || 3000;
var jwt         = require('jwt-simple');

// Uses for getting page elements
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());
// app.use(express.static(__dirname));
app.use(morgan('dev'));
app.use(passport.initialize());

// connect to database
mongoose.connect(config.database);

app.get('/', function(req,res){
  res.send("Hello, the API is at http://localhost:" + port + '/api');
});
// pass passport for configuration
require('./config/passport')(passport);
// bundle our routes
var apiRoutes = express.Router();
// create a new user account (POST http://localhost:8080/api/signup)
apiRoutes.post('/signup', function(req, res) {
  if (!req.body.name || !req.body.password) {
    res.json({success: false, msg: 'Please pass name and password.'});
  } else {
    var newUser = new User({
      name: req.body.name,
      password: req.body.password
    });
    // save the user
    newUser.save(function(err) {
      if (err) {
        return res.json({success: false, msg: 'Username already exists.'});
      }
      res.json({success: true, msg: 'Successful created new user.'});
    });
  }
});
// connect the api routes under /api/*
app.use('/api', apiRoutes);
// route to authenticate a user (POST http://localhost:8080/api/authenticate)
apiRoutes.post('/authenticate', function(req, res) {
  User.findOne({
    name: req.body.name
  }, function(err, user) {
    if (err) throw err;
 
    if (!user) {
      res.send({success: false, msg: 'Authentication failed. User not found.'});
    } else {
      // check if password matches
      user.comparePassword(req.body.password, function (err, isMatch) {
        if (isMatch && !err) {
          // if user is found and password is right create a token
          var token = jwt.encode(user, config.secret);
          // return the information including token as JSON
          res.json({success: true, token: 'JWT ' + token});
        } else {
          res.send({success: false, msg: 'Authentication failed. Wrong password.'});
        }
      });
    }
  });
});
// route to a restricted info (GET http://localhost:8080/api/memberinfo)
apiRoutes.get('/memberinfo', passport.authenticate('jwt', { session: false}), function(req, res) {
  var token = getToken(req.headers);
  if (token) {
    var decoded = jwt.decode(token, config.secret);
    User.findOne({
      name: decoded.name
    }, function(err, user) {
        if (err) throw err;
 
        if (!user) {
          return res.status(403).send({success: false, msg: 'Authentication failed. User not found.'});
        } else {
          res.json({success: true, msg: 'Welcome in the member area ' + user.name + '!'});
        }
    });
  } else {
    return res.status(403).send({success: false, msg: 'No token provided.'});
  }
}); 
getToken = function (headers) {
  if (headers && headers.authorization) {
    var parted = headers.authorization.split(' ');
    if (parted.length === 2) {
      return parted[1];
    } else {
      return null;
    }
  } else {
    return null;
  }
};
// allows the server to connect on port 3000 
app.listen(port);
console.log("Local server running on: http://localhost:" + port);

// Connect to DB with mongoose
// mongoose.Promise = global.Promise;
// mongoose.connect("mongodb://localhost:27017/MunchDB", function(err){
// 	if(err){
// 		console.log("Error: " + err);
// 	}
// 	else {
// 		console.log("Connected to Database")
// 	}
// });

// Mongoose Schema - New Candy
// var Route = mongoose.model("Route",{
// 	city:String,
//   cusineOne:String,
//   cusineTwo:String,
//   cusineThree:String,
//   locationOne:Object,
//   locationTwo:Object,
// 	locationThree:Object
// });

// var Cuisine = mongoose.model("Cusine",{
//   type:String
// });

// // CREATE - POST candy to DB
// app.post("/saveRoute",function(request, response){
//     var newRoute = new Route(request.body);
//     newRoute.save();
//     newRoute.status(201);
//     newRoute.send(newRoute);
// });

// // READ - GET all candy from DB
// app.get("/getallRoutes", function(request, response){
//    Route.find({}).exec(function(err,route){
//        if(err){
//            console.log("Error" + " " + err);
//        }
//        else{
//            response.send(route);
//            console.log("Routes Loaded and sent back to FE");
//        }
//    }) 
// });

// // UPDATE - PUT (update) a candy in the DB by the id
// app.put("/editRoute/:_id", function(request, response){
    
//     var editRoute = request.body;

//     Route.findOne({_id:request.params._id}).exec(function(err,singleRoute){
//         if(err){
//             console.log("Error" + " " + err);
//         }
//         else{
//             if(singleRoute){
//                 singleRoute.locationOne = request.body.newLocationOne;
//                 singleRoute.locationTwo = request.body.newLocationTwo;
//                 singleRoute.locationThree = request.body.newLocationThree;
//                 singleRoute.save();
//                 response.send(singleRoute);
//             }
//             else{
//                 console.log("There was an issue editing the route. The error was: " + " " + err.status);
//             }      
//         }
//     })
// });

// // DELETE - delete specific candy from the DB
// app.delete("/deleteRoute/:_id",function(request,response){
//     Route.remove({_id:request.params._id}).exec(function(err,deletedRoute){
//         if(err){
//             console.log("Error" + " " + err)
//         }
//         else{
//             response.status(204);
//             response.send("Route has been removed from the DB");
//         }
//     })
// });

// // allows the server to connect on port 3000 
// app.listen(port);
// console.log("Local server running on: http://localhost:" + port);