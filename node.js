"use strict";
var config = require("./config.js");
var express = require("express");
var app = express();
const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');

app.use(express.static(__dirname + "/public", { index: false }));
app.use(express.static(__dirname + "/views", { index: false }));
app.use(express.static(__dirname + "/public/js", { index: false }));
app.use(express.static(__dirname + "/public/css", { index: false }));
var bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: true }));

/* 接続先URL */
const url = 'mongodb://localhost:27017';

/* データベース名 */
const dbName = 'testMongo';

/**
 * 追加オプション
 * MongoClient用オプション設定
 */
const connectOption = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}

//-----------------------------トップページ-------------------------------
app.get('/', function (req, res) {
    res.render("index.ejs");
})

app.get("/users", function (req, res) {
    MongoClient.connect(url, connectOption, (err, client) => {

        /* Errorがあれば処理を中断 */
        assert.equal(null, err);

        /* 接続に成功すればコンソールに表示 */
        console.log('Connected successfully to server');
        /** DBを取得 */
        const db = client.db(dbName);

        db.collection('ContextCol').find({ name: { $exists: true } }).toArray(function (err, result) {
            if (err) throw err;
   
            res.send(result);
        })
        /* DBとの接続切断 */
    });
})

// -----------------------------メソッド-----------------------------------

app.post('/users', function (req, res) {
    console.log(req.body.name, req.body.age);
    MongoClient.connect(url, connectOption, (err, client) => {

        assert.equal(null, err);
        console.log('Connected successfully to server');

        const context = { name: req.body.name, age: req.body.age }
        const db = client.db(dbName);
        db.collection('ContextCol').insertOne(context, function (err, results) {
            if (err) throw err;
            console.log('yeah');
            res.send(context);
        })
    });

})

app.put('/users', function (req, res) {
    console.log(req.body.beforename, req.body.beforeage, req.body.name, req.body.age)
    MongoClient.connect(url, connectOption, (err, client) => {

        assert.equal(null, err);
        console.log('Connected successfully to server');
        const db = client.db(dbName);
        let where = { name: req.body.beforename, age: req.body.beforeage };
        let set = { $set: { name: req.body.name, age: req.body.age } };
        db.collection('ContextCol').updateMany(where, set, function (err, result) {
            if (err) throw err;
            console.log('update');
            res.send(result);
        })

    });
})
app.delete('/users', function (req, res) {
    console.log(req.body.beforename, req.body.beforeage, req.body.name, req.body.age);
    MongoClient.connect(url, connectOption, (err, client) => {


        assert.equal(null, err);
        console.log('Connected successfully to server');
        const db = client.db(dbName);
        let where = { name: req.body.beforename, age: req.body.beforeage };

        db.collection('ContextCol').deleteMany(where, function (err, result) {
            if (err) throw err;
            console.log('DELETE!');
            res.send(result);
        })

    });
})


app.listen(config);