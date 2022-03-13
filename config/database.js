const mysql = require("mysql2");
const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config({
    path: "../environement/.env",
});

// Mongodb for store sessions
// const db = mongoose.connect(process.env.URL_DB);
const connectionMongodb = mongoose.connect(process.env.URL_DB)

// Mysql for store users and posts 
const pool =  mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
 
});

module.exports.mysqlConnection = pool;
module.exports.mongodbConnection = connectionMongodb;