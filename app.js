require("dotenv").config({
    path: "./environement/.env"
});

const express = require("express");
const bodyParser = require("body-parser");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const passport = require("passport");


const app = express();

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true}));

// Configure the database to hold session
// Mongodb for store sessions
// const db = mongoose.connect(process.env.URL_DB);

const store = MongoStore.create({
    mongoUrl: process.env.URL_DB,
    collectionName: "sessions"
});


// Configure the session 
app.use(session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    store: store,
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
