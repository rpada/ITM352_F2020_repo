var express = require('express');
var app = express();
var myParser = require("body-parser");
var session = require('express-session');
var products_data = require('./products.json');
var nodemailer = require('nodemailer');
var fs = require('fs'); //Load file system//
var filename = 'user_data.json'; // new//

app.use(myParser.urlencoded({ extended: true }));
app.use(session({secret: "ITM352 rocks!",resave: false, saveUninitialized: true}));

// Read user data file.
if (fs.existsSync(filename)) {
    data = fs.readFileSync(filename, 'utf-8');
    //console.log("Success! We got: " + data);
  
    user_data = JSON.parse(data);
    console.log("User_data=", user_data.itm352.password);
  } else {
    console.log("Sorry can't read file " + fs);
    exit();
  }

app.all('*', function (request, response, next) {
  // need to initialize an object to store the cart in the session. We do it when there is any request so that we don't have to check it exists
  // anytime it's used
  if (typeof request.session.cart == 'undefined') { request.session.cart = {}; }
  request.session.save();
  next();
});

app.get("/get_products_data", function (request, response) {
  response.json(products_data);
});

app.get("/add_to_cart", function (request, response) {
  var products_key = request.query['products_key']; // get the product key sent from the form post
  var quantities = request.query['quantities'].map(Number); // Get quantities from the form post and convert strings from form post to numbers
  request.session.cart[products_key] = quantities; // store the quantities array in the session cart object with the same products_key. 
  response.redirect('./cart.html');
});

app.get("/get_cart", function (request, response) {
  response.json(request.session.cart);
});

app.get("/checkout", function (request, response) {
  var user_email = request.query.email; // email address in querystring
// Generate HTML invoice string
  var invoice_str = `Thank you for your order ${user_email}!<table border><th>Quantity</th><th>Item</th>`;
  var shopping_cart = request.session.cart;
  for(product_key in products_data) {
    for(i=0; i<products_data[product_key].length; i++) {
        if(typeof shopping_cart[product_key] == 'undefined') continue;
        qty = shopping_cart[product_key][i];
        if(qty > 0) {
          invoice_str += `<tr><td>${qty}</td><td>${products_data[product_key][i].name}</td><tr>`;
        }
    }
}
  invoice_str += '</table>';
// Set up mail server. Only will work on UH Network due to security restrictions
  var transporter = nodemailer.createTransport({
    host: "mail.hawaii.edu",
    port: 25,
    secure: false, // use TLS
    tls: {
      // do not fail on invalid certs
      rejectUnauthorized: false
    }
  });

  var mailOptions = {
    from: 'phoney_store@bogus.com',
    to: user_email,
    subject: 'Your phoney invoice',
    html: invoice_str
  };

  transporter.sendMail(mailOptions, function(error, info){
    if (error) {
      invoice_str += '<br>There was an error and your invoice could not be emailed :(';
    } else {
      invoice_str += `<br>Your invoice was mailed to ${user_email}`;
    }
    response.send(invoice_str);
  });
 
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
   

app.use(express.static('./public'));
app.listen(8080, () => console.log(`listening on port 8080`));