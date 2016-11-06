var express = require("express")
    , port = process.env.PORT || 8080
    , path = require("path");

var app = express();

app.use(express.static(path.join(__dirname, "public")));

app.listen(port, function() {
   console.log("App running on", port); 
});