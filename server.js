var express = require("express");
var app = express();
app.use(express.static(__dirname));
app.get("/",(req,res)=> res.sendFile("./index.html"));
app.get("*",(req,res)=>res.send("404 not found"))
app.listen(3001)