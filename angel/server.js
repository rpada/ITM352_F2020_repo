
// Author: Kiara Furutani and Angela Lee
// This file contains the code for the server to run the different pages

// Code format from Lab 13 with assistance from Kobe Dait
var express = require('express'); //Calls the express package
var myParser = require("body-parser"); //Calls the package-lock.json
var fs = require('fs');
var data = require('./public/product_data.js'); //Pulls Product Data
var products = data.products;
var queryString = require("querystring");

var app = express(); //declaring express() as app
app.all('*', function (request, response, next) {
    console.log(request.method + ' to ' + request.path);
    next();
});

// Code is taken from https://nodemailer.com/message/
var message = {
    from: 'Nodemailer <angelal8@hawaii.edu>',
    to: 'Nodemailer <${username.email}>',
    subject: 'Succulent Receipt',
    text: 'Thank you for shopping with us!',
    html: '<p>For clients that do not support AMP4EMAIL or amp'
    ,headers: {
        'My-Custom-Header': 'header value'
    },
    date: new Date('2000-01-01 00:00:00')
};

app.use(myParser.urlencoded({ extended: true })); //Server-side processing
app.post("/process_form", function (request, response) {
    quantity_form(request.body, response);
});

app.use(express.static('./public'));
app.listen(8080, () => console.log(`listening on port 8080`));





function isNonNegInt(q, returnErrors = false) {
    errors = []; // assume no errors at first
    if (Number(q) != q) errors.push('Not a number!'); // Check if string is a number value
    if (q < 0) errors.push('Negative value!'); // Check if it is non-negative
    if (parseInt(q) != q) errors.push('Not an integer!'); // Check that it is an integer
    return returnErrors ? errors : (errors.length == 0);
}


function quantity_form(POST, response) {
    if (typeof POST['purchase_submit_button'] != 'undefined') {
        // Check if the quantities are valid, if so, send to the invoice, if not, give an error
        var qString = queryString.stringify(POST);
        for (i in products) {
            let q = POST[`quantity${i}`];
            if (isNonNegInt(q) == true) {
                response.redirect('login_display.html?' + qString); // Redirects to Login Page with query strings
            } else {
                response.redirect('products_display.html?' + qString); // Redirects back to Products page

            }
            
            // Formatted from my Lab 14 and modified
            var user_info_file = 'userdata.json';

            if(fs.existsSync(user_info_file)) {            
                var data = fs.readFileSync(user_info_file, 'utf-8');
                var userdata = JSON.parsel(data);
            
            app.use(myParser.urlencoded({ extended: true }));
            
            app.post("/process_login", function (request, response){ // login page
                console.log(request.query);// Get info from form
                var err_str = ""; // from my lab 14
                var login_username = request.body["username"];
                // check if username exists in reg data. If true, check if password matches
                if(typeof userdata[login_username] != 'undefined') {
                    var user_info = userdata[login_username];
                    // check if password matches username from JSON
                    if(user_info["password"] != request.body["password"]) {
                          err_str = `bad_password`;
                    } else {
                        request.query.username= login_username;
                        response.redirect('./invoice_display.html?'+ qs.stringify(request.query));
                      return;
                    }
                    
                } else { err_str="bad username"; // error message for bad username from my Lab 14

                app.post("/check_login", function (request, response) {
                    // Process login form POST and redirect to logged in page if ok, back to login page if not
                    console.log(request.query);
                    var err_str = "";
                    var login_username = request.body["username"];
                    // check if username exists in reg data. If so, check if password matches
                    if (typeof userdata[login_username] != 'undefined') {
                        var user_info = userdata[login_username];
                        // check if password stored for username matches what user typed in
                        if (user_info["password"] != request.body["password"]) {
                            err_str = `bad_password`;
                        } else {
                            session.username = login_usernme;
                            var theDate = Date().now();
                            session.last_login_time = theDate;
                            response.cookie('username', login_username, {maxAge: 5*1000});
                            response.end(`${login_username} is logged in with data ${JSON.stringify(quantity_str)} on ${theDate}`);
                            return;
                        }
                }
                app.post("/check_login", function (request, response) {
                    // Process login form POST and redirect to logged in page if ok, back to login page if not
                    console.log(request.query);
                    var err_str = "";
                    var login_username = request.body["username"];
                    // check if username exists in reg data. If so, check if password matches
                    if (typeof userdata[login_username] != 'undefined') {
                        var user_info = userdata[login_username];
                        // check if password stored for username matches what user typed in
                        if (user_info["password"] != request.body["password"]) {
                            err_str = `bad_password`;
                        } else {
                            session.username = login_usernme;
                            var theDate = Date().now();
                            session.last_login_time = theDate;
                            response.cookie('username', login_username, {maxAge: 5*1000});
                            response.end(`${login_username} is logged in with data ${JSON.stringify(quantity_str)} on ${theDate}`);
                            return;
                        }
                }
                    request.query.err=err_str // detects if error
                    response.redirect('./login_display.html?'+ qs.stringify(request.query));
            });
    
            app.post("/register_user", function (request, response) { // Register form 
                console.log(request.body);
                username = request.body.username;
                userdata[username] = {};
                userdata[username].password = request.body.password;
                userdata[username].email = request.body.email;
                // Store to reg data 
                fs.writeFileSync(user_info_file, JSON.stringify(userdata));
                response.end(`New username ${username} registered`)
            });


                })}})}}}}