var express = require('express');
var app = express();
var myParser = require("body-parser");
app.use(myParser.urlencoded({ extended: true }));

app.get("/login", function (request, response) {
    // Give a simple login form
    str = `
<body>
<form action="process_login" method="POST">
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
console.log(request.body)
});

app.listen(8080, () => console.log(`listening on port 8080`));



const fs = require('fs');
const { request } = require('http');

var user_data_filename = 'user_data.json';

var data = fs.readFileSync(user_data_filename, 'utf-8');

if (fs.existsSync(filename)) {
    stats = fs.statSync(user_data_filename)
    console.log(`user_data.json has ${stats.size} characters` )
    var data = fs.readFileSync(user_data_filename, `utf-8`);
    users_reg_data = JSON.parse(data);

} else {
    console.log(`ERR: ${user_data_filename} does not exist!`)
}

// console.log(users_reg_data, typeof users_reg_data, typeof data);

if(typeof users_reg_data[request.body.username] != 'undefined') {
    console.log(typeof users_reg_data['itm352']['password'] == 'xxx')
}
