var express = require("express");
var app = express();
var mongoose = require("mongoose");
var bodyParser = require("body-parser");
var methodOverride = require("method-override");
var expressSanitizer = require("express-sanitizer");

mongoose.connect("mongodb://localhost/blog_app");
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));
app.use(methodOverride("_method"));
app.use(expressSanitizer());


//schema mongoose
var blogSchema = new mongoose.Schema({
	title: String,
	image: String,
	body: String,
    created: {type: Date, default: Date.now}
});

//model compiling
var Blog = mongoose.model("Blog", blogSchema);

//testing blog first
// Blog.create({
// 	title: "Nature",
// 	image: "https://thumbs.dreamstime.com/b/woman-praying-free-birds-to-nature-sunset-background-woman-praying-free-birds-enjoying-nature-sunset-99680945.jpg",
// 	body: "Mother nature is the most important for us."
// });

//ROUTES
app.get("/", function(req,res){
	res.redirect("/blogs");
});

//1. Index route
app.get("/blogs", function(req,res){
	Blog.find({}, function(err,blogs){
		if(err){
			console.log(err);
		}
		else{	
		res.render("index", {blogs: blogs});
		}
	})
});

//2. new route
app.get("/blogs/new", function(req,res){
	res.render("new");
});

//3. create route
app.post("/blogs", function(req,res){
	req.body.blog.body = req.sanitize(req.body.blog.body)
	Blog.create(req.body.blog, function(err, newBlog){
		if(err){
			res.render("new");
		}
		else{
			res.redirect("/blogs");
		}
	})
});

//4. show route
app.get("/blogs/:id", function(req,res){
	Blog.findById(req.params.id, function(err,foundBlog){
	if(err){
		res.redirect("/blogs")
	}
	else{
		res.render("show", {blog: foundBlog} );
	}
	})
});

//5. Edit Route
app.get("/blogs/:id/edit", function(req,res){
	Blog.findById(req.params.id, function(err,foundBlog){
	if(err){
		res.redirect("/blogs");
	}
	else{
	res.render("edit",{blog: foundBlog});
	}
	})
});


//6. Update route
app.put("/blogs/:id", function(req,res){
	req.body.blog.body = req.sanitize(req.body.blog.body)
	Blog.findByIdAndUpdate(req.params.id, req.body.blog, function(err, updatedBlog){
	if(err){
		res.redirect("/blogs");
	}
	else{
	res.redirect("/blogs/"+ req.params.id);
	}
	})
});


//7. delete route
app.delete("/blogs/:id", function(req,res){
	Blog.findByIdAndRemove(req.params.id, function(err, updatedBlog){
	if(err){
		res.redirect("/blogs");
	}
	else{
		res.redirect("/blogs");
	}
	})
});








app.listen(process.env.PORT, process.env.IP, function(){
	console.log("Blog Server has begun!!");
})
