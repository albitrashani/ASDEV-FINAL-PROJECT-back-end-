const mongodb = require("mongodb").MongoClient;
const csvtojson = require("csvtojson");

var express = require('express');
const bodyParser = require('body-parser');
var http = require('http');

var app = express();
var server = http.createServer(app);
const csv = require('csv-parser');
const fs = require('fs');




let url = "mongodb://localhost:27017/";
csvtojson().fromFile("users.csv").then(csvData => {
    
    mongodb.connect(
      url, { useNewUrlParser: true, useUnifiedTopology: true },
      (err, client) => {
        if (err) throw err;
        
        client.db("FinalProject").collection("Users").insertMany(csvData, (err, res) => {
            if (err) throw err;

            });
            
      }
    );
    
});
csvtojson().fromFile("menu.csv").then(csvData => {
 
  mongodb.connect(
    url, { useNewUrlParser: true, useUnifiedTopology: true },
    (err, client) => {
      if (err) throw err;
      
      client.db("FinalProject").collection("Menu").insertMany(csvData, (err, res) => {
          if (err) throw err;

          });
          
    }
  );
  
});
csvtojson().fromFile("restaurant.csv").then(csvData => {
   mongodb.connect(
    url, { useNewUrlParser: true, useUnifiedTopology: true },
    (err, client) => {
      if (err) throw err;
      
      client.db("FinalProject").collection("Restaurant").insertMany(csvData, (err, res) => {
          if (err) throw err;

          });
          
    }
  );
  
});

csvtojson().fromFile("orders.csv").then(csvData => {
  mongodb.connect(
   url, { useNewUrlParser: true, useUnifiedTopology: true },
   (err, client) => {
     if (err) throw err;
     
     client.db("FinalProject").collection("Orders").insertMany(csvData, (err, res) => {
         if (err) throw err;

         });
         
   }
 );
 
});
server.listen(27017);