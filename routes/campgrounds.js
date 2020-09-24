const e = require("express");
var express =require("express")
var router = express.Router({mergeParams:true});
var Campground = require("../models/campgrounds")
var Comment = require("../models/comment")
var middleware=require("../middleware")

router.get("/",function(req,res){
    //res.render("campgrounds",{campgrounds:campgrounds})
    Campground.find({}, function(err,allCampgrounds){
        if(err){
            console.log(err)
        }else{
            res.render("campgrounds/index",{campgrounds:allCampgrounds, currentUser:req.user})
        }
    })
});

router.post("/", middleware.isLoggedIn,function(req,res){
var name = req.body.name;
var image =req.body.image;
var des=req.body.description;
var author={
    id: req.user._id,
    username:req.user.username
}
var newCampground={name: name,image: image,description: des, author:author}

//create new date to database
Campground.create(newCampground, function(err,newcamps){
    if(err){
        console.log(err)
    }else{
        req.flash("success", "Add the comment successfully")
        res.redirect("/campgrounds")
    }
})

})

router.get("/new", middleware.isLoggedIn,function(req,res){
res.render("campgrounds/new")
})

router.get("/:id", function(req,res){

Campground.findById(req.params.id).populate("comment").exec(function(err, foundCampground){
    if(err){
        console.log(err)
    }else{
        res.render("campgrounds/show", {campground:foundCampground});
    }
})
     // res.send("these will be a new page one day")
})


router.get("/:id/edit", middleware.checkCampOwnership, function(req, res){
    Campground.findById(req.params.id, function(err, foundCampground){
            res.render("campgrounds/edit", {campground:foundCampground}) 
    }
    )
});


router.put("/:id", middleware.checkCampOwnership, function(req, res){
    Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err,foundCamp){
        if(err){
            res.redirect("/campgrounds")
        }else{
            res.redirect("/campgrounds/"+req.params.id)
        }
    })
});


router.delete("/:id", middleware.checkCampOwnership,function(req, res){
    
    Campground.findByIdAndRemove(req.params.id, function(err,){
        if(err){
            console.log(err)
        }else{
            res.redirect("/campgrounds")

    }
})})


module.exports=router