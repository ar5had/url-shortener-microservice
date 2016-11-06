var express = require("express")
    , crypto = require("./crypto")
    , port = process.env.PORT || 8080
    , path = require("path"); 

var app = express();

app.use(express.static(path.join(__dirname, "public")));


app.get("/shorten/:url", function(req, res) {
    var url = req.params.url;
    res.send(crypto.encode(1000));
});

app.get("/:id", function(req, res) {
    var id = req.params.id;
    var redirectURL = crypto.decode(id).toString();
    res.send(redirectURL);
});

app.listen(port, function() {
   console.log("App running on", port); 
});