age = 19;
name = "Dan";
attributes  =  "Rianne;19;" + (age + 0.5) + ";" +  (0.5 - age);
parts = attributes.split(';')
for (part in parts) {
    console.log(`${part} is a ${typeof part}`);
}
console.log(typeof parts);