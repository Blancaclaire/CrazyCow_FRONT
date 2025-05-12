const express = require('express');
const cors = require('cors');
const app = express();
const path = require('path');
app.use(cors());
app.use(express.json())
const port = 3000;

//Configuracion para servir imagenes 
app.use('/imagenes', express.static(path.join(__dirname, '../imagenes')));

const data = {

  //ids del 1 al 15
  burgers: [
    {
      id: 1,
      name: "Paca BBQ",
      description: "A smoky and sweet explosion of flavor with irresistible bacon and BBQ sauce.",
      ingredients: ["bun", "beef patty", "bacon", "cheddar cheese", "BBQ sauce"],
      image: "../imagenes/burguer2.png",
      allergens: ["gluten", "dairy"],
      price: 11.99
    },
    {
      id: 2,
      name: "Spicy Cow",
      description: "Just the right touch of spiciness with jalapeños to awaken your senses.",
      ingredients: ["bun", "beef patty", "jalapeños", "lettuce", "cheddar cheese"],
      image: "../imagenes/burguer4.png",
      allergens: ["gluten", "dairy"],
      price: 10.99
    },
    {
      id: 3,
      name: "Double Cow Deluxe",
      description: "For meat lovers: double the pleasure in every bite.",
      ingredients: ["bun", "double beef patty", "lettuce", "Swiss cheese", "caramelized onions"],
      image: "../imagenes/burguer1.png",
      allergens: ["gluten", "dairy"],
      price: 13.99
    },
    {
      id: 4,
      name: "Paca Rancher",
      description: "A ranch classic with a delightful mix of fresh flavors.",
      ingredients: ["bun", "beef patty", "ranch sauce", "cheddar cheese", "tomato"],
      image: "../imagenes/burguer3.png",
      allergens: ["gluten", "dairy"],
      price: 10.99
    },
    {
      id: 5,
      name: "Veggie Paca",
      description: "The perfect veggie option, fresh and delicious.",
      ingredients: ["bun", "veggie burger patty", "lettuce", "tomato", "onion"],
      image: "../imagenes/burguer5.png",
      allergens: ["gluten"],
      price: 10.49
    },
    {
      id: 6,
      name: "Moozarella Supreme",
      description: "A gourmet experience with the creamy touch of mozzarella.",
      ingredients: ["bun", "beef patty", "mozzarella cheese", "pesto sauce", "arugula"],
      image: "../imagenes/burguer7.png",
      allergens: ["gluten", "dairy"],
      price: 12.49
    },
    {
      id: 7,
      name: "Tender Classic",
      description: "Simple and nostalgic, like a good classic burger should be.",
      ingredients: ["bun", "beef patty", "cheddar cheese", "ketchup", "mustard", "pickles"],
      image: "../imagenes/burguer6.png",
      allergens: ["gluten", "dairy"],
      price: 9.99
    },
    {
      id: 8,
      name: "Mediterranean Paca",
      description: "A trip to the Mediterranean in every bite.",
      ingredients: ["bun", "lamb patty", "feta cheese", "sun-dried tomatoes", "olives"],
      image: "../imagenes/burguer16.png",
      allergens: ["gluten", "dairy"],
      price: 12.99
    },
    {
      id: 9,
      name: "Smoked Cow",
      description: "Smoky and delicious, perfect for a special touch.",
      ingredients: ["bun", "smoked beef patty", "gouda cheese", "red onion", "mustard sauce"],
      image: "../imagenes/burguer10.png",
      allergens: ["gluten", "dairy"],
      price: 11.99
    },
    {
      id: 10,
      name: "Tropical Paca",
      description: "Sweet and savory, with a tropical explosion thanks to pineapple.",
      ingredients: ["bun", "beef patty", "pineapple", "cheddar cheese", "teriyaki sauce"],
      image: "../imagenes/burguer11.png",
      allergens: ["gluten", "dairy"],
      price: 11.49
    },
    {
      id: 11,
      name: "Mooo Mexican",
      description: "Packed with Mexican flavor with guacamole and jalapeños.",
      ingredients: ["bun", "beef patty", "guacamole", "beans", "jalapeños", "cheddar cheese"],
      image: "../imagenes/burguer12.png",
      allergens: ["gluten", "dairy"],
      price: 11.99
    },
    {
      id: 12,
      name: "Truffle Paca",
      description: "Elegant and refined, with the unmistakable aroma of truffle.",
      ingredients: ["bun", "beef patty", "brie cheese", "truffle sauce", "arugula"],
      image: "../imagenes/burguer13.png",
      allergens: ["gluten", "dairy"],
      price: 14.99
    },
    {
      id: 13,
      name: "The Shepherd",
      description: "A burger with pastoral inspiration, fresh and aromatic.",
      ingredients: ["bun", "lamb patty", "mint", "feta cheese", "tzatziki sauce"],
      image: "../imagenes/burguer14.png",
      allergens: ["gluten", "dairy"],
      price: 13.49
    },
    {
      id: 14,
      name: "Asian Cow",
      description: "Exotic with a touch of the Orient in every bite.",
      ingredients: ["bun", "beef patty", "soy sauce", "coleslaw", "ginger"],
      image: "../imagenes/burguer15.png",
      allergens: ["gluten"],
      price: 11.49
    },
    {
      id: 15,
      name: "Texan Paca",
      description: "The rustic flavor of the Wild West in a delicious bite.",
      ingredients: ["bun", "beef patty", "cheddar cheese", "onion rings", "BBQ sauce"],
      image: "../imagenes/burguer2.png",
      allergens: ["gluten", "dairy"],
      price: 11.99
    }
  ],

  //ids del 16 al 25
  desserts: [
    {

      id: 16,
      name: "Bacon Sundae",
      description: "A sweet and savory treat featuring vanilla ice cream topped with fries and caramel drizzle.",
      ingredients: ["vanilla ice cream", "french fries", "caramel sauce"],
      image: "../imagenes/postre11.png",
      allergens: ["dairy", "gluten"],
      price: 6.99
    },
    {
      id: 17,
      name: "Cookie Delight",
      description: "A creamy dessert cup filled with vanilla ice cream and chocolate chip cookie pieces.",
      ingredients: ["vanilla ice cream", "chocolate chip cookies", "chocolate sauce"],
      image: "../imagenes/postre10.png",
      allergens: ["dairy", "gluten", "eggs"],
      price: 5.99
    },
    {
      id: 18,
      name: "Berry Cheesecake",
      description: "Smooth cheesecake topped with a fresh raspberry and graham cracker crust.",
      ingredients: ["cream cheese", "sugar", "graham cracker crust", "raspberry"],
      image: "../imagenes/postre9.png",
      allergens: ["dairy", "gluten"],
      price: 7.49
    },
    {
      id: 19,
      name: "Matcha Cheesecake",
      description: "Japanese-inspired green tea cheesecake served on a green plate.",
      ingredients: ["cream cheese", "matcha powder", "sugar", "graham cracker crust"],
      image: "../imagenes/postre7.png",
      allergens: ["dairy", "gluten"],
      price: 7.99
    },
    {
      id: 20,
      name: "Mango Cheesecake",
      description: "Creamy cheesecake topped with fresh mango slices and mango sauce.",
      ingredients: ["cream cheese", "sugar", "graham cracker crust", "mango"],
      image: "../imagenes/postre8.png",
      allergens: ["dairy", "gluten"],
      price: 7.49
    },
    {
      id: 21,
      name: "Berry Pancakes",
      description: "Fluffy pancakes topped with mixed berries, banana slices, and maple syrup.",
      ingredients: ["pancake batter", "mixed berries", "banana", "maple syrup", "powdered sugar"],
      image: "../imagenes/postre5.png",
      allergens: ["gluten", "dairy", "eggs"],
      price: 8.99
    },
    {
      id: 22,
      name: "Blueberry Cheesecake",
      description: "Rich cheesecake with blueberry topping and graham cracker crust.",
      ingredients: ["cream cheese", "sugar", "graham cracker crust", "blueberries"],
      image: "../imagenes/postre6.png",
      allergens: ["dairy", "gluten"],
      price: 7.49
    },
    {
      id: 23,
      name: "Strawberry Milkshake",
      description: "Creamy pink strawberry milkshake topped with whipped cream.",
      ingredients: ["milk", "strawberry syrup", "vanilla ice cream", "whipped cream"],
      image: "../imagenes/postre4.png",
      allergens: ["dairy"],
      price: 5.49
    },
    {
      id: 24,
      name: "Caramel Milkshake",
      description: "Rich caramel-flavored milkshake perfect for satisfying your sweet tooth.",
      ingredients: ["milk", "caramel syrup", "vanilla ice cream", "whipped cream"],
      image: "../imagenes/postre3.png",
      allergens: ["dairy"],
      price: 5.49
    },
    {
      id: 25,
      name: "Green Smoothie",
      description: "Healthy green smoothie packed with nutrients and fresh flavor.",
      ingredients: ["spinach", "kiwi", "green apple", "banana", "yogurt"],
      image: "../imagenes/postre2.png",
      allergens: ["dairy"],
      price: 6.49
    }
  ],

  //ids del 26 al 37
  forBitting: [
    {
      id: 26,
      name: "Cheese Fries",
      description: "Golden french fries smothered in melted cheese sauce.",
      ingredients: ["potatoes", "cheese sauce", "vegetable oil"],
      image: "../imagenes/picoteo16.png",
      allergens: ["dairy"],
      price: 5.99
    },
    {
      id: 27,
      name: "Spring Rolls",
      description: "Crispy spring rolls served with sweet chili dipping sauce.",
      ingredients: ["spring roll wrappers", "vegetables", "vegetable oil", "sweet chili sauce"],
      image: "../imagenes/picoteo15.png",
      allergens: ["gluten"],
      price: 6.99
    },
    {
      id: 28,
      name: "Mozzarella Sticks",
      description: "Breaded and fried mozzarella sticks served with marinara dipping sauce.",
      ingredients: ["mozzarella cheese", "breadcrumbs", "vegetable oil", "marinara sauce"],
      image: "../imagenes/picoteo14.png",
      allergens: ["dairy", "gluten"],
      price: 7.49
    },
    {
      id: 29,
      name: "Classic French Fries",
      description: "Perfectly crispy golden french fries.",
      ingredients: ["potatoes", "vegetable oil", "salt"],
      image: "../imagenes/picoteo12.png",
      allergens: [],
      price: 3.99
    },
    {
      id: 30,
      name: "Shoestring Fries",
      description: "Thin-cut shoestring fries served in a black bowl.",
      ingredients: ["potatoes", "vegetable oil", "salt"],
      image: "../imagenes/picoteo13.png",
      allergens: [],
      price: 3.99
    },
    {
      id: 31,
      name: "Loaded Nachos",
      description: "Crispy tortilla chips topped with cheese, jalapeños, and dipping sauces.",
      ingredients: ["tortilla chips", "cheese", "jalapeños", "salsa", "sour cream"],
      image: "../imagenes/picoteo7.png",
      allergens: ["dairy", "gluten"],
      price: 8.99
    },
    {
      id: 32,
      name: "Seasoned Fries",
      description: "Golden french fries tossed in special seasoning.",
      ingredients: ["potatoes", "vegetable oil", "special seasoning blend"],
      image: "../imagenes/picoteo11.png",
      allergens: [],
      price: 4.49
    },
    {
      id: 33,
      name: "Mini Hot Dogs",
      description: "Mini sausages served with dipping sauce on a green plate.",
      ingredients: ["mini sausages", "vegetable oil", "ketchup"],
      image: "../imagenes/picoteo8.png",
      allergens: ["meat"],
      price: 6.99
    },
    {
      id: 34,
      name: "Chicken Nuggets",
      description: "Crispy chicken nuggets served with two dipping sauces.",
      ingredients: ["chicken", "breadcrumbs", "vegetable oil", "ketchup", "mustard"],
      image: "../imagenes/picoteo9.png",
      allergens: ["gluten"],
      price: 7.49
    },
    {
      id: 35,
      name: "Onion Rings",
      description: "Crispy battered onion rings.",
      ingredients: ["onions", "batter", "vegetable oil"],
      image: "../imagenes/picoteo10.png",
      allergens: ["gluten"],
      price: 4.99
    },
    {
      id: 36,
      name: "Appetizer Sampler",
      description: "Assorted fried appetizers including onion rings and cheese balls with dipping sauces.",
      ingredients: ["onion rings", "cheese balls", "breadcrumbs", "vegetable oil", "dipping sauces"],
      image: "../imagenes/picoteo6.png",
      allergens: ["dairy", "gluten"],
      price: 12.99
    },
    {
      id: 37,
      name: "Specialty Fries",
      description: "Dark-colored specialty fries with unique seasoning.",
      ingredients: ["potatoes", "vegetable oil", "special seasoning blend", "herbs"],
      image: "../imagenes/picoteo5.png",
      allergens: [],
      price: 4.99
    }
  ],

  //ids del 38 al 46
  drinks: [
    //drinks
    {
      id: 38,
      name: "Draft Beer",
      description: "Refreshing golden draft beer served in a chilled mug.",
      ingredients: ["barley", "hops", "water", "yeast"],
      image: "../imagenes/bebida7.png",
      allergens: ["gluten"],
      price: 4.99
    },
    {
      id: 39,
      name: "Cola Bottle",
      description: "Classic cola in an iconic glass bottle.",
      ingredients: ["carbonated water", "high fructose corn syrup", "caramel color", "phosphoric acid", "natural flavors"],
      image: "../imagenes/bebida4.png",
      allergens: [],
      price: 2.99
    },
    {
      id: 40,
      name: "Cranberry Spritzer",
      description: "Refreshing cranberry juice cocktail with a splash of soda.",
      ingredients: ["cranberry juice", "soda water", "lime", "ice"],
      image: "../imagenes/bebida6.png",
      allergens: [],
      price: 3.99
    },
    {
      id: 41,
      name: "Sunset Iced Tea",
      description: "Vibrant layered iced tea with citrus and grenadine.",
      ingredients: ["iced tea", "orange juice", "grenadine", "ice"],
      image: "../imagenes/bebida2.png",
      allergens: [],
      price: 4.49
    },
    {
      id: 42,
      name: "Cream Soda",
      description: "Smooth and creamy vanilla soda with ice.",
      ingredients: ["carbonated water", "cream extract", "vanilla", "sugar", "ice"],
      image: "../imagenes/bebida5.png",
      allergens: [],
      price: 3.49
    },
    {
      id: 43,
      name: "Classic Cola",
      description: "Traditional cola in a glass bottle.",
      ingredients: ["carbonated water", "high fructose corn syrup", "caramel color", "phosphoric acid", "natural flavors"],
      image: "../imagenes/bebida3.png",
      allergens: [],
      price: 2.99
    },
    {
      id: 44,
      name: "Amber Ale",
      description: "Rich amber-colored ale with a smooth finish.",
      ingredients: ["barley", "hops", "water", "yeast"],
      image: "../imagenes/bebida8.png",
      allergens: ["gluten"],
      price: 5.49
    },
    {
      id: 45,
      name: "Strawberry Lemonade",
      description: "Sweet and tangy lemonade infused with fresh strawberries.",
      ingredients: ["lemon juice", "strawberries", "sugar", "water", "ice"],
      image: "../imagenes/bebida9.png",
      allergens: [],
      price: 4.49
    },
    {
      id: 46,
      name: "Root Beer Float",
      description: "Classic root beer with a scoop of vanilla ice cream.",
      ingredients: ["root beer", "vanilla ice cream"],
      image: "../imagenes/bebida1.png",
      allergens: ["dairy"],
      price: 5.99
    }
  ]
};




app.get('/burgers', (req, res) => {
  res.json(data.burgers);
});

app.get('/desserts', (req, res) => {
  res.json(data.desserts);
}
);

app.get('/forBiting', (req, res) => {
  res.json(data.forBitting);
});

app.get('/drinks', (req, res) => {
  res.json(data.drinks);
});





app.listen(port, () => {
  console.log(`API funcionando en http://localhost:${port}`);
  console.log(`Rutas disponibles:`);
  console.log(`- http://localhost:${port}/burgers`);
  console.log(`- http://localhost:${port}/desserts`);
  console.log(`- http://localhost:${port}/forBitting`);
  console.log(`- http://localhost:${port}/drinks`);
});



// EMPLOYEE REGISTER

//Employee data in JSON
const employees = {
  employees: []
};

// Endpoint to register an employee
app.post('/register', (req, res) => {
  const { username, password, email } = req.body;

  //Check all data are present
  if (!username || !password || !email) {
    return res.status(400).json({ message: "All fields are required" });
  }

  // Add to temp JSON of employees
  const newEmployee = {
    id: employees.employees.length + 1, // Assign a unique ID
    username,
    password,
    email
  };
  employees.employees.push(newEmployee);

  res.status(201).json({ message: "User registered successfully", employee: newEmployee });
});



// Endpoint to login
app.post('/login', (req, res) => {
  const { email, password } = req.body;


  // Check that email and passaword  are present
  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }


  //  Search if the emails exists among employees
  employees.employees.forEach(emp => {
    if (emp.email === email) {
      employee = emp; // If email input matches with the email of an employee, then is an employee
    }

  });

  if (!employee) {
    //If the email doesn´t exist
    return res.status(404).json({ message: "User not found" });
  }

  //Check if email and password matches
  if (employee.password !== password) {
    return res.status(401).json({ message: "Invalid password" });
  }

  //Check  that everything is correct

  const loginSuccess = employee && emmployee.password === password;
  if (!loginSuccess) {
    return res.status(500).json({ message: "Unexpected error during login" })
  }
  else {
    return res.status(200).json({ message: "Login successful", employee });
  }


});

