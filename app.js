require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const md5 = require("md5");

const app = express();

mongoose.connect("mongodb://localhost:27017/userDB" , {useNewUrlParser:true,useUnifiedTopology: true})

userSchema = new mongoose.Schema({
	email:String,
	password:String
});

const User = new mongoose.model('user' , userSchema)


app.use(bodyParser.urlencoded({extended:true}));
app.set('view engine' , 'ejs');
app.use(express.static('public'));

app.get("/" , function(req,res){
	res.render('home')
})

app.get("/login" , function(req,res){
	res.render('login')
})

app.post("/register" , function(req,res){
	const newUser = new User({
		email:req.body.username,
		password:md5(req.body.password)
	})

	newUser.save(function(err){
		if (!err) {
			res.render('secrets')
		}
		else{
			console.log(err)
		}
	})
})

app.post("/login" , function(req,res){
	const username = req.body.username;
	const password = md5(req.body.password);

	User.findOne({email:username},function(err,foundUser){
		if (err) {
			console.log(err)
		}
		else{
			if (foundUser) {
				if(foundUser.password === password){
					res.render('secrets')
				}
			}
		}
	})
})

app.get("/register" , function(req,res){
	res.render("register")
})

app.listen(3000,function(){
	console.log("sever started")
})