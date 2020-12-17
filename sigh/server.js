//The following codes allows to do server side processing.
//Resource: Lab13 Assignment

const querystring = require('querystring');
var express = require('express'); //code for server
var myParser = require("body-parser"); //code for server
var products = require("./public/product_data.js"); //accessing data from javascript file
var filename = 'user_data.json' //defines array as object
var app = express();
var qs = require('querystring');
var qstr = {};
var itemquantity = {};
var cookieParser = require('cookie-parser');

app.all("*", function (request, response, next) {
    console.log(request.method, request.path);
    next();
});
app.use(cookieParser());


app.use(myParser.urlencoded({ extended: true }));

//go to invoice if quantity values are good, if not, redirect back to order page 
app.get("/process_page", function (request, response) {
   //check for valid quantities
   //look up request.query
   itemquantity = request.query;
   params = request.query;
   console.log(params);
   if (typeof params['purchase_submit'] != 'undefined') {
      has_errors = false; // assume that quantity values are valid
      total_qty = 0; // check if there are values in the first place, so see if total > 0
      for (i = 0; i < products.length; i++) {
         if (typeof params[`quantity${i}`] != 'undefined') {
            a_qty = params[`quantity${i}`];
            total_qty += a_qty;
            if (!isNonNegInt(a_qty)) {
               has_errors = true; // see if there is invalid data
            }
         }
      }
      qstr = querystring.stringify(request.query);
      // redirect to invoice if quantity data is valid or respond to invalid data
      if (has_errors || total_qty == 0) {
         //redirect to products page if quantity data is invalid
         qstr = querystring.stringify(request.query);
         response.redirect("amashop.html?" + qstr);
      } else { //the quantity data is okay for the invoice
         response.redirect("amainvoice.html?" + qstr);
      }
   }
});


//if quantity data valid, send them to the invoice

function isNonNegInt(q, returnErrors = false) {
   errors = []; // assume that quantity data is valid 
   if (q == "") { q = 0; }
   if (Number(q) != q) errors.push('Not a number!'); //check if value is a number
   if (q < 0) errors.push('Negative value!'); //check if value is a positive number
   if (parseInt(q) != q) errors.push('Not an integer!'); //check if value is a whole number
   return returnErrors ? errors : (errors.length == 0);
}


fs = require('fs'); //uses file system module

//only open file if it exists
if (fs.existsSync(filename)) {
   stats = fs.statSync(filename) //gets stats from file

   data = fs.readFileSync(filename,'UTF-8');
   users_reg_data = JSON.parse(data);
}


//go to login page
app.get("/amalogin.html", function (request, response) {
   str = `
   <!DOCTYPE html>
   <html lang="en">
   <title>American Marketing Association</title>
   <meta charset="UTF-8">
   <meta name="viewport" content="width=device-width, initial-scale=1">
   <link rel="stylesheet" href="https://www.w3schools.com/w3css/4/w3.css">
   <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Poppins">
   <style>
   body,h1,h2,h3,h4,h5 {font-family: "Poppins", sans-serif}
   body {font-size:16px;}
   .w3-half img{margin-bottom:-6px;margin-top:16px;opacity:0.8;cursor:pointer}
   .w3-half img:hover{opacity:1}
   </style>
   <body>
   
   <!-- Sidebar/menu -->
   <nav class="w3-sidebar w3-blue w3-collapse w3-top w3-large w3-padding" style="z-index:3;width:300px;font-weight:bold;" id="mySidebar"><br>
     <a href="javascript:void(0)" onclick="w3_close()" class="w3-button w3-hide-large w3-display-topleft" style="width:100%;font-size:22px">Close Menu</a>
     <div class="w3-container">
       <h3 class="w3-padding-64"><b>American Marketing Association<br>(AMA)</b></h3>
     </div>
     <div class="w3-bar-block">
       <a href="./index.html" onclick="w3_close()" class="w3-bar-item w3-button w3-hover-white">Home</a> 
       <a href="./amalogin.html" onclick="w3_close()" class="w3-bar-item w3-button w3-hover-white">Login</a> 
       <a href="./amasignup.html" onclick="w3_close()" class="w3-bar-item w3-button w3-hover-white">Sign Up</a> 
     </div>
   </nav>
   
   <!-- Top menu on small screens -->
   <header class="w3-container w3-top w3-hide-large w3-blue w3-xlarge w3-padding">
     <a href="javascript:void(0)" class="w3-button w3-blue w3-margin-right" onclick="w3_open()">☰</a>
   </header>
   
   <!-- Overlay effect when opening sidebar on small screens -->
   <div class="w3-overlay w3-hide-large" onclick="w3_close()" style="cursor:pointer" title="close side menu" id="myOverlay"></div>
   
   <!-- !PAGE CONTENT! -->
   <div class="w3-main" style="margin-left:340px;margin-right:40px">
   
     <!-- Header -->
     <div class="w3-container" style="margin-top:80px" id="showcase">
       <h1 class="w3-jumbo"><b>American Marketing Association</b></h1>
       <h1 class="w3-xxxlarge w3-text-blue"><b>Login Page</b></h1>
       <h3 class="w3-xlarge w3-text-blue"><b>Access our members exclusive content!</b></h3>
       <hr style="width:50px;border:5px solid blue" class="w3-round">
     </div>
   
   
   
       <!--this code puts the whole body of the website not overlapping the navbar-->
       <div style="margin-left:25%;padding:1px 16px;height:1000px;">
   
           <form name="loginform" method="POST">
               <div>
                   <input type="text" name="username" size="40" placeholder="enter username"><br />
                   <input type="password" name="password" size="40" placeholder="enter password"><br />
                   <input type="submit" value="login" id="submit"> </div>
           </form>
   </body>
   
       <script>
       regpage.href = "amasignup.html" + document.location.search;
       loginform.action = "./login" + document.location.search;
       </script>
       </html>
       
   <!-- End page content -->
   </div>
   
   <!-- W3.CSS Container -->
   <div class="w3-container w3-padding-32" style="margin-top:75px;padding-right:58px"><p class="w3-right"><a href="https://www.w3schools.com/w3css/default.asp" title="W3.CSS" target="_blank" class="w3-hover-opacity"></a></p></div>
   
   <script>
   // Script to open and close sidebar
   function w3_open() {
     document.getElementById("mySidebar").style.display = "block";
     document.getElementById("myOverlay").style.display = "block";
   }
    
   function w3_close() {
     document.getElementById("mySidebar").style.display = "none";
     document.getElementById("myOverlay").style.display = "none";
   }
   
   // Modal Image Gallery
   function onClick(element) {
     document.getElementById("img01").src = element.src;
     document.getElementById("modal01").style.display = "block";
     var captionText = document.getElementById("caption");
     captionText.innerHTML = element.alt;
   }
  
   </script>
   
   </body>
   </html>
   
`;
   response.send(str);

});

app.post("/amalogin.html", function (request, response) {
   // Process login form POST and redirect to logged in page if ok, back to login page if not
   
   the_username = request.body.username;
   console.log(the_username, "Username is", typeof (users_reg_data[the_username]));
   //validate login data
   if (typeof users_reg_data[the_username] == 'undefined') {
    response.redirect('./amalogin.html?'); 

  }
   if (typeof users_reg_data[the_username] != 'undefined') {
      //To check if the username exists in the json data
      if (users_reg_data[the_username].password == request.body.password) {
         //make the query string have their username for the welcome
         qstring = querystring.stringify(request.query);
         //Input cookie data here
         response.cookie('username', the_username, { maxAge: 50 * 1000 * 10 }).redirect('/amawelcome.html?'+ `&username=${the_username}`);
         //response.redirect('/amawelcome.html?'+ `&username=${the_username}`);
      } else {
         response.redirect('./amalogin.html?');
       
          }
   }
});

app.get("/amasignup.html", function (request, response) {
   // Give a simple register form

   str = `
   <!DOCTYPE html>
   <html lang="en">
   <title>American Marketing Association</title>
   <meta charset="UTF-8">
   <meta name="viewport" content="width=device-width, initial-scale=1">
   <link rel="stylesheet" href="https://www.w3schools.com/w3css/4/w3.css">
   <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Poppins">
   <style>
   body,h1,h2,h3,h4,h5 {font-family: "Poppins", sans-serif}
   body {font-size:16px;}
   .w3-half img{margin-bottom:-6px;margin-top:16px;opacity:0.8;cursor:pointer}
   .w3-half img:hover{opacity:1}
   </style>
   <body>
   
   <!-- Sidebar/menu -->
   <nav class="w3-sidebar w3-blue w3-collapse w3-top w3-large w3-padding" style="z-index:3;width:300px;font-weight:bold;" id="mySidebar"><br>
     <a href="javascript:void(0)" onclick="w3_close()" class="w3-button w3-hide-large w3-display-topleft" style="width:100%;font-size:22px">Close Menu</a>
     <div class="w3-container">
       <h3 class="w3-padding-64"><b>American Marketing Association<br>(AMA)</b></h3>
     </div>
     <div class="w3-bar-block">
       <a href="./index.html" onclick="w3_close()" class="w3-bar-item w3-button w3-hover-white">Home</a> 
       <a href="./amalogin.html" onclick="w3_close()" class="w3-bar-item w3-button w3-hover-white">Login</a> 
       <a href="./amasignup.html" onclick="w3_close()" class="w3-bar-item w3-button w3-hover-white">Sign Up</a> 
     </div>
   </nav>
   
   <!-- Top menu on small screens -->
   <header class="w3-container w3-top w3-hide-large w3-blue w3-xlarge w3-padding">
     <a href="javascript:void(0)" class="w3-button w3-blue w3-margin-right" onclick="w3_open()">☰</a>
   </header>
   
   <!-- Overlay effect when opening sidebar on small screens -->
   <div class="w3-overlay w3-hide-large" onclick="w3_close()" style="cursor:pointer" title="close side menu" id="myOverlay"></div>
   
   <!-- !PAGE CONTENT! -->
   <div class="w3-main" style="margin-left:340px;margin-right:40px">
   
     <!-- Header -->
     <div class="w3-container" style="margin-top:80px" id="showcase">
       <h1 class="w3-jumbo"><b>American Marketing Association</b></h1>
       <h1 class="w3-xxxlarge w3-text-blue"><b>Sign Up Page</b></h1>
       <h3 class="w3-xlarge w3-text-blue"><b>Join AMA!</b></h3>
       <hr style="width:50px;border:5px solid blue" class="w3-round">
     </div>
   
   
     <script>src ="server.js"</script>
   </head>
   <script>
           var password = document.getElementById("password") //turns password into an object
           ,repeat_password = document.getElementById("repeat_password"); //turns repeat password into an object
           
           function validatePassword(){
             if(password.value != repeat_password.value) { //if password is not equal to repeat password, say passwords don't match
               alert("Please make sure passwords match.");
           response.redirect('public/amasignup.html') 
             } 
           else{
               response.redirect('Login_Successful') 
           }
         
           }
             validatePassword();
         </script>
   <body>
   
       <!--this code puts the whole body of the website not overlapping the navbar-->
       <div style="margin-left:25%;padding:1px 16px;height:1000px;">
           <div>
                   <form  method="POST" action="" onsubmit=validatePassword() >
                     <input type="text" name="fullname" size="40" pattern="[a-zA-Z]+[ ]+[a-zA-Z]+" maxlength="30" placeholder="Enter First & Last Name"><br />
                     <input type="text" name="username" size="40" pattern=".[a-z0-9]{3,10}" required title="Minimum 4 Characters, Maximum 10 Characters, Numbers/Letters Only" placeholder="Enter Username" ><br />
                     <input type="email" name="email" size="40" placeholder="Enter Email" pattern="[a-z0-9._]+@[a-z0-9]+\.[a-z]{3,}$" required title="Please enter valid email."><br />
                     <input type="password" id="password" name="password"  size="40" pattern=".{8,}" required title="8 Characters Minimum" placeholder="Enter Password"><br />
                     <input type="password" id="repeat_password" name="repeat_password" size="40" pattern=".{8,}" required title="8 Characters Minimum" placeholder="Repeat Password"><br />
                  
                     <input type="submit" value="Submit" id="submit">
                 </form></div>
              
       </html>
       
   <!-- End page content -->
   </div>
   
   <!-- W3.CSS Container -->
   <div class="w3-container w3-padding-32" style="margin-top:75px;padding-right:58px"><p class="w3-right"><a href="https://www.w3schools.com/w3css/default.asp" title="W3.CSS" target="_blank" class="w3-hover-opacity"></a></p></div>
   
   <script>
   // Script to open and close sidebar
   function w3_open() {
     document.getElementById("mySidebar").style.display = "block";
     document.getElementById("myOverlay").style.display = "block";
   }
    
   function w3_close() {
     document.getElementById("mySidebar").style.display = "none";
     document.getElementById("myOverlay").style.display = "none";
   }
   
   // Modal Image Gallery
   function onClick(element) {
     document.getElementById("img01").src = element.src;
     document.getElementById("modal01").style.display = "block";
     var captionText = document.getElementById("caption");
     captionText.innerHTML = element.alt;
   }
   
   
   </script>
   
   </body>
   </html>
   
`;
   response.send(str);
});

app.post("/amasignup.html", function (request, response) {
   // process a simple register form
   console.log(itemquantity);
   the_username = request.body.username;
   console.log(the_username, "Username is", typeof (users_reg_data[the_username]));

   username = request.body.username;//Save new user to file name (users_reg_data)

   errors = [];//Checks to see if username already exists

   if (typeof users_reg_data[username] != 'undefined') {
      errors.push("Username is Already Taken");
   }

   console.log(errors, users_reg_data);

   if (errors.length == 0) {
      users_reg_data[username] = {};
      users_reg_data[username].username = request.body.username
      users_reg_data[username].password = request.body.password;
      users_reg_data[username].email = request.body.email;

         //make the query string have their username for the welcome
         qstring = querystring.stringify(request.query);
         //Input cookie data here
         response.cookie('username', the_username, { maxAge: 50 * 1000 * 10 }).redirect('/amawelcome.html?'+ `&username=${the_username}`);
         //response.redirect('/amawelcome.html?'+ `&username=${the_username}`);
   } else {
      response.redirect('./amasignup.html?');
      

   }
});


app.all('*', function (request, response, next) {
   console.log(request.method + ' to ' + request.path);
   next();
});
app.use(express.static('./public'));
app.listen(8080, () => console.log(`listening on port 8080`));

//Sources: Lab13