var express = require('express');
var app = express();
var products_data = require('./products.json');
var cookieParser = require('cookie-parser');
const queryString = require("querystring");
var myParser = require("body-parser");
var session = require('express-session');
var fs = require('fs');
const { products } = require('../Pada_Rianne_Assignment_3/public/products');
var filename = 'user_data.json';


app.post("/get_products_data", function (request, response) {
    response.json(products_data);
});

app.use(cookieParser());
app.get("/login", function (request, response) {
response.cookie('username', 'dport', {maxAge: 60 * 1000}).send('cookie sent!')
});
app.get("/logout", function (request, response) {
    username = request.cookies;
    response.clearCookie('username').send('logged out ${username}');
    });
        app.get("/get_products_data", function (request, response) {
        response.json(products_data);
    });

    app.use(myParser.urlencoded({ extended: true }));
    app.use(session({secret: "ITM352 rocks!"}));
    
    app.all('*', function (request, response, next) {
        // need to initialize an object to store the cart in the session. We do it when there is any request so that we don't have to check it exists
        // anytime it's used
        if(typeof request.session.cart == 'undefined') { request.session.cart = {}; } 
        next();
    });
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
  for (i = 0; i < products_data.length; i++) { // For loop to check each quantity 
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
        // Generate HTML invoice string
          var invoice_str = `Thank you for your order!<table border><th>Quantity</th><th>Item</th>`;
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
        
          var user_email = 'phoney@mt2015.com';
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

app.use(express.static('./public'));
app.listen(8080, () => console.log(`listening on port 8080`));