// Rianne Pada
// Server that hosts my e-commerce site
// Some code is taken from examples made by Rick Kazman, found at https://github.com/rnkazman/ITM352_F2020/tree/master/Lab14
var express = require('express');
var myParser = require("body-parser");
var fs = require('fs');
var data = require('./public/products.js');
var products = data.products;
const queryString = require("querystring");
var filename = 'user_registration_info.json';
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
// REFERENCED FROM RICK KAZMAN, LAB 14 EXAMPLE
app.post("/login_form", function (req, res) {
    var LogError = [];
    console.log(req.query);
    the_username = req.body.username.toLowerCase();
    if (typeof users_reg_data[the_username] != 'undefined') {
        //Asking object if it has matching username, if it doesnt itll be undefined.
        if (users_reg_data[the_username].password == req.body.password) {
            req.query.username = the_username;
            console.log(users_reg_data[req.query.username].name);
            req.query.name = users_reg_data[req.query.username].name
            res.redirect('/Invoice.html?' + queryString.stringify(req.query));
            return;
            //Redirect them to invoice here if they logged in correctly//
        } else {
    res.redirect('./login.html?' + queryString.stringify(req.query));
    LogError.push= ('Invalid Password');
 }

}});
// REFERENCED FROM RICK KAZMAN + LAB 14
app.post("/register_form", function (request, response) {
    var qString = queryString.stringify(request.query); // String query together
    // the values submitted, turned into variables
    // Validation help taken from Lab 14 Ex.4
    // I got help with the following code below from my coworkers at the place where I intern- RevaComm. They are software developers who were willing to help me 
    // I also used https://www.w3resource.com/javascript/form/javascript-sample-registration-form-validation.php for help with the variables
    regInputUser = request.body.username; // username
    regInputFullname = request.body.fullname; //full name
    regInputPassword = request.body.password; //password
    regInputRepPassword = request.body.repeat_password; //confirm password
    regInputEmail = request.body.email; //email
    email = request.body.email

    if (regInputFullname.length > 30) { // Full name cannot be over 30 characters
        fullnameErrorReg = '<font color="red">Full Name must be 30 characters or less</font>'; //error is written on screen
        // ERROR VARIABLES
        regIncorrectFullName = regInputFullname; 
        regIncorrectUsername = regInputUser;
        regIncorrectEmail = regInputEmail;
    } else if (!(/^[A-Za-z ]+$/.test(regInputFullname))) { // REFERENCED FROM https://www.ntu.edu.sg/home/ehchua/programming/howto/Regexe.html username cannot have anything but letters
        fullnameErrorReg = '<font color="red">Full Name must be letters only</font>'; // error is written on screen 
        //ERROR VARIABLES
        regIncorrectFullName = regInputFullname;
        regIncorrectUsername = regInputUser;
        regIncorrectEmail = regInputEmail;
    } else { //no errors
        fullnameErrorReg = ''; // No errors are stored in the variable
        // NO ERRORS VARIABLE
        regIncorrectFullName = regInputFullname;
        regIncorrectUsername = regInputUser;
        regIncorrectEmail = regInputEmail;
    }

    if (regInputPassword.length < 6) { // password has to be at least 6 characters
        passwordErrorReg = '<font color="red">Password must be at least six characters</font>'; // error message displayed on page
       // ERROR VARIABLES
        regIncorrectFullName = regInputFullname; 
        regIncorrectUsername = regInputUser;
        regIncorrectEmail = regInputEmail;
    } else if (regInputRepPassword != regInputPassword) { // passwords entered dont match
        passwordErrorReg = '<font color="red">Password DOES NOT Match</font>'; // error message on page
       // ERROR VARIABLES
        regIncorrectFullName = regInputFullname; 
        regIncorrectUsername = regInputUser;
        regIncorrectEmail = regInputEmail;
    } else { // no errors
        // NO ERROR VARIABLE
        passwordErrorReg = ''; 
        regIncorrectFullName = regInputFullname; 
        regIncorrectUsername = regInputUser;
        regIncorrectEmail = regInputEmail;
    }

    if (typeof users_reg_data[regInputUser] != 'undefined') { // username cannot be already registered
        usernameErrorReg = '<font color="red">User already registered</font>'; // error message on page
        // ERROR VARIABLES
        regIncorrectFullName = regInputFullname; 
        regIncorrectUsername = regInputUser;
        regIncorrectEmail = regInputEmail;
    } else if (!(/^[a-zA-Z0-9]+$/.test(regInputUser))) { // REFERENCED FROM https://www.ntu.edu.sg/home/ehchua/programming/howto/Regexe.html usernames cannot have anything besides numbers and letters
        usernameErrorReg = '<font color="red">Username must be characters and numbers only</font>'; // error message on page
        // ERROR VARIABLES
        regIncorrectFullName = regInputFullname; 
        regIncorrectUsername = regInputUser;
        regIncorrectEmail = regInputEmail;
    } else if (regInputUser.length > 10) { // username can't be over 10 characters
        usernameErrorReg = useLong = '<font color="red">Username must be ten characters or less</font>'; // error message on page
        // ERROR VARIABLES
        regIncorrectFullName = regInputFullname; 
        regIncorrectUsername = regInputUser;
        regIncorrectEmail = regInputEmail;
    } else if (regInputUser.length < 4) { // username can't be less than 4 characters
        usernameErrorReg = '<font color="red">Username must be at least four characters</font>'; // error message on page
        // ERROR VARIABLES
        regIncorrectFullName = regInputFullname; 
        regIncorrectUsername = regInputUser;
        regIncorrectEmail = regInputEmail;
    } else { // NO ERROR
        // ERROR VARIABLES
        usernameErrorReg = ''; 
        regIncorrectFullName = regInputFullname; 
        regIncorrectUsername = regInputUser;
        regIncorrectEmail = regInputEmail;
    }

    if (!(/^[a-zA-Z0-9._]+@[a-zA-Z.]+\.[a-zA-Z]{2,3}$/.test(regInputEmail))) { // verify email is x@y.z formatting
        emailErrorReg = '<font color="red">Email is invalid</font>'; // error message on page
        // ERROR VARIABLES
        regIncorrectFullName = regInputFullname; 
        regIncorrectUsername = regInputUser;
        regIncorrectEmail = regInputEmail;
    } else {  //no errors
        // ERROR VARIABLES
        emailErrorReg = ''; 
        regIncorrectFullName = regInputFullname;
        regIncorrectUsername = regInputUser;
        regIncorrectEmail = regInputEmail;
    }

    // If there are no errors stored in each error variable, user is stored in users_reg_data object
    if (fullnameErrorReg == '' && passwordErrorReg == '' && usernameErrorReg == '' && emailErrorReg == '') {
        users_reg_data[regInputUser] = {}; // New user becomes new property of users_reg_data object
        users_reg_data[regInputUser].name = request.body.fullname; // Name entered is stored in users_reg_data object
        users_reg_data[regInputUser].password = request.body.password; // Password entered is stored in users_reg_data object
        users_reg_data[regInputUser].email = request.body.email; // Email entered is stored in users_reg_data object
        fs.writeFileSync(filename, JSON.stringify(users_reg_data)); // Strings data into JSON for users_reg_data

        // Puts variables into query
        request.query.stickFullname = regInputFullname;
        request.query.stickEmail = regInputEmail;
        request.query.stickUsername = regInputUser;
        qString = queryString.stringify(request.query); // String query together
        response.redirect("./invoice.html?" + qString); // Send to invoice page with query

        console.log(request.body);
    } // Retrieve variables and puts them into query; for displaying errors on page
    request.query.RegFullnameError = fullnameErrorReg;
    request.query.RegPasswordError = passwordErrorReg;
    request.query.RegUsernameError = usernameErrorReg;
    request.query.RegEmailError = emailErrorReg;
    
    // Retrieve variables and puts them into query; for sticking user input
    request.query.stickRegFullname = regIncorrectFullName;
    request.query.stickUsername = regIncorrectUsername;
    request.query.stickEmail = regIncorrectEmail;

    qString = queryString.stringify(request.query); // String query together
    response.redirect("./register.html?" + qString); // the quantity data in the query is sent to the registration page. upon successful registration the data is displayed on the invoice.
});

app.use(express.static('./public'));
app.listen(8080, () => console.log(`listening on port 8080`));