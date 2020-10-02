age_count = 1 // start the age counter
my_age = 19 
while(age_count < my_age){
    if((age_count >= my_age/2)) {
        console.log("Don't ask me how old I am!");
        process.exit();
    } else {
        console.log(`age ${age_count}`);
    }
age_count++;

}
console.log(`Rianne is ` + age_count + ` years old`)