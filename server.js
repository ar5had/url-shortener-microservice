var express = require("express")
    , crypto = require("./crypto")
    , db_conf = require("./db_conf")
    , mongo = require("mongodb").MongoClient
    , port = process.env.PORT || 8080
    , path = require("path"); 

var app = express();

app.use(express.static(path.join(__dirname, "public")));

var url = 'mongodb://localhost:27017/url-shortener';

// Use connect method to connect to the server
mongo.connect(url, function(err, db) {
    if (err) console.error(err);
    
    app.get("/shorten/:url", function(req, res) {
        // fetching counter
        
        res.send();
    });
    
    app.get("/:id", function(req, res) {
        var id = req.params.id;
        var redirectURL = crypto.decode(id).toString();
        res.send(redirectURL);
    });
    
    // getting counter
    // db.collection("counter")
    //     .find({_id: "counter"})
    //     .toArray(function (err, docs) {
    //         if (err) console.error(err);
    //         console.log("count is", docs[0].count);
    //     });
    
    // increasing counter
    // db.collection("counter")
    //     .update(
    //         { 
    //             _id: "counter"
    //         },
    //         {
    //             $inc : {
    //                 count : 1
    //             }
    //         }
    //     );
    
    // searching short-url-id
    // db.collection("urls")
    //     .find({_id: id})
    //     .toArray(function(err, docs) {
    //         window.open(docs[0]["original-url"]);    
    //     });
    
    // inserting new url document
    // var obj = encode(no);
    // obj = {"original_url": url, id: obj};
    // db.collection("urls")
    //     .insert(obj, function(err, data) {
    //         if(err) console.error(err);
    //         res.send(JSON.stringify({"original_url": obj.original_url, "short_url": "https://shorten-that.herokuapp.com/" + obj.id}));
    //     });
        
    db.close();
});

app.listen(port, function() {
   console.log("App running on", port); 
});