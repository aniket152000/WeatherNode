const {Client}=require('pg');
var assert = require('assert');
const express = require("express");
const session = require('express-session');
const bodyparser = require("body-parser");
const { password } = require('pg/lib/defaults');
var bcrypt = require('bcrypt');

const app = express();

app.use(session({
	secret: 'secret',
	resave: true,
	saveUninitialized: true
}));

var today = new Date();

const curTime=today.getHours();

app.use(bodyparser.urlencoded({ extended: true }));

app.use(express.json());

const client=new Client({
    host:"localhost",
    user:"postgres",
    port:5432,
    password:'ani24',
    database:'users',
})

client.connect();

app.get("/register", function (req, res) {
    res.sendFile(__dirname +"/register.html");
});

app.get("/login",function(req,res){
    res.sendFile(__dirname+"/login.html");
});

app.post("/register" ,(req ,res)=>{
    var name=req.body.name;
    var email=req.body.email;
    var password=req.body.password;

    client.query(`INSERT INTO users (name,email,password) VALUES ($1,$2,$3)`,
    [name,email,password],
    (err,res)=>{
        if(!err){
            console.log("registration done");
        
        }else{
            console.log(err.message);
        }
        client.end;
    })
})


app.post('/login', function(req, res) {
	// Capture the input fields
	let email = req.body.email;
	let password = req.body.password;
	// Ensure the input fields exists and are not empty
	if (email && password) {
		// Execute SQL query that'll select the account from the database based on the specified username and password
		client.query('SELECT * FROM users WHERE email = $1 AND password = $2;', [email, password], function(error, results, fields) {
			// If there is an issue with the query, output the error
			//if (error) throw error;
			// If the account exists

            console.log(req.body.email);
            console.log(req.body.password);
            //console.log(results.rows.length);
			if (results.rows.length > 0) {
				// Authenticate the user
				req.session.loggedin = true;
				req.session.email = email;
				// Redirect to home page
				res.redirect('/tempraturecalculator');
			} else {
				res.send('Incorrect email and/or Password!');
			}			
			res.end();
		});
	} else {
		res.send('Please enter email and Password!');
		res.end();
	}
});
 
//sends index.html
app.get("/tempraturecalculator", function (req, res) {
    res.sendFile(__dirname + "/weather.html");
});

app.post("/tempraturecalculator",function(req,res){

        cName = req.body.City;

        if (cName=="pune"||cName=="banglore"||cName=="mumbai" || cName=="delhi"){

            if(curTime<12){
                function genRandomNo(min=28,max=35){

                    // find diff
                    let difference = max - min;
                
                    // generate random number 
                    let rand = Math.random();
                
                    // multiply with difference 
                    rand = Math.floor( rand * difference);
                
                    // add with min value 
                    rand = rand + min;
    
                    return rand;
                }  
                const temp=genRandomNo(); 
                res.send("<h3>temprature in "+cName+" is :"+temp+" </h3> ")
            }
            else if(curTime<18){
                function genRandomNo(min=22,max=28){

                    // find diff
                    let difference = max - min;
                
                    // generate random number 
                    let rand = Math.random();
                
                    // multiply with difference 
                    rand = Math.floor( rand * difference);
                
                    // add with min value 
                    rand = rand + min;
    
                    return rand;
                }   
                const temp=genRandomNo();
                res.send("<h3>temprature in "+cName+" is :"+temp+" </h3> ")

            }
            else{
                function genRandomNo(min=18,max=22){

                    // find diff
                    let difference = max - min;
                
                    // generate random number 
                    let rand = Math.random();
                
                    // multiply with difference 
                    rand = Math.floor( rand * difference);
                
                    // add with min value 
                    rand = rand + min;
    
                    return rand;
                }   
                const temp=genRandomNo();
                res.send("<h3>temprature in "+cName+" is :"+temp+" </h3> ")
            }   
        }
    else{
        res.send("<h3>We dont have a data of this city </h3>");
    }
})


app.listen(9000,()=>{
    console.log("server started...")
})


