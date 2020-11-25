
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

// REFERENCED FROM RICK KAZMAN + LAB 14
app.post("/register_form", function (req, res) {
    qstr = req.body
    console.log(qstr);
    var errors = [];
    varusername = req.body.username;
// DATA VALIDATION REFERENCED FROM LANDON BARSATAN AND ALYSSA MENCEL
    if (/^[A-Za-z]+$/.test(req.body.name)) { 
    }
    else {
      errors.push('Use Only Letters for Full Name')
    }
    // validating that it is a Full Name
    if (req.body.name == "") {
      errors.push('Invalid Full Name');
    }
     // length of full name is less than 30
     if ((req.body.fullname.length > 30)) {
      errors.push('Full Name Too Long')
    }
    // length of full name is between 0 and 25 
  if ((req.body.fullname.size > 25 && req.body.fullname.length <0)) {
    errors.push('Full Name Too Long')
  }
  //checks the new username in all lowercase against the record of usernames
    var reguser = req.body.username.toLowerCase(); 
    if (typeof users_reg_data[reguser] != 'undefined') { //if username is not undefined gives an error that the username is taken
      errors.push('Username taken')
    } 
    if ((req.body.username.length > 10)) {
      errors.push('Username Too Long')
    }
    if ((req.body.username.length < 4)) {
      errors.push('Username Too Short')
    }
    //requires that the username only be letters and numbers 
    if (/^[0-9a-zA-Z]+$/.test(req.body.username)) {
    }
    else {
      errors.push('Letters And Numbers Only for Username')
    }
    //password is min 6 characters long 
    if (req.body.password.length < 6) {
      errors.push('Password Too Short')
    }
    // check to see if the two passwords match
    if (req.body.password !== req.body.repeat_password) { 
      errors.push('Password Not a Match')
    }
    
    if (errors.length == 0) {
      POST = req.body
      console.log('no errors')
      var username = POST['username']
      users_reg_data[username] = {}; 
      users_reg_data[username].name = username;
      users_reg_data[username].password= POST['password'];
      users_reg_data[username].email = POST['email'];
      data = JSON.stringify(users_reg_data); 
      fs.writeFileSync(filename, data, "utf-8");
      res.redirect('./invoice.html?' + queryString.stringify(req.query));
    }
    //of there are errors log them in the console and direct user again to the register page
    if (errors.length > 0) {
        console.log(errors)
        req.query.name = req.body.name;
        req.query.username = req.body.username;
        req.query.password = req.body.password;
        req.query.repeat_password = req.body.repeat_password;
        req.query.email = req.body.email;

        req.query.errors = errors.join(';');
        res.redirect('register.html?' + queryString.stringify(req.query));
    }
});
app.use(express.static('./public'));
app.listen(8080, () => console.log(`listening on port 8080`));