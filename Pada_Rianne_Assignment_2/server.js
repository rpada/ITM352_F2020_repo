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
if (fs.existsSync(filename)) {
    userid = fs.readFileSync(filename, 'utf-8');

    users_reg_data = JSON.parse(userid); //  Takes a string and converts it into object or array

    console.log(users_reg_data);
} else {
    console.log(filename + ' does not exist!');
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
app.post("/register_form", function (req, res) {
    qstr = req.body
    console.log(qstr);
    var errors = [];
    // VALIDATION REFERENCED FROM ALYSSA MENCEL
   
    fullname = req.body.fullname; // full name is only letters
    if ((/[a-zA-Z]+[ ]+[a-zA-Z]+/).test(req.body.fullname) == false) {
       errors.push ("Only use letters and a space for fullname");
    }
    if ((fullname.length > 30) == true) { // full name cannot be more than 30 characters
       errors.push("Please make your full name shorter. 30 characters max"); 
    }

    var reguser = req.body.username.toLowerCase(); // case insensitive, checks in lowercase
    if (typeof users_reg_data[reguser] != 'undefined') { // username is not undefined meaning it exists, so user cannot register with it
      errors.push('Username taken')
    }
    
    if (/^[0-9a-zA-Z]+$/.test(req.body.username)) {
    }
    else { // username cannot have any space characters
      errors.push('Letters And Numbers Only for Username')
    }
    if ((req.body.username.length > 10)) {
        errors.push('Username Too Long') // username cannot be more than 10 characters
      }
    if ((req.body.username.length < 4)) {
        errors.push('Username Too Short') // username cannot be less than 4 characters
      }

    if (req.body.password.length < 6) {
      errors.push('Password Too Short') // password has to be less than 6 characters
    }
    
    if (req.body.password !== req.body.repeat_password) { 
      errors.push('Password Not a Match') // passwords must match
    }
    if ((/[a-z0-9._]+@[a-z0-9]+\.[a-z]+/).test(req.body.email) == false) {
        errors.push ("Please enter proper email") // email has to be correct format
     }  
    if (errors.length == 0) { // errors equals zero
      POST = req.body
      console.log('no errors') // shows in console
      var username = POST['username']
      users_reg_data[username] = {}; 
      users_reg_data[username].name = username; // no errors? go to invoice form with query
      users_reg_data[username].password= POST['password'];
      users_reg_data[username].email = POST['email'];
      fs.writeFileSync(filename, data, "utf-8");
      res.redirect('./invoice.html?' + queryString.stringify(req.query));
    }
    if (errors.length > 0) {
        console.log(errors) // setting variables for query vs body
        req.query.fullname = req.body.fullname;
        req.query.username = req.body.username;
        req.query.password = req.body.password;
        req.query.repeat_password = req.body.repeat_password;
        req.query.email = req.body.email;

        req.query.errors = errors.join(';'); // if errors, exist, redirect to register page and have them try again.
        res.redirect('register.html?' + queryString.stringify(req.query));
    }
});
app.use(express.static('./public')); //looks for files in public
app.listen(8080, () => console.log(`listening on port 8080`)); // shows in console so user knows it works