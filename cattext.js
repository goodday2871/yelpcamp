/*var mongoose = require("mongoose")
mongoose.connect("mogodb://localhost/cat_app")*/

const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/cat_app', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('Connected to DB!'))
.catch(error => console.log(error.message));

var catSchema = new mongoose.Schema({
    name:String,
    age:Number,
    temperament:String
}); 


var Cat = mongoose.model("Cat",catSchema);

var george = new Cat({
    name:"Morris",
    age:10,
    temperament:"cold"
})
Cat.create({
    name:"snow white",
    age:9,
    temperament:"bland"
}, function(err,cats){
    if(err){
        console.log(err)
    }else{
        console.log(cats)
    }
})


/*
george.save(function(err,cat){
    if(err){
        console.log("something wrong")
    }else{
        console.log("done")
        console.log(cat)
    }
});*/
Cat.find({}, function(err,cats){
    if(err){
        console.log(err)
    }else{
        console.log("All the cats....")
        console.log(cats)
    }
})