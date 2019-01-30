var express = require("express");
var path = require("path");
var app = express();

app.use(express.static("."));

app.get("/", function(req, res) {
    res.sendFile(path.resolve(__dirname, "demo.html"));
});

app.listen("8888");