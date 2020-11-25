// server page

// Referenced code from Assignment 1, Lab 13, and Lab 14. As well as StackExchange and W3Schools  

// Define all necessary tools and variables
const querystring = require('querystring'); 
var express = require('express'); 
var myParser = require("body-parser"); 
var products = require("./public/product.js"); 
var filename = 'user_data.json' 
var app = express(); 
var qs = require('querystring'); 
var qstr = {}; 
var sticker_qty = {};

app.use(myParser.urlencoded({ extended: true }));
//intercept purchase submission form, if good give an invoice, otherwise send back to order page
app.post("/process_form", function (request, response) {
   //look up request.query
   sticker_qty = request.query;
   params = request.query;
   console.log(params);
   if (typeof params['purchase_submit'] != 'undefined') {  //check if quantity data is valid
      has_errors = false; // assume quantities are valid from the start
      total_qty = 0; // need to check if something was selected so we will look if the total > 0
      for (i = 0; i < products.length; i++) {
         if (typeof params[`quantity${i}`] != 'undefined') {
            a_qty = params[`quantity${i}`]; //makes textboxes sticky in case of invalid data
            total_qty += a_qty; //Adds up all quantities
            if (!isNonNegInt(a_qty)) {
               has_errors = true; // Invalid quantity
            }
         }
      }
      // Now respond to errors or redirect to invoice if all is ok
      qstr = querystring.stringify(request.query);
      //if quantity data is not valid, send them back to product display
      if (has_errors || total_qty == 0) {
         qstr = querystring.stringify(request.query);
         response.redirect("products_display.html?" + qstr);
      } else { // if quantity data is valid, send them to the invoice
         response.redirect("login.html?" + qstr);
      }
   }
});
//if quantity data valid, send them to the login page

//Ensures data inputted isn not a negative number, does not contain letters and is not a decimal
function isNonNegInt(q, returnErrors = false) {
   errors = []; // assume no errors at first
   if (q == "") { q = 0; } //handle blank inputs as if they are 0
   if (Number(q) != q) errors.push('Not a number!'); // Check if string is a number value
   if (q < 0) errors.push('Negative value!'); // Check if it is non-negative
   if (parseInt(q) != q) errors.push('Not an integer!'); // Check that it is an integer
   return returnErrors ? errors : (errors.length == 0); //returns as error
}

fs = require('fs'); 

//returns a boolean (true or false) (Opens file only if it exists)
if (fs.existsSync(filename)) {
   stats = fs.statSync(filename) //gets the stats of your file
   data = fs.readFileSync(filename, 'utf-8'); //Reads the file and returns back with data and then continues with code as requested.
   users_reg_data = JSON.parse(data); //Parses data in order to turn string into an object
}

// Process login form POST and redirect to invoice page if ok and back to login page if not
app.post("/login.html", function (request, response) {
   console.log(sticker_qty);
   the_username = request.body.username.toLowerCase(); //makes username case insensitive
   //Validate login data
   if (typeof users_reg_data[the_username] != 'undefined') {   //To check if the username exists in the json data
      if (users_reg_data[the_username].password == request.body.password) {
         theQuantQuerystring = qs.stringify(sticker_qty); //make the query string of prod quant needed for invoice
         response.redirect('/invoice.html?' + theQuantQuerystring + `&username=${the_username}`); //Adds username & quantity to invoice
      }
      else {
         response.send('Invalid Login: Please hit the back button and try again 1'); //if password isn't equal to password existing in jsonn data, show error message

      }
   } else {
      response.send('Invalid Login: Please hit the back button and try again 2');
   }
});

// Process registration form POST method and redirect to invoice page if ok or back to registration page if not
app.post("/registration.html", function (request, response) {
   // process a simple register form
   console.log(sticker_qty);
   username = request.body.username;//retrieves the username data
   errors = {}; //Checks to see if username already exists
   //Username Validation
   if (typeof users_reg_data[username] != 'undefined') {
      errors.username_error = "Username is Already in Use"; //if username is in json file, say username is already in use
   }
   if ((/[a-z0-9]+/).test(request.body.username) == false) { //only allows numbers and letters for the username
      errors.username_error = "Only numbers/letters";
   }
   if ((username.length > 10) == true) {
      errors.username_error = "Please make your username shorter"; //if length is more than 10, show error to make the username shorter
   }
   if ((username.length < 4) == true) {
      errors.username_error = "Please make your username longer"; //if length is less than 4, show error to make the username longer
   }
   //Fullname Validation 
   fullname = request.body.fullname;
   if ((/[a-zA-Z]+[ ]+[a-zA-Z]+/).test(request.body.fullname) == false) {
      errors.fullname_error = "Only use letters and a space";
   }
   if ((fullname.length > 30) == true) {
      errors.fullname_error = "Please make your full name shorter. 30 characters max"; //if length is greater than 30, send error that 30 characters are max
   }
   //Email Validation
   if ((/[a-z0-9._]+@[a-z0-9]+\.[a-z]+/).test(request.body.email) == false) {
      errors.email_error = "Please enter proper email";
   }

   console.log(errors, users_reg_data);
   //If there are 0 errors, request all registration info
   if (Object.keys(errors).length == 0) {
      users_reg_data[username] = {};
      users_reg_data[username].username = request.body.username
      users_reg_data[username].password = request.body.password;
      users_reg_data[username].email = request.body.email;
      users_reg_data[username].fullname = request.body.fullname;
      
      fs.writeFileSync(filename, JSON.stringify(users_reg_data)); //Writes registration info into the userdata json file
      theQuantQuerystring = qs.stringify(sticker_qty); //Turns quantity object into a string
      response.redirect("/invoice.html?" + theQuantQuerystring + `&username=${username}`); //If all things valid, redirect to the invoice page
   } else {
      qstring = qs.stringify(request.body) + "&" + qs.stringify(errors);
      response.redirect('/registration.html?' + qstring); //if there are errors, send back to registration page to retype
   }
});

app.all('*', function (request, response, next) {
   console.log(request.method + ' to ' + request.path); 
   next(); 
});
app.use(express.static('./public')); //sets up a request to respond to GET and looks for the file from public (sets up static web server)
app.listen(8080, () => console.log(`listening on port 8080`)); //listens on Port 8080