var express = require("express")
    , mongo = require("mongodb").MongoClient
    , port = process.env.PORT || 8080
    , path = require("path")
    , routes = require("./routes"); 

var app = express();

app.use(express.static(path.join(__dirname, "public")));

var url = 'mongodb://localhost:27017/url-shortener';

mongo.connect(url, function(err, db) {
    if (err) console.error("Error occurred while connecting to db:", err);
    
    console.log("successfully connected to db.");
    
    app.use(function(req, res, next) {
        req.db = db;
        next();
    });        
    
    app.use("/", routes);
});

app.listen(port, function() {
   console.log("App running on", port); 
});