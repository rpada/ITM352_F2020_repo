var express = require('express');
var app = express();
var myParser = require("body-parser");
var fs = require('fs');
const { exit } = require('process');
var cookieParser = require('cookie-parser');
var session = require('express-session');

app.use(session({secret: "thisisasecret", saveUninitialized: false, resave: false }) );
app.use(cookieParser());
app.use(myParser.urlencoded({ extended: true }));

var filename = "user_data.json";

if (fs.existsSync(filename)) {
    data = fs.readFileSync(filename, 'utf-8');
    user_data = JSON.parse(data);
    //console.log("User_data=", user_data);
} else {
    console.log("Sorry can't read file " + filename);
    exit();
}

app.get("/set_cookie", function (request, response) {
    // Set a cookied with my name as its value
    // response.cookie('myname', 'Rick Kazman', {maxAge: 10000}).send('cookie set');
    response.cookie('myname', 'Rick Kazman').send('cookie set');
});

app.get("/use_cookie", function (request, response) {
    // Use the cookied that we receive from the browser.
    output = "No myname cookie found";
    if (typeof request.cookies.myname != 'undefined') {
        output = `Welcome to the Use Cookie Page ${request.cookies.myname}` ;
    }
    response.send(output);
});

app.get("/use_session", function (request, response) {
    //response.cookie('myname', 'Rick Kazman', {expire: 5 * 1000 + Date.now()}).send('cookie set');
    response.send("Welcome. Your session ID is: " + request.session.id); 
});


app.get("/login", function (request, response) {
    // Give a simple login form
    str = "";
    if (typeof request.cookies.username != 'undefined') {
        str += `Welcome ${request.cookies.username}`;
    }
    
    str += `
<body>
<form action="/login" method="POST">
<input type="text" name="username" size="40" placeholder="enter username" ><br />
<input type="password" name="password" size="40" placeholder="enter password"><br />
<input type="submit" value="Submit" id="submit">
</form>
</body>
    `;
    response.send(str);
});

app.post("/login", function (request, response) {
    // Process login form POST and redirect to logged in page if ok, back to login page if not
    console.log("Got a POST login request");
    POST = request.body;
    user_name_from_form = POST["username"];
    console.log("User name from form=" + user_name_from_form);
    if (user_data[user_name_from_form] != undefined) {
        //response.send(`<H3> User ${POST["username"]} logged in`);
        if (typeof request.session.last_login != 'undefined')
        {
            var msg = `You last logged in at ${request.session.last_login}`;
            var now = new Date();
        } else {
            var msg = '';
            var now = 'first visit';
        }
        request.session.last_login = now;
        response.cookie('username', user_name_from_form).send(`${msg} <BR>${user_name_from_form} logged in at ${now}`);
        //response.send(`${msg} <BR>${user_name_from_form} logged in at ${now}`);
    } else {
        response.send(`Sorry Charlie!`);
    }
});

app.get("/register", function (request, response) {
    // Give a simple register form
    str = `
<body>
<form action="/register" method="POST">
<input type="text" name="username" size="40" placeholder="enter username" ><br />
<input type="password" name="password" size="40" placeholder="enter password"><br />
<input type="password" name="repeat_password" size="40" placeholder="enter password again"><br />
<input type="email" name="email" size="40" placeholder="enter email"><br />
<input type="submit" value="Submit" id="submit">
</form>
</body>
    `;
    response.send(str);
});

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

app.listen(8080, () => console.log(`listening on port 8080`));