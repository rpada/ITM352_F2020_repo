
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
const { request, response } = require('express');
var sticker_qty = {}

var app = express();
app.all('*', function (request, response, next) {
    console.log(request.method + ' to ' + request.path);
    next();
});

app.use(myParser.urlencoded({ extended: true })); // Server-side processing

// REFERENCED FROM DANIEL PORT LAB 14
// Checks if JSON string already exists
if (fs.existsSync(filename)) {
    userid = fs.readFileSync(filename, 'utf-8');

    users_reg_data = JSON.parse(userid); //  Takes a string and converts it into object or array
// creating the users_reg_data variable
    console.log(users_reg_data); // writing the data into the console to see what's being read
} else {
    console.log(filename + ' does not exist!'); // if the filename doesn't exist, the error is shown in the console
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
// REFERENCED FROM RICK KAZMAN, LAB 14 EXAMPLE
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

// SERVER REFERENCED FROM RICK KAZMAN + LAB 14
// VALIDATION REFERENCED FROM LANDON BARSATAN
app.post("/register_form", function (request, response) {
    // process a simple register form
    console.log(sticker_qty);
    sticker_qty = request.query
    // does the username already exist?
    username = request.body.username; 
    errors = {}; 
    // VALIDATING USERNAME
    if (typeof users_reg_data[username] != 'undefined') { // looks for username in the JSON array
       errors.username_error = "Username is Already in Use"; 
    }
    if ((/[a-z0-9]+/).test(request.body.username) == false) { //space characters for username. letters/numbers only
       errors.username_error = "Only numbers/letters";
    }
    if ((username.length > 10) == true) {
       errors.username_error = "Please make your username shorter"; //username can't be more than 10 characters
    }
    if ((username.length < 4) == true) {
       errors.username_error = "Please make your username longer"; //username can't be less than 4 characters
    }
    //VALIDATING FULL NAME 
    fullname = request.body.fullname;
    if ((/[a-zA-Z]+[ ]+[a-zA-Z]+/).test(request.body.fullname) == false) { // full name cannot have numbersß
       errors.fullname_error = "Only use letters and a space for your full name";
    }
    if ((fullname.length > 30) == true) {
       errors.fullname_error = "Please make your full name shorter. 30 characters max"; 
       //your full name cannot be over 30 characters
    }
    // PASSWORD VALIDATION
    if (request.body.password.length < 6) { // password has to be at least 6 characters
        errors.password_error ='Password Too Short'
      }
  
      if (request.body.password !== request.body.repeat_password) { // passwords have to match!
        errors.password_error ='Password Not a Match'
      }
      
      if ((/[a-z0-9._]+@[a-z0-9]+\.[a-z]+/).test(request.body.email) == false) {
       errors.email_error = "Please enter proper email"; // email must be the correct format
    }
    console.log(errors, users_reg_data);
    if (Object.keys(errors).length == 0) { // if no errors exists, send to invoice
       users_reg_data[username] = {};
       users_reg_data[username].username = request.body.username
       users_reg_data[username].password = request.body.password;
       users_reg_data[username].email = request.body.email;
       users_reg_data[username].fullname = request.body.fullname;
       fs.writeFileSync(filename, JSON.stringify(users_reg_data)); // the data received from registration put into the JSON format
       theQuantQuerystring = querystring.stringify(request.query); // quantity values from index turn into string
       response.redirect("/invoice.html?" + theQuantQuerystring + `&username=${username}`); // when everything is good, go to invoice with quantity data
    } else {
       qstring = querystring.stringify(request.query) + "&" + querystring.stringify(errors);
       response.redirect('/register.html?' + qstring); // incorrect stuff? page is reloaded. error messages appear
    }
 });
 
 app.all('*', function (request, response, next) {
    console.log(request.method + ' to ' + request.path); 
    next(); 
 });
 app.use(express.static('./public')); //looks into public folder for files
 app.listen(8080, () => console.log(`listening on port 8080`)); //writes in console so you can tell it's working
