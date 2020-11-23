// Rianne Pada
// Server that hosts my e-commerce site
// Some code is taken from examples made by Rick Kazman, found at https://github.com/rnkazman/ITM352_F2020/tree/master/Lab14
var express = require('express');
var myParser = require("body-parser");
var fs = require('fs');
var data = require('./public/products.js');
var products = data.products;
const queryString = require("querystring");
var filename = 'user_data.json';
var querystring = require("querystring");
const { request } = require('express');

var app = express();
app.all('*', function (request, response, next) {
    console.log(request.method + ' to ' + request.path);
    next();
});

app.use(myParser.urlencoded({ extended: true })); // Server-side processing

// REFERENCED FROM DANIEL PORT LAB 14
// Checks if JSON string already exists
if (fs.existsSync(filename)) { //enuring that the variable filename exists
    stats = fs.statSync(filename) //gets the information from user_data.json
    console.log(filename + 'has' + stats.size + 'characters'); //recording the amount of characters in the console 
  
    data = fs.readFileSync(filename, 'utf-8');
    users_reg_data = JSON.parse(data);
  } else { 
    console.log(filename + 'does not exist!'); //if filename doesn't exist showing it in the server
  }
// Taken from Lab 14
// Function used to check for valid quantities
function isNonNegInt(q, returnErrors = false) {
    error = ''; //  assume no errors at first
    if (q == "") q = 0; //  Adds a 0 if no values are added
    if (Number(q) != q) error = 'Not a number!'; //  Check if string is a number value
    if (q < 0) error = 'Negative value!'; //  Check if it is non-negative
    if (parseInt(q) != q) error = 'Not an integer!'; //  Check that it is an integer
    return returnErrors ? error : (error.length == 0); //  Returns any errors
}
// REFERENCED FROM LAB 14/ ASSIGNMENT 1 SCREENCAST EXAMPLE, DANIEL PORT
app.post("/process_form", function (request, response) {
    let POST = request.body;
    console.log(POST); // Checks in console
    var hasValidQuantities = true; // Defines hasValidQuantities as true from the start
    var hasPurchases = false; // Defines hasPurhchases as false from the start
    for (i = 0; i < products.length; i++) { // For loop to check each quantity 
        q = POST['quantity' + i]; // Defines q as each variable in the array
        if (isNonNegInt(q) == false) { // If the quantity is an invalid integer
            hasValidQuantities = false; // hasValidQuantities is false
        }
        if (q > 0) { // If quantity enter is greater than 0
            hasPurchases = true; // hasPurchases is true
        }
    }
    // If data is valid give user an invoice, if not give them an error
    var qString = queryString.stringify(POST); // Strings query together
    console.log(qString); // Checks in console
    if (hasValidQuantities == true && hasPurchases == true) { // If both are valid
        response.redirect('./login.html?' + qString); // Send to login page with query
    }
    else {
        response.redirect("./index.html?" + qString); // Send back to products page with query
    }
});
// REFERENCED FROM RICK KAZMAN, LAB 14 EXAMPLE + ALYSSA MENCEL
app.post("/login_form", function (req, res) {
    var LogError = [];
    console.log(req.query);
    the_username = req.body.username.toLowerCase(); 
    if (typeof users_reg_data[the_username] != 'undefined') { // if the password/username is not undefined, ie it's correct
        if (users_reg_data[the_username].password == req.body.password) {
            req.query.username = the_username; 
            console.log(users_reg_data[req.query.username].name);
            req.query.name = users_reg_data[req.query.username].name
            res.redirect('/invoice.html?' + queryString.stringify(req.query)); // then send them to the invoice with the quantity data
            return;  
        } else { 
            LogError.push = ('Invalid Password'); //seen in console
            console.log(LogError); // LogError variable is used in the login.html code too, which is where the alert message is shown
            req.query.username= the_username;
            req.query.name= users_reg_data[the_username].name;
            req.query.LogError=LogError.join(';');
        }
        } else { 
            LogError.push = ('Invalid Username'); //seen in console
            console.log(LogError); // error shows if the username is wrong too
            req.query.username= the_username;
            req.query.LogError=LogError.join(';');
        }
    res.redirect('./login.html?' + queryString.stringify(req.query)); // if there's an error don't go to invoice, stay at login.html
  });
  
// REFERENCED FROM RICK KAZMAN + LAB 14
app.post("/register_form", function (request, response) {
    qstr = request.body
    console.log(qstr);
    username = request.body.username;
    var errors = []; 
    // REGISTRATION VALIDATION DONE WITH HELP FROM LANDON BARSATAN
    // validating username
    if (typeof users_reg_data[username] != 'undefined') {
       errors.push ("Username is Already in Use"); //if the username exists in the array, user cannot register with it
    }
    username = request.body.username;
    if ((/^[0-9a-zA-Z]+$/).test(request.body.username) == false) {
     // no space characters for username
       errors.push ("Only numbers/letters for username");
    }
    if ((username.length > 10) == true) {
       errors.push ("Please make your username shorter"); //username cannot be longer than 10 characters
    }
    if ((username.length < 4) == true) {
       errors.push ("Please make your username longer"); //username cannot be less than 4 characters
    }
    // validating fullname
    fullname = request.body.fullname; // setting fullname variable
    if ((/[a-zA-Z]+[ ]+[a-zA-Z]+/).test(request.body.fullname) == false) {
       errors.push ("Only use letters and a space for full name"); // no numbers for full name, because who has numbers in their legal name anyways? 
    }
    if ((fullname.length > 30) == true) {
       errors.push ("Please make your full name shorter. 30 characters max"); // full name cannot be over 30 characters
    }
    // validating email
    if ((/[a-z0-9._]+@[a-z0-9]+\.[a-z]+/).test(request.body.email) == false) {
       errors.push ("Please enter proper email");
    // validating password
    }  if (request.body.password.length < 6) {
        errors.push('Password Too Short') // password has to be at least 6 characters
      }
      
      if (request.body.password !== request.body.repeat_password) { 
        errors.push('Password Not a Match') // repeating password must be the same as the original password
      }
 
    console.log(errors, users_reg_data);
    if (Object.keys(errors).length == 0) { // no errors, then
       users_reg_data[username] = {}; // send registration information/variables
       users_reg_data[username].username = request.body.username
       users_reg_data[username].password = request.body.password;
       users_reg_data[username].email = request.body.email;
       users_reg_data[username].fullname = request.body.fullname;
       
       data = JSON.stringify(users_reg_data); // setting data variable
       fs.writeFileSync(filename, data, "utf-8");
       response.redirect('./invoice.html?' + queryString.stringify(request.query)+`&username=${username}`); // all things good to go? go to invoice with username and data
    } else {
        request.query.errors = errors.join(';');
        response.redirect('./register.html?' + queryString.stringify(request.query)); // errors? stay on registration page and show errors
    }
 });
 
 app.all('*', function (request, response, next) {
    console.log(request.method + ' to ' + request.path); 
    next(); 
 });
 app.use(express.static('./public')); // looks for files in public
 app.listen(8080, () => console.log(`listening on port 8080`)); // shows in console so you know the server works