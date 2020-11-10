// REFERENCE: FROM DANIEL PORT'S SCREENCAST "ASSIGNMENT 1"
var express = require ('express');
var app = express();
var myParser = require("body-parser");
var fs = require('fs');
var data = require('./public/products.js');
var products = data.products; 
var qs = require("querystring");


app.all('*', function (request, response, next) {
console.log(request.method +'to'+ request.path);
next();
}); // checking to see if receiving correct results
app.use(myParser.urlencoded({extended: true}));
app.post("/process_order", function (request,response){
// process_quantity_form(request.body, response);
// response.send(request.body);
// check if the quantities are valid or nonnegint first
global.onload = function () {
   let params = (new URL(document.location)).searchParams; // get the query string which has the form data
   // form was submitted so check that quantities are valid then redirect to invoice if ok.
   if (request.body('purchase_submit')) {
       has_errors = false; // assume quantities are valid from the start
       total_qty = 0; // need to check if something was selected so we will look if the total > 0
       for (i = 0; i < products.length; i++) {
         console.log(params.get(`quantity${i}`));
           if (request.body(`quantity${i}`)) {
               a_qty = params.get(`quantity${i}`);
               // make textboxes sticky in case of invalid data
               product_selection_form[`quantity${i}`].value = a_qty;
               total_qty += a_qty; 
               if(!isNonNegInt(a_qty)) {
                   has_errors = false; // oops, invalid quantity
                   checkQuantityTextbox(product_selection_form[`quantity${i}`]); // show where the error is
               }
           }
       }
has_errors = true;
theqstring = qs.stringify(request.body);
if (!has_errors) {
   // if quantities are valid, generate the invoice from quantities
 
 response.redirect("./invoice.html?" + theqstring);
} else {
 // got a mistake, just leave the user on the page dont respond 
 response.redirect("./index.html?" + theqstring);
}

function isNonNegInt(q, return_errors = false) {
   errors = []; // assume no errors at first
   if(q == '') q =0; // handle blank inputs as if they are 0
   if (Number(q) != q) errors.push('<font color="red">Not a number!</font>'); // Check if string is a number value
   else if (q < 0) errors.push('<font color="red">Negative value!</font>'); // Check if it is non-negative
   else if (parseInt(q) != q) errors.push('<font color="red">Not an integer!</font>'); // Check that it is an integer
   return return_errors ? errors : (errors.length == 0);
}

       // Now respond to errors or redirect to invoice if all is ok
       if(has_errors) {
           alert("Please enter only valid quantities!");
       } else if(total_qty == 0) { // no quantity selections, just give a general alert
           alert("Please select some quantities!");
       }
   }
}
app.use(myParser.urlencoded({ extended: true }));
app.post("/process_form", function (request, response) {
   let POST = request.body;
   if(isNonNegInt(POST["quantity_textbox"])) {
       response.send(`Thank you for ordering ${POST ["quantity_textbox"]} items!`);
   } else {
        response.send(`Hey ${POST["quantity_textbox]"]}} is not valid!`); 
   }
});

has_errors = true;
theqstring = qs.stringify(request.body);
if (!has_errors) {
   // if quantities are valid, generate the invoice from quantities
 
 response.redirect("./index.html?" + theqstring);
} else {
 // got a mistake, just leave the user on the page dont respond 
 response.redirect("./invoice.html?" + theqstring);
}

// if non valid, send user back to page and show them errors to correct










});
app.use(express.static('./public'));
app.listen(8080, () => console.log('listening on Port 8080'));

function iNonNegInt (q,returnErrors = false) {
    errors = []; // assume no error at first
    if (Number(q) != q) errors.push('Not a number!'); // Check if string is number
    if (q < 0) errors.push ('Negative value!'); // check if non-negative
    if (parseInt (q) != q) errors.push('Not an interger!'); // check if interger
    return returnErrors ? errors : (errors.length == 0);

app.use(myParser.urlencoded({ extended: true }));
//intercept purchase submission form, if good give an invoice, otherwise send back to order page
app.get("/invoice", function (request, response) {
   //check if quantity data is valid
   //look up request.query
   params = request.query;
   console.log(params);
   if (typeof params['purchase_submit'] != 'undefined') {
      has_errors = false; // assume quantities are valid from the start
      total_qty = 0; // need to check if something was selected so we will look if the total > 0
      for (i = 0; i < products.length; i++) {
         if (typeof params[`quantity${i}`] != 'undefined') {
            a_qty = params[`quantity${i}`];
            total_qty += a_qty;
            if (!isNonNegInt(a_qty)) {
               has_errors = true; // oops, invalid quantity
            }
         }
      }
      qstr = querystring.stringify(request.query);
      // Now respond to errors or redirect to invoice if all is ok
      if (has_errors || total_qty == 0) {
         //if quantity data is not valid, send them back to product display
         qstr = querystring.stringify(request.query);
         response.redirect("index.html?" + qstr);
      } else { // all good to go!
         response.redirect("invoice.html?" + qstr);
      }
   }
});

app.use(express.static('./public'));
app.listen(8080, () => console.log(`listening on port 8080`));
response.send(receipt);
response.end();
}



