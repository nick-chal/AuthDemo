var express                 = require('express'),
    mongoose                = require('mongoose'),
    passport                = require('passport'),
    bodyParser              = require('body-parser'),
    LocalStrategy           = require('passport-local'),
    passportLocalMongoose   = require('passport-local-mongoose'),
    User                    = require('./models/users');
mongoose.connect("mongodb://localhost/auth_demo");


var app = express();
app.use(bodyParser.urlencoded({extended: true}));
app.use(require("express-session")({
    secret: "This is the secret line in session",
    resave: false,
    saveUninitialized: false
})
);
app.set('view engine', 'ejs');
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//ROUTES========
app.get("/", function (req, res) {
    res.render("home");
});

app.get("/secret", isLoggedIN, function (req, res) {
   res.render("secret");
});

//Auth Routes====
app.get("/register", function (req, res) {
    res.render("register");
});
//register logic
app.post("/register", function (req, res) {
    req.body.username;
    req.body.password;
    User.register(new User({username: req.body.username}), req.body.password, function(err,user){
       if(err){
           console.log(err);
           return res.render('register');
       } else {
           passport.authenticate("local")(req, res, function () {//"local" or facebook or ..
               res.redirect("/secret");
           });
       }
    });
});

//Login routes=======
app.get("/login", function (req, res) {
    res.render("login");
});
//login logic
app.post("/login", passport.authenticate("local", {
    successRedirect: "/secret",
    failureRedirect: "/login"
}), function (req, res) {});


function isLoggedIN(req, res, next) {
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}

app.get('/logout', function (req, res) {
   req.logout();
   res.redirect("/");
});


app.listen(3000, function () {
    console.log("Server Started at the port 3000");
});