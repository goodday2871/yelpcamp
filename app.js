var express     = require("express"),
    app         = express(),
    bodyParser  = require("body-parser"),
    passport    = require("passport"),
    LocalStrategy=require("passport-local"),
    session     = require("express-session"),
    { render }  = require("ejs"),
    Campground  = require("./models/campgrounds"),
    seedDB      = require("./seeds"),
    Comment     = require("./models/comment"),
    path        = require("path"),
    User        = require("./models/user"),
    methodOverride=require("method-override"),
    flash       = require("connect-flash")
    __dirname = path.resolve();

var commentRoutes = require("./routes/comments"),
    campgroundRoutes = require("./routes/campgrounds"),
    indexRoutes      = require("./routes/index");
   
//seedDB();

app.set("view engine","ejs");
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static('public'));
app.use(methodOverride("_method"));
app.use(flash());
var mongoose = require("mongoose");
const { userInfo } = require("os");
mongoose.connect('mongodb://localhost/yelp_camp', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('Connected to DB!'))
.catch(error => console.log(error.message));


app.use(session({
    secret:"this is a cat",
    resave:false,
    saveUninitialized:false 
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
app.use(function(req, res, next){
    res.locals.currentUser=req.user;
    res.locals.error = req.flash("error")
    res.locals.success = req.flash("success")
    next();
});


app.use("/campgrounds/:id/comments/", commentRoutes)
app.use("/campgrounds", campgroundRoutes)
app.use("/", indexRoutes)

app.listen(5500,function(){
    console.log("sever started")
})
