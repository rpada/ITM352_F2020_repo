//Creating a server via express//
var data = require('./public/product_data.js'); //get the data from product_data.js
var products = data.products;

// So it'll load querystring// 
const querystring = require('querystring');
const queryString = require('query-string'); // so it'll load querystring// 
var filename = 'user_data.json'; // new//
var fs = require('fs'); //Load file system//
var express = require('express'); //Server requires express to run//
var app = express(); //Run the express function and start express//
var myParser = require("body-parser");
var cookieParser = require('cookie-parser'); //don't forget to install//
var nodemailer = require('nodemailer');
var path = require('path');
app.use(cookieParser());

var session = require('express-session');
 //don't forget to install//
 app.use(cookieParser());
 app.use(session({ secret: "ITM352 rocks!", saveUninitialized: false, resave: false })); 
 
 app.use(myParser.urlencoded({ extended: true }));

// Read user data file.
if (fs.existsSync(filename)) {
  data = fs.readFileSync(filename, 'utf-8');
  //console.log("Success! We got: " + data);

  user_data = JSON.parse(data);
  console.log("User_data=", user_data.itm352.password);
} else {
  console.log("Sorry can't read file " + filename);
  exit();
}
// REFERENCED FROM W3 SCHOOLS 
var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'riannepitm352@gmail.com', // i created a BURNER email account to send out emails for this assignment. i did not use my real personal account for security reasons.
    pass: 'fakeluv498'
  }
});

var mailOptions = {
  from: 'rilorie@gmail.com',
  to: 'warmwaffles123@gmail.com',
  subject: 'Sending Email using Node.js',
  text: 'That was easy!'
};

transporter.sendMail(mailOptions, function(error, info){
  if (error) {
    console.log(error);
  } else {
    console.log('Email sent: ' + info.response);
  }
});
// Go to invoice if quantity values are good, if not redirect back to order page//
//new//
// means any path //
app.all('*', function (request, response, next) {
    console.log(request.method + ' to ' + request.path)
    next();
});
// Gennerates each page where there is a product
app.get("*/:ptype[.]html", function (request, response, next) {
  if (typeof products[request.params.ptype] == 'undefined')
  {
    next();
    return;
  }
  // Referenced from professor Port // 
  str = '{}'; 
  if( typeof request.session[request.params.ptype] != 'undefined') {
    str = JSON.stringify(request.session[request.params.ptype]);
  }
  //Used template to load pages from the server, from professor 
   var pagestring = fs.readFileSync('./displayproducts.html', 'utf-8'); 
   pagestring = `<script> var cart = ${str}; </script>` + pagestring; //so the cart shows in the console
   pagestring = `<script> var product_type = '${request.params.ptype}'; </script>` + pagestring;
   response.send(pagestring);
});
app.get("/set_cookie", function (request, response) {
  // Set a cookie called myname to be my name
  response.cookie('myname', 'Rianne Pada', { maxAge: 10000 }).send('cookie set');
});
// Using the cookie that was set in /set_cookie
app.get("/use_cookie", function (request, response) {
  // Use the cookie, if it has been set
  output = "No myname cookie found";
  if (typeof request.cookies.myname != 'undefined') {
      output = `Welcome to the Use Cookie page ${request.cookies.myname}`;
  }
  response.send(output);
});

// Simple example of printing out a session ID
app.get("/use_session", function (request, response) {
  // Print the value of the session ID
  response.send(`Welcome.  Your session ID is: ${request.session.id}`);
});

// Simple example of destroying a session 
app.get("/destroy_session", function (request, response) {
  // Print the value of the session ID
  request.session.destroy();
  response.send("Session nuked!");
});
// Create simple registration form
// Simple example of how sessions can store data between requests


function isNonNegInt(q, returnErrors = false) {
  errors = []; // assume that quantity data is valid 
  if (q == "") { q = 0; } //handle black inputs as if they are 0 
  if (Number(q) != q) errors.push('Not a number!'); //check if value is a number
  if (q < 0) errors.push('Negative value!'); //check if value is a positive number
  if (parseInt(q) != q) errors.push('Not an integer!'); //check if value is a whole number
  return returnErrors ? errors : (errors.length == 0);
}

app.use(myParser.urlencoded({ extended: true })); //get data in the body//
//process the quantity_form when POST request is made
app.post("/process_form", function (request, response) { 
  let POST = request.body; // data is in the body 

  if (typeof POST['addProducts${i}'] != 'undefined') { //if the POST request is defined
      var validAmount = true; //make the variable validAmount true 
      var amount = false; //make the variable amount equal to false 

      for (i = 0; i <  products[product_type].length; i++) { //for any product
          qty = POST[`quantity_textbox${i}`]; //sets the variable qty to quantity textbox 

          if (qty > 0) {
              amount = true; //if greater than 0 it is goog 
          }

          if (isNonNegInt(qty) == false) { //if isNonNegInt is false then it is not a number
              validAmount = false; // it is not a valid amount
          }

      }

      const stringified = queryString.stringify(POST); //converts data from POST to JSON string 

      if (validAmount && amount) { //if it is a quanity and greater than 0
          response.redirect("./login.html?" + stringified); // redirect the page to login page if not logged in 
          return; //stops function
      }

      else { response.redirect("./index.html?" + stringified) } //if there is invalid sends back to home page with the string 

  }

});
// Allows us to load in the cart page , reference from professor
app.get("/cart.html", function (request, response) {
  cartfile = `<script> var cart = ${JSON.stringify(request.session)}</script>`;
  cartfile += fs.readFileSync('./public/cart.html', 'utf-8'); // add it onto the cart page which is in public
  response.send(cartfile);

});
app.get("/invoice.html", function (request, response) {
  invoicefile = `<script> var cart = ${JSON.stringify(request.session)}</script>`;
  invoicefile += fs.readFileSync('./public/invoice.html', 'utf-8'); // add it onto the cart page which is in public
  response.send(invoicefile);

});


// login stuff starts here , reference from lab15// 
// REFERENCED FROM RICK KAZMAN, LAB 14 EXAMPLE 
app.get("/login", function (request, response) {
 // send the login.view
 error = {};
error.password = "";
error.username = "";
 loginfile = fs.readFileSync('./login.view', 'utf-8');
 response.send(eval('`'+loginfile +'`'));
});

// DANIEL PORT HELPED ME WITH THIS
app.get("/logout", function (request, response) {
 // expire the cookie and send to home page
  response.clearCookie('username');
  response.redirect('./index.html');
 });


// Handle the login form information, including session the session variables for username and last_login
app.post("/process_login", function (request, response) {
  // First save the request and, in particular, the username and password
  POST = request.body;
  user_name_from_form = POST["username"];
  password_from_form = POST["password"];
  // console.log("User name from form=" + user_name_from_form);
  error = {};
error.password = "";
error.username = "";
  // Now check to see if the username and password match what is on file
  if (user_data[user_name_from_form] != undefined) {
      password_on_file = user_data[user_name_from_form].password;
      if (password_from_form == password_on_file) {
          // Good login
          request.session.username = user_name_from_form;
          if (typeof request.session.last_login != 'undefined') {
              var msg = `You last logged in at ${request.session.last_login}`;
              var now = new Date();
          } else {
              var msg = '';
              var now = 'first visit!';
          }
          request.session.last_login = now;
          // send the user a cookie with the username to show that they're logged in
          response.cookie('username', user_name_from_form); 
          response.redirect('./index.html');
          return;
      } else { // oops password doesn't match
      error.password = 'Password does not match';
      }
  } else { // oops username doesnt exist
    error.username = 'Username does not exist';
  }
  // have an error, send them back to login
  loginfile = fs.readFileSync('./login.view', 'utf-8');
  response.send(eval('`'+loginfile +'`'));
});


//Registration starts here//
// Create simple registration form
app.get("/register", function (request, response) {
  // send the login.view
  error = {};
 error.password = "";
 error.username = "";
  loginfile = fs.readFileSync('./public/index.html', 'utf-8');
  response.send(eval('`'+loginfile +'`'));
 });

// Print invoice only if the user is logged in
app.get("/invoice", function (request, response) {
  if (typeof request.session.username != 'undefined') {
      response.redirect("./invoice?");
  } else {
      response.send("Login first bozo!");
  }
});

// Process the user registration information and save it in the user data file
app.post("/register", function (request, response) {
  // process a simple register form
  POST = request.body;
  console.log("Got register POST");
  if (POST["username"] != undefined && POST['password'] != undefined) {          // Validate user input
      username = POST["username"];
      user_data[username] = {};
      user_data[username].name = username;
      user_data[username].password = POST['password'];
      user_data[username].email = POST['email'];

      data = JSON.stringify(user_data);
      fs.writeFileSync(filename, data, "utf-8");

      response.send("User " + username + " logged in");
  }
});


// You're still on the products page
app.post("/process_cart", function (request, response) {
  let POST = request.body; // data would be packaged in the body//
  let product_type = POST["product_type"];
console.log(POST);
  if (typeof POST['submitcart'] != 'undefined') {
      var hasvalidquantities=true; // creating a varibale assuming that it'll be true// 
      var hasquantities=false // creating a variable hasquantities and assuming it will be false
      for (i = 0; i < products[product_type].length; i++) {
          
                      qty=POST[`quantity${i}`]; // set variable 'qty' to the value in quantity
                      hasquantities=hasquantities || qty>0; // If it has a value bigger than 0 then it is good//
                      hasvalidquantities=hasvalidquantities && isNonNegInt(qty);    // if it is both a quantity over 0 and is valid//     
      } 
      // if all quantities are valid, generate the invoice// 
      const stringified = queryString.stringify(POST); // converts the data in the POST to a JSON string and sets it to the variable 'stringified'
      if (hasvalidquantities && hasquantities) { // if it is both a quantity over 0 and is valid 
        // add the selectiond to the session// 
        request.session[product_type] = POST; 
        console.log(request.session);
          response.redirect("./cartconfirmation.html?"+stringified); // should redirect you to the next page with the data inside it//
      }  
      else {
        response.redirect("./all.html?"+stringified);} // To let them know if wasn't a valid quantity
  
  }
});

// You're still on the products page
app.post("/confirm_purchase", function (request, response) {
  let POST = request.body; // data would be packaged in the body//
  let product_type = POST["product_type"];
console.log(POST);
  if (typeof POST['completePurchase'] != 'undefined') {
      var hasvalidquantities=true; // creating a varibale assuming that it'll be true// 
      var hasquantities=false // creating a variable hasquantities and assuming it will be false
      for (i = 0; i < products[product_type].length; i++) {
          
                      qty=POST[`quantity${i}`]; // set variable 'qty' to the value in quantity
                      hasquantities=hasquantities || qty>0; // If it has a value bigger than 0 then it is good//
                      hasvalidquantities=hasvalidquantities && isNonNegInt(qty);    // if it is both a quantity over 0 and is valid//     
      } 
      // if all quantities are valid, generate the invoice// 
      const stringified = queryString.stringify(POST); // converts the data in the POST to a JSON string and sets it to the variable 'stringified'
      if (hasvalidquantities && hasquantities) { // if it is both a quantity over 0 and is valid 
        // add the selectiond to the session// 
        request.session[product_type] = POST; 
        console.log(request.session);
          response.redirect("./invoice.html?"+stringified); // should redirect you to the next page with the data inside it//
      }  
      else {
        response.redirect("./all.html?"+stringified);} // To let them know if wasn't a valid quantity
  
  }
  
});
app.post("/send_address", function (request, response) {
  let POST = request.body;
  var stringified = querystring.stringify(POST); //stringify the the post data 
  response.redirect("./invoice?"+stringified);
});

app.post("/purchaseCart", function (request, response) {
  let POST = request.body;
  cart_quantities = POST;
  q = POST["cartquantity"];
  if (session.username != undefined) {
      response.send(eval('`' + invoice_contents + '`'));
  } else {
      response.redirect('login.html');
  }
})

app.use(express.static('./public')); //Creates a static server using express from the public folder
app.listen(8080, () => console.log(`listen on port 8080`))
