/*
Authors: Shane Shimizu, Daniel Francis Barit, Kiara Fairbairn
File Description: functions to add products to the cart page
Date: December 19, 2019
*/

//Source W3 Schools localStorage: https://www.w3schools.com/jsref/prop_win_localstorage.asp
//function to add Aloha Bowl to cart
function addAlohaBowlToCart() {
    if (typeof (Storage) !== "undefined") { //if localStorage is available 
        localStorage.setItem("alohaBowlCart", JSON.stringify(products[0])); //sets localStorage name and use JSON.stringify on product[#] as the value
        storedAlohaBowlCart = JSON.parse(localStorage.getItem("alohaBowlCart")); //parses the JSON string stored in localStorage with the name usersCart
    }
    alert("Aloha Bowl added to cart"); //alert the user the item was added to the cart
}

//function to add Mana Bowl to cart
function addManaBowlToCart() {
    if (typeof (Storage) !== "undefined") { //if localStorage is available
        localStorage.setItem("manaBowlCart", JSON.stringify(products[1])); //sets localStorage name and use JSON.stringify on product[#] as the value
        storedManaBowlCart = JSON.parse(localStorage.getItem("manaBowlCart")); //parses the JSON string stored in localStorage with the name usersCart

    }
    alert("Mana Bowl added to cart"); //alert the user the item was added to the cart
}

//function to add Makai Womens T-shirt to cart
function addWomensShirtToCart() {
    if (typeof (Storage) !== "undefined") { //if localStorage is available
        localStorage.setItem("womensShirtCart", JSON.stringify(products[2])); //sets localStorage name and use JSON.stringify on product[#] as the value
        storedWomensShirtCart = JSON.parse(localStorage.getItem("womensShirtCart")); //parses the JSON string stored in localStorage with the name usersCart

    }
    alert("Makai Women's T-Shirt added to cart"); //alert the user the item was added to the cart
}

//function to add Makai Mens T-Shirt to cart
function addMensShirtToCart() {
    if (typeof (Storage) !== "undefined") { //if localStorage is available
        localStorage.setItem("mensShirtCart", JSON.stringify(products[3])); //sets localStorage name and use JSON.stringify on product[#] as the value
        storedMensShirtCart = JSON.parse(localStorage.getItem("mensShirtCart")); //parses the JSON string stored in localStorage with the name usersCart

    }
    alert("Makai Men's T-Shirt added to cart"); //alert the user the item was added to the cart
}

//function to add Makai Women's Longsleeve to cart
function addWomensSleeveToCart() {
    if (typeof (Storage) !== "undefined") { //if localStorage is available
        localStorage.setItem("womensSleeveCart", JSON.stringify(products[4])); //sets localStorage name and use JSON.stringify on product[#] as the value
        storedWomensSleeveCart = JSON.parse(localStorage.getItem("womensSleeveCart")); //parses the JSON string stored in localStorage with the name usersCart

    }
    alert("Makai Women's Longsleeve added to cart"); //alert the user the item was added to the cart
}

//function to add Makai Mens Longsleeve to cart
function addMensSleeveToCart() {
    if (typeof (Storage) !== "undefined") { //if localStorage is available
        localStorage.setItem("mensSleeveCart", JSON.stringify(products[5])); //sets localStorage name and use JSON.stringify on product[#] as the value
        storedMensSleeveCart = JSON.parse(localStorage.getItem("mensSleeveCart")); //parses the JSON string stored in localStorage with the name usersCart

    }
    alert("Makai Men's Longsleeve added to cart"); //alert the user the item was added to the cart
}

//function to add Makai Womens Jacket to cart
function addWomensJacketToCart() {
    if (typeof (Storage) !== "undefined") { //if localStorage is available
        localStorage.setItem("womensJacketCart", JSON.stringify(products[6])); //sets localStorage name and use JSON.stringify on product[#] as the value
        storedWomensJacketCart = JSON.parse(localStorage.getItem("womensJacketCart")); //parses the JSON string stored in localStorage with the name usersCart

    }
    alert("Makai Women's Jacket added to cart"); //alert the user the item was added to the cart
}

//function to add Makai Mens Jacket to cart
function addMensJacketToChart() {
    if (typeof (Storage) !== "undefined") { //if localStorage is available
        localStorage.setItem("mensJacketCart", JSON.stringify(products[7])); //sets localStorage name and use JSON.stringify on product[#] as the value
        storedMensJacketCart = JSON.parse(localStorage.getItem("mensJacketCart")); //parses the JSON string stored in localStorage with the name usersCart

    }
    alert("Makai Men's Jacket added to cart"); //alert the user the item was added to the cart
}

//function to add Makai Hat to cart
function addHatToCart() {
    if (typeof (Storage) !== "undefined") { //if localStorage is available
        localStorage.setItem("hatCart", JSON.stringify(products[8])); //sets localStorage name and use JSON.stringify on product[#] as the value
        storedHatCart = JSON.parse(localStorage.getItem("hatCart")); //parses the JSON string stored in localStorage with the name usersCart

    }
    alert("Makai Hat added to cart"); //alert the user the item was added to the cart
}

//function to add Makai Reusable Bag to cart
function addBagToCart() {
    if (typeof (Storage) !== "undefined") { //if localStorage is available
        localStorage.setItem("bagCart", JSON.stringify(products[9])); //sets localStorage name and use JSON.stringify on product[#] as the value
        storedBagCart = JSON.parse(localStorage.getItem("bagCart")); //parses the JSON string stored in localStorage with the name usersCart

    }
    alert("Makai Reusable Bag added to cart"); //alert the user the item was added to the cart
}

//function to add Makai Key Chain to cart
function addChainToCart() {
    if (typeof (Storage) !== "undefined") { //if localStorage is available
        localStorage.setItem("chainCart", JSON.stringify(products[10])); //sets localStorage name and use JSON.stringify on product[#] as the value
        storedChainCart = JSON.parse(localStorage.getItem("chainCart")); //parses the JSON string stored in localStorage with the name usersCart

    }
    alert("Makai Key Chain added to cart"); //alert the user the item was added to the cart
}

//function to add Makai Reusable Water Bottle to cart
function addBottleToCart() {
    if (typeof (Storage) !== "undefined") { //if localStorage is available
        localStorage.setItem("bottleCart", JSON.stringify(products[11])); //sets localStorage name and use JSON.stringify on product[#] as the value
        storedBottleCart = JSON.parse(localStorage.getItem("bottleCart")); //parses the JSON string stored in localStorage with the name usersCart

    }
    alert("Makai Reusable Water Bottle added to cart"); //alert the user the item was added to the cart
}

