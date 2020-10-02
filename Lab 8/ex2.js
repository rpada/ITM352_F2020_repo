age_count = 1 // start the age counter
my_age = 19 
while(age_count < my_age){
    if((age_count >= my_age/2) && (age_count < (3/4)*my_age)) {
        console.log("No age zone!");
    } else {
        console.log (`my_age${age_count}`);
    }
age_count++;

}
console.log(`Rianne is ` + age_count + ` years old`)