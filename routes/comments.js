const e = require("express");
var express =require("express")
var router = express.Router({mergeParams:true});
var middleware=require("../middleware")

router.get("/new",middleware.isLoggedIn, function(req, res){
    Campground.findById(req.params.id ,function(err, campground){
        if(err){
            console.log(err)
        }else{
            res.render("comments/new", {campground:campground})
        }
    })
  
})

router.post("/",middleware.isLoggedIn, function(req,res){
    //look up camp using id
    Campground.findById(req.params.id, function(err, campground){
        if(err){
            console.log(err)
            res.redirect("/campgrounds");
        }else{
             // create new comment
            Comment.create(req.body.comment, function(err, comment){
                if(err){
                    req.flash("error", "Something went wrong, we will fix it as soon as possible")
                    console.log(err)
                }else{
                    //add user name and id 
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;
                    comment.save();
                    campground.comment.push(comment);
                    campground.save();
                    req.flash("success", "Add the comment successfully")
                    res.redirect("/campgrounds/"+campground._id);
                }
            })
        }
    })
})

router.get("/:comment_id/edit",middleware.checkCommentOwner, function(req, res){
    Comment.findById(req.params.comment_id, function(err, foundComment){
        if(err){
            res.redirect("back");
        }else{
            res.render("comments/edit", {campground_id:req.params.id, comment:foundComment})
        }
    })
})

router.put("/:comment_id",middleware.checkCommentOwner, function(req, res){
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err){
        if(err){
            res.redirect("back")
        }else{
            res.redirect("/campgrounds/"+req.params.id)
        }
    })
})

router.delete("/:comment_id",middleware.checkCommentOwner, function(req, res){
   Comment.findByIdAndRemove(req.params.comment_id, function(err){
      if(err){
          res.redirect("back")
      }else{
        req.flash("success", "Delete comment successfully")
          res.redirect("/campgrounds/"+req.params.id)
      }
   })
})

module.exports=router;