const MongoClient = require("mongodb").MongoClient;
const url = "mongodb://127.0.0.1:27017/";
// создаем объект MongoClient и передаем ему строку подключения
const mongoClient = new MongoClient(url);


        
mongoClient.connect();
console.log("Подключение установлено");
const db = mongoClient.db("test");
const collection = db.collection("users");


module.exports = db;
