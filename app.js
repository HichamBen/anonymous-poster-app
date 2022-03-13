const dotenv = require("dotenv").config({
    path: "./environement/.env"
});
const express = require("express");
const bodyParser = require("body-parser");
const session = require("express-session");
const sessionsDB = require("./config/database").mongodbConnection;
const MongoStore = require("connect-mongo");
const passport = require("passport");
let session_store;

const app = express();

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true}));

// Configure the database to hold session
sessionsDB.then(db => {
 session_store = MongoStore.create({
    client: db.connection.getClient(),
    collectionName: "sessions"
});
});

 
// Configure the session 
app.use(session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    store: session_store,
    cookie: {
        maxAge: 24 * 60 * 60 * 1000,
    }
}));


require("./config/passport");

app.use(passport.initialize());
app.use(passport.session());

app.use(require("./routers"));


app.listen(process.env.PORT || 3000, function () {
    console.log(`The server is running on port ${process.env.PORT}`);
});
