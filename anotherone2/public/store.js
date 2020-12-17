/*
Authors: Shane Shimizu, Daniel Francis Barit, Kiara Fairbairn
File Description: funtions for checking user input in textbox on cart page
Date: December 19, 2019
*/

//Source from Professor Daniel Port's Assignment 1
//function for user entering quantities, checks if the user is entering anything other than an integer 
function isNonNegInt(q, return_errors = false) {
    errors = []; // assume no errors at first
    if (q == '') q = 0; // handle blank inputs as if they are 0
    if (Number(q) != q) errors.push('<div class="shop-item-error">Not a number!</div>'); // Check if string is a number value
    else if (q < 0) errors.push('<div class="shop-item-error">Negative value!</div>'); // Check if it is non-negative
    else if (parseInt(q) != q) errors.push('<div class="shop-item-error">Not an integer!</div>'); // Check that it is an integer
    return return_errors ? errors : (errors.length == 0); //returns erorrs if there are any errors
}

//Source from Professor Daniel Port's Assignment 1
//function for checking quantity textbox when user enters information
function checkQuantityTextbox(theTextbox) {
    errs = isNonNegInt(theTextbox.value, true); //checks the value of the textbox sets the function isNonNegInt to true and assigns it into the variable errs
    if (errs.length == 0) errs = ['You want: ']; //if the length of errs equals 0 or there are no errors, then the textbox displays 'you want: '
    if (theTextbox.value.trim() == '') errs = ['Quantity']; //if the user has not entered anything or the value is nothing, it displays 'Quantity'
    document.getElementById(theTextbox.name + '_label').innerHTML = errs.join(", "); //sets the inner html of the textbox name to show errors

}
//function for when the page finished loading or when user clicks purchase
//source from Professor Daniel Ports Assignments 1
window.onload = function () {
    let params = (new URL(document.location)).searchParams; // get the query string which has the form data
    // form was submitted so check that quantities are valid then redirect to invoice if ok.
    if (params.has('purchase_submit')) { //if the form has purchase_submit from the user clicking submit
        has_errors = false; // assume quantities are valid from the start
        total_qty = 0; // need to check if something was selected so we will look if the total > 0
        for (i = 0; i < products.length; i++) { //for loop to check the length of products array
            if (params.has(`quantity${i}`)) {//if the form has the quantity
                a_qty = params.get(`quantity${i}`); //assigns the value of the quantity(i) to a_qty
                // make textboxes sticky in case of invalid data
                product_selection_form[`quantity${i}`].value = a_qty; //assigns a_qty into the value of quantity(i) in product_selection_form
                total_qty += a_qty; //total_qty becomes total_qty + a_qty
                if (!isNonNegInt(a_qty)) { //if a_qty is not a valid integer
                    has_errors = true; // oops, invalid quantity
                    checkQuantityTextbox(product_selection_form[`quantity${i}`]); // show where the error is
                }
            }
        }
        // Now respond to errors or redirect to invoice if all is ok
        if (has_errors) {
            alert("Please enter only valid quantities!");
        } else if (total_qty == 0) { // no quantity selections, just give a general alert
            alert("Please select some quantities!");
        } else { // all good to go!
            window.location = `./login.html${document.location.search}`;
            window.stop;
        }
    }
}

//source w3 schools
//retrievs the date
var today = new Date();
//retrieves year, month, date
var date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();