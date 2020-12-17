var express = require('express')
var app = express();
var myParser = require("body-parser");
const fs = require('fs');
var cookieParser = require('cookie-parser');
var session = require('express-session');

app.use(session({secret: "ITM352 rocks!"}));
app.use(cookieParser());

const user_data_filename = 'user_data.json';

if(fs.existsSync(user_data_filename)) {
stats = fs.existsSync(user_data_filename);
console.log(`user_data.json has ${stats['size']} characters`)

var data = fs.readFileSync(user_data_filename, 'utf-8');
users_reg_data = JSON.parse(data);
}

app.use(myParser.urlencoded({extended: true}))

app.get("/use_cookie", function (request, response) {
response.cookie('myname', 'Dan');
response.send('Cookie sent!');

});

app.get("/use_cookie", function (request, response) {
console.log(request.cookies);
thename = 'ANONYMOUS';
if(typeof request.cookies["myname"] != 'undefined') {
    thename = request.cookies["myname"]
}
response.send(`Welcome to the Use Cookie page ${thename}`)


});

app.get("/register", function (request, response){

str = `
<body>
<form action ="process_register" method="POST">
<input type = "text" name ="username" size="40" placeholder
`

});