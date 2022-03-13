const router = require("express").Router();
const connection = require("../config/database").mysqlConnection;
const passport = require("passport");

const genPass = require("../config/gen-valid-pass").generatePass;

// Login by google
router.get("/auth/google",
    passport.authenticate("google", { scope: ["profile"] }));

router.get("/auth/google/home",
    passport.authenticate("google", { successRedirect: "/home", failureRedirect: "/" }),
);


// Login by facebook
router.get("/auth/facebook",
  passport.authenticate("facebook", { scope: ["public_profile"] }));

router.get("/auth/facebook/home",
  passport.authenticate("facebook", {  successRedirect: "/home", failureRedirect: "/" }),
 );

// Log in page
router.get("/", function (req, res) {
    res.render("login_page");
});

// Handle with log in user
router.post("/", passport.authenticate("local",
    { successRedirect: "/home", failureRedirect: "/" }));

// Sign up page
router.get("/signup", function (req, res) {
    res.render("signup_page")
});


// Handle with the new account create
router.post("/signup", function (req, res) {

    const pass_hashed = genPass(req.body.key);
    const userInfo = [
        [req.body.account, pass_hashed.salt, pass_hashed.hash]
    ]
    let newUser = `INSERT INTO users (username, salt, hash)
    VALUES ?`

    connection.query(newUser, [userInfo],function(err, result){
        if(err) throw err;
        res.redirect("/");
    });

});

// Home page
router.get("/home", function (req, res) {
    if (req.isAuthenticated()) {
      connection.execute(`SELECT * FROM posts`, function(err, posts){
          if(err) throw err;
          res.render("home_page", { posts: posts })
      })
    }
    else {
        console.log("You're credientials is not corrects");
        res.redirect("/");
    }
});

// Log out request
router.get("/logout", function (req, res) {
    req.logOut();
    res.redirect("/");
});

// Post page
router.get("/post", function (req, res) {
    if (req.isAuthenticated()) {
        res.render("post_page")
    } else {
        console.log("You are not authorized.\"you have to login\"");
        res.redirect("/")
    }
});

// Handle with publish posts
router.post("/post", function (req, res) {

    const date = new Date()
    let yyyy = date.getFullYear();
    let mm = date.getMonth() + 1;
    let dd = date.getDate(); 
    console.log(`${yyyy}-${mm}-${dd}`)
    let newPost = [
        [req.body.title, req.body.content,`${yyyy}-${mm}-${dd}`]
    ];
    let sql = `INSERT INTO posts (title, content, time) VALUES ?`

    connection.query(sql, [newPost], function(err, result){
        if(err) throw err;
        console.log(result);
        res.redirect("/home");

    });
});


module.exports = router;