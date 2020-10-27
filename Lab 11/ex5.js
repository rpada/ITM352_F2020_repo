function isNonNegIntString (string_to_check, returnErrors = false) {
    // this function will check if string_to_check is a non negative interger. turns true if string_to_check is a non neh=gative interger
    errors = []; // assume no errors at first
    if(Number(string_to_check) != string_to_check) errors.push('Not a number!'); // Check if string is a number value
    if(string_to_check< 0) errors.push('Negative value!'); // Check if it is non-negative
    if(parseInt(string_to_check) != string_to_check) errors.push('Not an integer!'); // Check that it is an integer
return returnErrors ? errors : (errors.length == 0);
}

attributes  =  "Rianne;19;19.5" +  (0.5 - 19);
pieces = attributes.split(";");

function callback (i,part){
    console.log(`${pieces[i]} is non neg int ${isNonNegIntString(pieces[i], true).join("***")}`);
}
pieces.forEach(function(item,i){console.log(typeof item == 'string' && item.length > 0)?true:false});
