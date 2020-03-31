var express    		= require("express");
var app        		= express();
var bodyParser 		= require("body-parser");
var mongoose   		= require("mongoose");
var flash           = require("connect-flash");
var passport   		= require("passport");
var LocalStrategy 	= require("passport-local");
var methodOverride  = require("method-override")
var Campground 		= require("./models/campground");
var Comment    		= require("./models/comment");
var User       		= require("./models/user");
var seedDB     		= require("./seeds");

var commentRoutes   = require("./routes/comments");
var campgroundRoutes= require("./routes/campgrounds");
var indexRoutes      = require("./routes/index");

const url = "mongodb+srv://infern018:A%40nmol26@yelpcamp-0nxva.mongodb.net/test?retryWrites=true&w=majority";


mongoose.connect(url,{ useNewUrlParser: true,  useUnifiedTopology: true}).catch(function (reason) {
    console.log('Unable to connect to the mongodb instance. Error: ', reason);
});

app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine","ejs");
app.use(express.static(__dirname+"/public"));
app.use(methodOverride("_method"));
app.use(flash());

//PASSPORT CONFIG:
var session = require("express-session");
var MongoStore = require('connect-mongo')(session);


app.set('trust proxy', 1); // trust first proxy
app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true,
  store: new MongoStore(options);
  cookie: { secure: true }
}));

app.use(require("express-session")({
	secret:"Once again cheeku wins...!",
	resave: false,
	saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
	res.locals.currentUser = req.user;
	res.locals.error       = req.flash("error");
	res.locals.success     = req.flash("success");
	next();
});
//requiring routes
app.use("/",indexRoutes);
app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/comments",commentRoutes);

app.listen(3026,function(){
	console.log("Yelp Camp has Started!");
});

