var express = require("express");
var router  = express.Router();
var Campground = require("../models/campground");
var middleware = require("../middleware");
//index
router.get("/",function(req,res){
	//Get all from DB
	Campground.find({},  function(err, allcampgrounds){
		if(err){
			console.log(err);
		} else {
			res.render("campgrounds/index",{campgrounds:allcampgrounds, currentUser: req.user});
		}
	});

});

//CREATE-add a new campground
router.post("/",middleware.isLoggedIn ,function(req,res){
	var name = req.body.name;
	var image = req.body.image;
	var desc = req.body.description;
	var author = {
		id: req.user._id,
		username: req.user.username
	};
	var newCampground = {name: name, image: image, description: desc, author: author};
	console.log(req.user);
	//campgrounds.push(newCampground);
	Campground.create(newCampground,function(err,newlyCreated){
		if(err){
			console.log(err);
		} else {
			console.log(newlyCreated);
			res.redirect("/campgrounds");	
		}
	});
	
});

//form to create a new campground
router.get("/new",middleware.isLoggedIn ,function(req,res){
	res.render("campgrounds/new");
});

router.get("/:id",function(req,res){
	Campground.findById(req.params.id).populate("comments").exec(function(err,foundCampground){
		if(err){
			console.log(err);
		} else {
			console.log(foundCampground);
			res.render("campgrounds/show", {campground: foundCampground});
		}
	});
});
//EDIT CAMPGROUND ROUTE
router.get("/:id/edit",middleware.checkCampgroundOwnership ,function(req, res){
	Campground.findById(req.params.id, function(err, foundCampground){
				res.render("campgrounds/edit", {campground: foundCampground});	
	});
});

//UPDATE
router.put("/:id", function(req, res){

	Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updatedCampground){
		if(err){
			res.redirect("/campgrounds");
		} else {
			res.redirect("/campgrounds/" + req.params.id);
		}
	});
});

//DESTROY ROUTE
router.delete("/:id",middleware.checkCampgroundOwnership ,function(req, res){
	Campground.findByIdAndRemove(req.params.id, function(err){
		if(err){
			res.redirect("/campgrounds");
		} else {
			res.redirect("/campgrounds");
		}
	});
});

//Middleware


module.exports = router;