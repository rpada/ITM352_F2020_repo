var all = [
   //bath product 1
   {
      //Product 1
  "name": "Appa",
  "price": 4.00,
  "image": "/images/appa.png", // image is from en route jewelry webiste//
  
  },
   //home product 2
   {
      //Product 1
  "name": "Bold and Brash",
  "price": 5.00,
  "image": "/images/boldandbrash.png", // image is from en route jewelry webiste//
  
  },
   //home product 3
        //Product 1
      {  "name": "Black Parade",
        "price": 4.00,
        "image": "images/blackparade.png", // image is from en route jewelry webiste//
        
        },
   //home product 4
   {
   "name": "Poison Apples",
   "price": 10.00,
   "image": "./images/poisonapple.png"
   },
   {
      "name": "Sun and Moon Tarot",
      "price": 4.00,
      "image": "./images/tarot.png"
  },
   //extra product 2
   {
      "name": "Milk",
      "price": 4.00,
      "image": "./images/milk.png"
      },  
   //extra product 3
   {
   "name": "Stars",
   "price": 4.00,
   "image": "./images/stars.png"
   },
   //extra product 4
   {
   "name": "Strawberries",
   "price": 5.00,
   "image": "./images/strawberries.png"
   },
   {
      "name": "Isabelle",
      "price": 4.00,
      "image": "./images/isabelle.png"
      },
   //kitchen product 2
   {
      "name": "Tom Nook",
      "price": 5.00,
      "image": "./images/tomnook.png"
      },  
   //kitchen product 3
   {
   "name": "Master Swords",
   "price": 10.00,
   "image": "./images/swords.png"
   },
   {
      "name": "Candy Corn",
      "price": 4.00,
      "image": "./images/candycorn.png" 
      },
   //kits product 2
   {
      "name": "Pumpkin",
      "price": 5.00,
      "image": "./images/pumpkin.png" 
      },
   //kits product 3
   {
      "name": "Ghosts",
      "price": 6.00,
      "image": "./images/ghosts.png" 
      },
   //kits product 4
   {
      "name": "Christmas Trees",
      "price": 6.00,
      "image": "./images/xmastrees.png" 
      },
   //kits product 5
   {
      "name": "Easter Bunnies",
      "price": 4.00,
      "image": "./images/easterbunny.png" 
      } 
]
var tvmovie = [
   {
      //Product 1
  "name": "Appa",
  "price": 4.00,
  "image": "/images/appa.png", // image is from en route jewelry webiste//
  
  },
   //home product 2
   {
      //Product 1
  "name": "Bold and Brash",
  "price": 5.00,
  "image": "/images/boldandbrash.png", // image is from en route jewelry webiste//
  
  },
   //home product 3
        //Product 1
      {  "name": "Black Parade",
        "price": 4.00,
        "image": "images/blackparade.png", // image is from en route jewelry webiste//
        
        },
   //home product 4
   {
   "name": "Snow White Poison Apples",
   "price": 10.00,
   "image": "./images/poisonapple.png"
   }
   //home product 5
]
var videogame = [
   //kitchen product 1
   {
      "name": "Isabelle (Animal Crossing)",
      "price": 4.00,
      "image": "./images/isabelle.png"
      },
   //kitchen product 2
   {
      "name": "Tom Nook (Animal Crossing)",
      "price": 5.00,
      "image": "./images/tomnook.png"
      },  
   //kitchen product 3
   {
   "name": "Master Swords (The Legend of Zelda)",
   "price": 10.00,
   "image": "./images/swords.png"
   }
]
var holiday = [
   //kits product 1
   {
      "name": "Candy Corn",
      "price": 4.00,
      "image": "./images/candycorn.png" 
      },
   //kits product 2
   {
      "name": "Pumpkin",
      "price": 5.00,
      "image": "./images/pumpkin.png" 
      },
   //kits product 3
   {
      "name": "Ghosts",
      "price": 6.00,
      "image": "./images/ghosts.png" 
      },
   //kits product 4
   {
      "name": "Christmas Trees",
      "price": 6.00,
      "image": "./images/xmastrees.png" 
      },
   //kits product 5
   {
      "name": "Easter Bunnies",
      "price": 4.00,
      "image": "./images/easterbunny.png" 
      } 
]
var objectfood = [
   //extra product 1
   {
      "name": "Sun and Moon Tarot",
      "price": 4.00,
      "image": "./images/tarot.png"
  },
   //extra product 2
   {
      "name": "Milk",
      "price": 4.00,
      "image": "./images/milk.png"
      },  
   //extra product 3
   {
   "name": "Stars",
   "price": 4.00,
   "image": "./images/stars.png"
   },
   //extra product 4
   {
   "name": "Strawberries",
   "price": 5.00,
   "image": "./images/strawberries.png"
   }
]
var products = {
   "all": all,
   "tvmovie": tvmovie,
   "videogame": videogame,
   "holiday": holiday, 
   "objectfood": objectfood
}
if (typeof module != 'undefined') {
   module.exports.products = products;
 }