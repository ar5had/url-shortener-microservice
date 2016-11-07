var express = require("express");
var router = express.Router();
var crypto = require("./crypto");

var styles = "<style>@import url('https://fonts.googleapis.com/css?family=Bungee+Hairline');" +
            "body{background: #fefefe; word-wrap: break-word;}" +
            "p {font-size: 40px;color: #b33c66;font-family: 'Bungee Hairline', monospace;text-align: center;" +
            "margin-top: 40vh;font-weight: 900;word-spacing: 2px;}</style>";


function incrementCounter(req, res, next) {
    // increasing counter
    req.db.collection("counter")
        .update(
            { 
                _id: "counter"
            },
            {
                $inc : {
                    count : 1
                }
            }
        );
        
    next();
}

function insertUrlDocument(req, res, next) {
    //inserting new url document
    var obj = {original_url: req.params.url, _id: req.encodedId, entry_time: new Date().toUTCString()};
    req.db.collection("urls")
        .insert(obj, function(err, data) {
            if(err) console.error("Error happened while adding new document:", err);
        });
    next();
}

function sendResponse(req, res) {
    var elem = "<p>" + JSON.stringify({'original_url': req.params.url, 'short_url': 'https://shorten-that.herokuapp.com/' + req.encodedId}) + "</p>";
    res.send(styles + elem);
}

function validateUrl(url) {
  var format = /(http:\/\/|https:\/\/)[a-z0-9\-]+[.]\w+/;
  return (format.test(url));
}

router.get("/", function(req, res) {
    console.log("/ middleware called");
   res.sendFile(require("path").join(__dirname, "public", "index.html")); 
});

// this is calling many times
router.get("/:id", function(req, res) {
    console.log("/:id middleware called");
    var id = req.params.id;
    // searching short-url-id
    req.db.collection("urls")
        .find({_id: id})
        .toArray(function(err, docs) {
            if(err) console.error("Error occurred while searching urls:", err);
            if(docs.length > 0)
                res.redirect(docs[0]["original-url"]);
            else {
                var elem = "<p>Oops, wrong url requested!</p>";
                res.send(styles + elem);
            }
        });
});

router.get("/shorten/(http:\/\/|https:\/\/)[a-z0-9\-]+[.]\w+/", function(req, res, next) {
    console.log("/shorten middleware called");
    console.log(req.params);
    if (validateUrl(req.params[0])) {
        req.db.collection("counter")
        .find({_id: "counter"})
        .toArray(function (err, docs) {
            if (err) console.error("Error occurred while getting COUNTER document:", err);
            
            req.encodedId = crypto.encode(docs[0].count);
            
            next();
        });
    }
    else {
        var elem = "<p>Please enter correct and formatted url!</p>";
        res.send(styles + elem);
    }
}, [incrementCounter, insertUrlDocument, sendResponse]);

module.exports = router;