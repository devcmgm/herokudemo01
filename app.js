var express = require("express");
var request = require("request");
var bodyParser = require("body-parser");
var path = require("path");
var app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use('/css', express.static(__dirname + '/node_modules/bootstrap/dist/css'));
app.use('/bootstrap', express.static(__dirname + '/node_modules/bootstrap/dist/js'));
app.use(express.static(path.join(__dirname, "public")));


app.use("/styles/css", express.static(path.join(__dirname, "node_modules/bootstrap/dist/css")));
app.listen((process.env.PORT || 5000));

app.get("/", function(req, res) {
    res.sendFile(path.join(__dirname + "/fb.html"));
    //res.send(__dirname + " - Deployed!");
});

app.get("/VR", function(req, res) {
    res.sendFile(path.join(__dirname + "/VRDemo.html"));
    //res.send(__dirname + " - Deployed!");
});

app.get("/login", function(req, res) {
    res.clearCookie("mgmmallusername");
    res.sendFile(path.join(__dirname + "/Login.html"));
    //res.send(__dirname + " - Deployed!");
});

app.get("/connected", function(req, res) {
    const { Client } = require('pg');

    const client = new Client({
        connectionString: "postgres://yjdnlmwdywjtjb:99a127b12c5e35ce67e963b8273404d8c8b37f502bedf61c1f31d22bd27f1340@ec2-54-235-208-103.compute-1.amazonaws.com:5432/d36v8d35isr8bm",
        ssl: true,
    });

    client.connect();

    client.query('SELECT name FROM users;', (err, res) => {
        if (err) throw err;
        //for (let row of res.rows) {
        // console.log(JSON.stringify(row));
        // }
        client.end();
    });
    res.sendFile(path.join(__dirname + "/connected.html"));
    //res.send(__dirname + " - Deployed!");
});

app.get("/webhook", function(req, res) {
    if (req.query["hub.verify_token"] === "FBDEMOCHAT2019") {
        console.log("Verified webhook");
        res.status(200).send(req.query["hub.challenge"]);
    } else {
        console.error("Verification failed. The tokens do not match.");
        res.sendStatus(403);
    }
});