const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const GoogleStartegy = require("passport-google-oauth20").Strategy;
const FacebookStrategy = require("passport-facebook").Strategy;
const mysqlConnection = require("./database").mysqlConnection;

const validationPass = require("./gen-valid-pass").validationPass;

require("dotenv").config({
    path: "../environement/.env"
});

/*------------- Local Strategy configuration---------------*/
const customField = {
    usernameField: "email",
    passwordField: "password",
}

const verifyCallBack = (username, password, done) => {

    let sql = `SELECT * FROM users WHERE username = "${username}" ;`

    mysqlConnection.query(sql, function (err, result) {

        if (err) { return done(err); }
        if (!result[0]) { return done(null, false); }

        isPasswordValid = validationPass(password, result[0].salt, result[0].hash);

        if (isPasswordValid) {
            return done(null, result[0]);
        }

        return done(null, false)

    });
}

const local_strategy = new LocalStrategy(customField, verifyCallBack);

passport.use(local_strategy);


/*------------- Google Strategy configuration---------------*/

passport.use(new GoogleStartegy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "https://anonymous-poster-app.herokuapp.com/auth/google/home"

}, function (accessToken, refreshToken, profile, done) {

    let sql = `SELECT * FROM users WHERE googleId = "${profile.id}" ;`

    mysqlConnection.query(sql, function (err, result) {
        
        if (err) { return done(err); }
       
        if (!result[0]) {
            let addUser = `INSERT INTO users (
                username,
                googleId
            ) VALUES ("${profile.displayName}", "${profile.id}")`
            
             mysqlConnection.query(addUser);                    
        }
        return done(null, result[0]);
    });
}));


/*------------- Facebook Strategy configuration---------------*/

passport.use(new FacebookStrategy({
    clientID: process.env.FACEBOOK_APP_ID,
    clientSecret: process.env.FACEBOOK_APP_SECRET,
    callbackURL: "https://anonymous-poster-app.herokuapp.com/auth/facebook/home"
  },
  function(accessToken, refreshToken, profile, done) {
    let sql = `SELECT * FROM users WHERE facebookId = "${profile.id}" ;`

    mysqlConnection.query(sql, function (err, result) {
        
        if (err) { return done(err); }
        if (!result[0]) {
            let addUser = `INSERT INTO users (
                username,
                facebookId
            ) VALUES ("${profile.displayName}", "${profile.id}")`
            
             mysqlConnection.query(addUser);               
        }
        return done(null, result[0]);

    });
}
));

passport.serializeUser(function (user, done) {
    done(null, user.id);
});

passport.deserializeUser(function (id, done) {
    
    let sql = `SELECT * FROM users WHERE id = ${id}`
    
    mysqlConnection.query(sql, function(err, user){
        if(err) throw err;
        done(err, user[0]);

    });
});

