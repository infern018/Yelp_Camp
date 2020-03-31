var express = require("express");
var router  = express.Router();
var passport= require("passport");
var User    = require("../models/user");

//root route
router.get("/",function(req,res){
	res.render("landing");
});



//AUTH ROUTES
router.get("/register", function(req,res){
	res.render("register");
});

//handle sign up logic
router.post("/register", function(req, res){
	var newUser = new User({username:req. body.username});
	User.register(newUser, req.body.password, function(err,user){
		if(err){
			if (err.name === 'UserExistsError') {
        // Duplicate email
       			 req.flash("error", "Username already taken");
        		 return res.redirect("/register");
      		} 	
      // Some other error
      			req.flash("error", "Something went wrong...");
      			return res.redirect("/register");
    		}
			//req.flash("error",err.message);
			//return res.render("register");
		passport.authenticate("local")(req, res, function(){
			req.flash("success", "Welcome to YelpCamp "+user.username);
			res.redirect("/campgrounds");
		});
	});
});

//show login form
router.get("/login", function(req, res){
	res.render("login");
});

//handle login logic
router.post("/login",passport.authenticate("local", 
	{
		successRedirect:"/campgrounds",
		faliureRedirect:"/login"
	}) ,function(req, res){
});

//logout
router.get("/logout", function(req, res){
	req.logout();
	req.flash("success", "Logged you out!");
	res.redirect("/campgrounds");
});

//middleware
function isLoggedIn(req, res, next){
	if(req.isAuthenticated()){
		return next();
	}
	res.redirect("/login");
};

module.exports = router;
