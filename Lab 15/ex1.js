var express = require('express');
var app = express();
var myParser = require("body-parser");
var fs = require('fs');
const { exit } = require('process');
var cookieParser = require('cookie-parser');
const {nextTick} = require('process')
const { response } = require('express');
app.use(cookieParser());
var session = require('express-session');
app.use(session({secret: "ITM352 rocks!"}));

const user_data_filename = "user_data.json";

if (fs.existsSync(user_data_filename)) {
    stats = fs.statSync(user_data_filename);
    console.log(`user_data.json has ${stats['size']} characters`)
    var data = fs.readFileSync(user_data_filename, 'utf-8');
    //console.log("Success! We got: " + data);

    user_reg_data = JSON.parse(data);
}

app.use(myParser.urlencoded({extended:true}));

app.all("*", function (request, response, next){
if(!request.session.lastLogin) {
request.session.lastLogin = null;
} 
console.log(request.session);
next();
});
app.get("/use_session", function (request, response){{
    console.log(request.session);
    if(typeof request.session.id != `undefined`) {
    response.send(`welcome your session ID is ${request.session.id}`)
}
app.get("/set_cookie", function (request, response){{
    response.cookie("myname", 'Rianne', {maxAge: 5 * 1000})
    response.send('cookie sent!')
}
app.get("/use_cookie", function (request, response){{
    console.log(request.cookies);
    thename = 'ANONYMOUS'
    if(typeof request.cookies["myname"] != 'undefined'); {
        thename = request.cookies["myname"];
    }
    response.send(`Welcome to the Use Cookie page ${thename}`);
}
app.get("/login", function (request, response) {
    // Process login form POST and redirect to logged in page if ok, back to login page if not
    console.log(request.session);
    if (typeof request.session.lastLogin != 'undefined') {
       lastLogin = request.session.lastLogin;
    } else {
       lastLogin = 'First login!'
    }
    str = `
<body>
Last Login: ${lastLogin}
<form action="/process_login" method="POST">
<input type="text" name="username" size="40" placeholder="enter username" ><br />
<input type="password" name="password" size="40" placeholder="enter password"><br />
<input type="submit" value="Submit" id="submit">
</form>
</body>
    `;
});
app.post("/process_login", function (request, response) {
    // Process login form POST and redirect to logged in page if ok, back to login page if not
    console.log(`${request.body.username} logged in on ${request.session.lastLogin}`);
    // if user exists, get their password
    if (typeof users_reg_data[request.body.username] != 'undefined') {
        if (request.body.password == users_reg_data[request.body.username].password) {
            var now = new Date();
            request.session.lastLogin = now.getTime();
            console.log(`${request.body.username} logged in on ${request.session.lastLogin}`)
            response.send(`Thank you ${request.body.username} for logging in.`);
        } else {
            response.send(`Hey! ${request.body.password} does not match what we have for you!`);
        }
    } else {
        response.send(`Hey! ${request.body.username} does not exist!`);
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

app.listen(8080, () => console.log(`listening on port 8080`))})})}})