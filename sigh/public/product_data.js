//This file containes the JSON object for the products available in the merchandise shop.

var products = 
[
    {
        "item": "White Jersey",
        "price": 35.00,
        "image": "AMA_jersey1.jpg"
    },
    {
        "item": "Black Jersey",
        "price": 35.00,
        "image": "AMA_jersey2.png"
    },
    {
        "item": "Stickers",
        "price": 5.00,
        "image": "AMA_sticker.png"
    },
    {
        "item": "Graduation Stoles",
        "price": 35.00,
        "image": "AMA_stole.png"
    },
    {
        "item": "Sweatshirt",
        "price": 25.00,
        "image": "AMA_sweatshirt.png"
    },
]
if(typeof module != 'undefined') {
    module.exports.products = products;
  }
