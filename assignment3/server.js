//Creating a server via express//
var data = require('./public/products.js'); //get the data from product_data.js
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

  var user_data = JSON.parse(data);
  console.log("User_data=", user_data.itm352.password);
} else {
  console.log("Sorry can't read file " + filename);
  exit();
}
// Go to invoice if quantity values are good, if not redirect back to order page//
//new//
// means any path //
app.all('*', function (request, response, next) {
    console.log(request.method + ' to ' + request.path)
    next();
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
            // response.cookie('email', user_data[user_name_from_form].email);
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
       

/*this is used to take info from cart.html
the server will generate the invoice and send email to user
then the invoice will be displayed in the page*/ 
app.post("/generateInvoice", function (request, response) {
    console.log(user_data, 'Generate Invoice');
    var user_email = user_data[request.cookies.username].email;
    cart = JSON.parse(request.query['cartData']); //this parses the cart 

   

    /*
    this creates a string of the invoice from cart.html
    this is what is emailed to the user
    used with help from previous invoice.html 
    */

    str = 
    `
    <!-- Center header on page -->


        <h3 align="center">Thank you for your purchase, <font color="#629DD1">${request.cookies.username}!</font><br />An email copy has been sent to <font color="#629DD1">${user_email}</font></h3>
    
        <!-- template taken from first invoice on assignment1 -->
        <section id="one" class="wrapper style1">
                <!--start of invoice table--> 
          <table>`;

            subtotal = 0; //subtotal starts off as 0
            for (product in products) {
                for (i = 0; i < products[product].length; i++) {

                    qty = cart[`${product}${i}`];
                    if (qty > 0) { //if a quantity is entered in the textbox 
                        extended_price = qty * products[product][i].price //equation for extended price
                        subtotal += extended_price; //adds each subtotatl to get the the extrended price 

                        str+=`
                        <tr>
                            <td style= "text-align: left" width="40%">${products[product][i].name}</td>
                            <td width="20%">${qty}</td>
                            <td width="20%">\$${products[product][i].price}</td>
                            <td  width="20%">\$${extended_price}</td>
                        </tr>
                    `;
                    }
                };
            }
            //compute tax information
            var tax_rate = 0.0471;
            var tax = tax_rate * subtotal; 
            // Compute shipping
            if (subtotal <= 50) {
                shipping = 2;
                }
             else if (subtotal <= 100) {
              shipping = 5;
            }
             else {
              shipping = 0.05 * subtotal; // 5% of subtotal
              }
            // Compute grand total
              var total = subtotal + tax + shipping;
            
              str+=`
              <tr>
              <td colspan="4" width="100%">&nbsp;</td>
            </tr>
            <tr>
              <td colspan="3" width="67%">Sub-total</td>
              <td width="54%">${subtotal.toFixed(2)}</td>
            </tr>
            <tr>
              <td  colspan="3" width="67%"><span>Tax at ${100*tax_rate}%</span></td>
              <td width="54%">${tax.toFixed(2)}</td>
            </tr>
            <tr>
                <td  colspan="3" width="67%">Shipping</span></td>
                <td width="54%">${shipping.toFixed(2)}</td>
              </tr>
            <tr>
              <td colspan="3" width="67%"><strong>Total</strong></td>
              <td width="54%"><strong>${total.toFixed(2)}</strong></td>
            </tr>
            <tr>
              <td style="text-align: center;" colspan="4"> <strong>OUR SHIPPING POLICY IS: A subtotal $0 - $49.99 will be $2 shipping
                A subtotal $50 - $99.99 will be $5 shipping
                Subtotals over $100 will be charged 5% of the subtotal amount</strong>
              </td>
          </tr>
      </tbody>
        </table> 
      </section>`;
                

  // REFERENCED FROM DANIEL PORT DISPLAY_AND_MAIL_INVOICE_EXAMPLE
    var transporter = nodemailer.createTransport({
        host: "mail.hawaii.edu", // hosting on UH server so emails can be sent to hawaii.edu
        port: 25,
        secure: false, // use TLS
        tls: {
          // do not fail on invalid certs
          rejectUnauthorized: false
        }
      });
    
    var mailOptions = {
        from: 'riannepitm352@gmail.com', //sends the invoice from my email. i made a burner email because i didn't want to use my personal one
        to: user_email, //sends the email to cookie from the account that was logged in
        subject: 'Invoice', // subject line telling customer what the email is about
        html: str //the string then returns as html 
    };
    //notification in console if errors in sending email or if it sent properly 
    transporter.sendMail(mailOptions, function (error, info) {
        if (error) { 
            console.log(error);
        } else { 
            console.log('Email sent: ' + info.response);
        }
    });

    response.send(str); // string goes to be displayed in browser
});

//Used with help from lab15 and stormpath.com 
app.use(session({ //
    secret: 'ITM352 Rocks!', //encrypts the session 
    resave: true, //saves the session
    saveUninitialized: false, //deletes or forgets session when it is done
    httpOnly: false, //doesnt allow access of cookies 
    secure: true, //only uses cookies in HTTPS
    ephemeral: true //this deletes this cookie when browser is closed 
}));
//process the quantity_form when POST request is made
app.post("/process_form", function (request, response) { 
    let POST = request.body; // data is in the body 

    if (typeof POST['addProducts${i}'] != 'undefined') { //if the POST request is defined
        var validAmount = true; //make the variable validAmount true 
        var amount = false; //make the variable amount equal to false 

        for (i = 0; i < `${(products_array[`type`][i])}`.length; i++) { //for any product
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

//repeats the isNonNegInt function
function isNonNegInt(q, return_errors = false) {
    errors = []; // assume no errors at first
    if (q == '') q = 0; // handle blank inputs as if they are 0
    if (Number(q) != q) errors.push('<font color="red">Not a number</font>'); // Check if string is a number value
    if (q < 0) errors.push('<font color="red">Negative number</font>'); // Check if it is non-negative
    if (parseInt(q) != q) errors.push('<font color="red">Not a full product</font>'); // Check that it is an integer
    return return_errors ? errors : (errors.length == 0);
}

//Made with help from Lab 14 Exercise 3
app.post("/check_login", function (request, response) {// Process login form from POST Request
    errs = {}; //assume no errors at first
    var login_username = request.body["username"]; //set var login_username to the username 
    var user_info = user_data[login_username]; //sets a variable
    var login_password = request.body["password"]; //sets a variable

    if (typeof user_data[login_username] == 'undefined' || user_data[login_username] == '') { // If the username is defined
        errs.username = '<font color="red">Incorrect Username</font>'; //If invalid usersername doesnt match 
        errs.password = '<font color="red">Incorrect Password</font>'; //If username does not match anything in json file, password cannot match username
    } else if (user_info['password'] != login_password) {
        errs.username = ''; //remove error
        errs.password = '<font color="red">Incorrect Password</font>'; //wrong password still
    } else {
        delete errs.username; //remove error
        delete errs.password; //remove error
    };

    if (Object.keys(errs).length == 0) { //If no errors exist 
        //Used with help from Lab15 Exercise4 
        session.username = login_username; //adds username to the session 
        var theDate = Date.now(); //adds the login time 
        session.last_login_time = theDate; //this login is saved in a session 
        var login_name = user_info['name']; //sets a variable 
        var user_email = user_info['email']; //sets a variable
        response.cookie('username', login_username) //puts the username in a cookie
        response.cookie('name', login_name) //puts the name in a cookie 
        response.cookie('email', user_email); //puts the email in a cookie 
        response.json({}); //parses it into a json object 
    } else {
        response.json(errs); //if fails it shows errors 
    };

});
app.get("/checkout", function (request, response) {
  var user_email = request.query.email; // email address in querystring
  var product = {};
// Generate HTML invoice string
  var invoice_str = `Thank you for your order ${user_email}!<table border><th>Quantity</th><th>Item</th>`;
  var shopping_cart = request.session.cart;
  for(product in products) {
    for(i=0; i<products[product][i].length; i++) {
        if(typeof shopping_cart[product] == 'undefined') continue;
        qty = shopping_cart[product][i];
        if(qty > 0) {
          invoice_str += `<tr><td>${qty}</td><td>${products[product][i].name}</td><tr>`;
        }
    }
}
  invoice_str += '</table>';
// Set up mail server. Only will work on UH Network due to security restrictions
  var transporter = nodemailer.createTransport({
    service: "gmail",
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
/*
the following two functions validate the information in the form 
made with help from w3resource.com 
*/ 
function ValidateEmail(inputText) {
    var mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/; //email can only contain letter, numbers, @ symbo 
    if (inputText.match(mailformat)) { //the input must match above requirements to be a valid email 
        return true; 
    }
    else {
        return false; //email is invalid 
    }
}


function isAlphaNumeric(input) {
    var letterNumber = /^[0-9a-zA-Z]+$/; //can only be variables or numbers 
    if (input.match(letterNumber)) { //the input must match above requirements 
        return true;
    }
    else { 
        return false; //it is invalid 
    }
}

//Made with help from Lab 14 Exercise 4
app.post("/register_user", function (request, response) {
    // processing a registration form 
    errs = {}; //assume no errors at first
    var registered_username = request.body["username"]; //set variable 
    var registered_name = request.body["name"]; //set variable 

    // this section is for the username  
    if (registered_username == '') { //username is required
        errs.username = '<font color="red">Please Enter A Username</font>';
    } else if (registered_username.length < 4 || registered_username.length > 10) { //the username has to be between 4 and 10 characters 
        errs.username = '<font color="red">Username Must Be Between 4 & 10 Characters</font>'; //error messgae if not 
    } else if (isAlphaNumeric(registered_username) == false) { //username can only be letters and numbers 
        errs.username = '<font color="red">Please Only Use Alphanumeric Characters</font>'; //error if not
    } else if (typeof user_data[registered_username] != "undefined") { //checks if username is taken
        errs.username = '<font color="red">Username Taken</font>'; //error if taken 
    } else {
        errs.username = null;
    }

    //this section is for the name 
    if (registered_name.length > 30) { //name has to be shorter than 30 
        errs.name = '<font color="red">Cannot Be Longer Than 30 Characters</font>';
    } else {
        errs.name = null;
    }
  ; // setting fullname variable
    if ((/[a-zA-Z]+[ ]+[a-zA-Z]+/).test(request.body.name) == false) {
       errs.name = '<font color="red">Only use letters and a space for full name</font>' // no numbers for full name, because who has numbers in their legal name anyways? 
    } else {
      errs.name = null;
    }

    //this section is for the password
    if (request.body.password.length == 0) { //requirement 
        errs.password = '<font color="red">Please Enter A Password</font>';
    } else if (request.body.password.length <= 5) { //password is at least 6 characters 
        errs.password = '<font color="red">Password Must Be At Least 6 Characters</font>';
    } else if (request["body"]["password"] != request["body"]["repeat_password"]) {//checks if repeat field is same
        errs.password = null;
        errs.repeat_password = '<font color="red">Passwords Do Not Match</font>'; //error if passwords don't match
    } else {
        delete errs.password;
        errs.repeat_password = null;
    }

    //this section is for the email
    if (request.body.email == '') { //requirement 
        errs.email = '<font color="red">Please Enter An Email Address</font>';
    } else if (ValidateEmail(request.body.email) == false) { //if does not follow proper email format, give error
        errs.email = '<font color="red">Please Enter A Valid Email Address</font>';
    } else {
        errs.email = null;
    }

    //Made with help from stackoverflow.com 
    let result = !Object.values(errs).every(o => o === null); 
    console.log(result); 

    if (result == false) { //when there are no errors 
        //sets the below to what the user entered 
        user_data[registered_username] = {}; 
        user_data[registered_username].name = request.body.name; 
        user_data[registered_username].password = request.body.password; 
        user_data[registered_username].email = request.body.email; 
        fs.writeFileSync(filename, JSON.stringify(user_data, null, 2));
        response.cookie("username", registered_username); 
        response.cookie("name", registered_name); 
        response.cookie("email", request.body.email); 
        response.json({}); 
    } else {
        response.json(errs); 
    }

});

app.post('/logout', function (request, response) { 
    request.session.reset(); 
    response.redirect('/index.html'); 
});

app.use(express.static('./public')); //everythin is in the public directory 
app.listen(8080, () => console.log(`listening on port 8080`)); //runs on port 8080 