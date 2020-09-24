var middlewareOBJ={};

middlewareOBJ.checkCommentOwner = function checkCommentOwner(req, res, next){
        if(req.isAuthenticated()){
      
            Comment.findById(req.params.comment_id, function(err, foundComment){
                if(err){
                    res.redirect("back");
                }else{
                    //dose user own the camp?
                    if(foundComment.author.id.equals(req.user._id)){
                         next()
                }else{
                    req.flash("error", "You don't have permission to do that!")
                    res.redirect("back")
                }}
            })
        }else{
            req.flash("error", " You need to logged in to edit it!")
            res.redirect("back")
        }
    
    };
middlewareOBJ.checkCampOwnership=function checkCampOwnership(req, res, next){
    if(req.isAuthenticated()){
  
        Campground.findById(req.params.id, function(err, foundCampground){
            if(err){
                req.flash("error", "Campground not found")
                res.redirect("back");
            }else{
                //dose user own the camp?
                if(foundCampground.author.id.equals(req.user._id)){
                     next()
            }else{
                req.flash("error", "You don't have permission to do that!")
                res.redirect("back")
            }}
        })
    }else{
        req.flash("error", " You need to logged in to edit it!")
        res.redirect("back")
    }
    
    //if not redirect

    
}

middlewareOBJ.isLoggedIn =function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    req.flash("error", "You need to logged in to do that!")
    res.redirect("/login")
}


module.exports = middlewareOBJ;