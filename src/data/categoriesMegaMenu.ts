import { CategoryMenuItem } from "models/Navigation.model";

const categoriesMegaMenu: CategoryMenuItem[] = [
  {
    title: "Fresh Produce",
    child: [
      {
        title: "Fruits",
        child: [
          { title: "Apples", url: "/products/search?category=apples", icon: "Apple" },
          { title: "Berries", url: "/products/search?category=berries", icon: "Apple" },
          { title: "Citrus", url: "/products/search?category=citrus", icon: "Apple" },
          { title: "Tropical Fruits", url: "/products/search?category=tropical", icon: "Apple" },
          { title: "Stone Fruits", url: "/products/search?category=stone-fruits", icon: "Apple" },
          { title: "Melons", url: "/products/search?category=melons", icon: "Apple" }
        ]
      },
      {
        title: "Vegetables",
        child: [
          {
            title: "Leafy Greens",
            url: "/products/search?category=leafy-greens",
            icon: "TreeLeaf"
          },
          {
            title: "Root Vegetables",
            url: "/products/search?category=root-vegetables",
            icon: "TreeLeaf"
          },
          { title: "Peppers", url: "/products/search?category=peppers", icon: "TreeLeaf" },
          { title: "Tomatoes", url: "/products/search?category=tomatoes", icon: "TreeLeaf" },
          {
            title: "Onions & Garlic",
            url: "/products/search?category=onions-garlic",
            icon: "TreeLeaf"
          },
          { title: "Squash", url: "/products/search?category=squash", icon: "TreeLeaf" }
        ]
      },
      {
        title: "Herbs & Organic",
        child: [
          { title: "Fresh Herbs", url: "/products/search?category=herbs", icon: "TreeLeaf" },
          { title: "Organic Produce", url: "/products/search?category=organic", icon: "TreeLeaf" },
          { title: "Salad Kits", url: "/products/search?category=salad-kits", icon: "TreeLeaf" },
          { title: "Sprouts", url: "/products/search?category=sprouts", icon: "TreeLeaf" }
        ]
      }
    ]
  },
  {
    title: "Dairy & Eggs",
    child: [
      {
        title: "Milk & Cream",
        child: [
          { title: "Whole Milk", url: "/products/search?category=milk", icon: "Milk" },
          { title: "Skim & Low-Fat", url: "/products/search?category=skim-milk", icon: "Milk" },
          { title: "Plant-Based Milk", url: "/products/search?category=plant-milk", icon: "Milk" },
          { title: "Cream", url: "/products/search?category=cream", icon: "Milk" },
          { title: "Half & Half", url: "/products/search?category=half-and-half", icon: "Milk" }
        ]
      },
      {
        title: "Cheese",
        child: [
          { title: "Cheddar", url: "/products/search?category=cheddar", icon: "Cheese" },
          { title: "Mozzarella", url: "/products/search?category=mozzarella", icon: "Cheese" },
          { title: "Swiss & Provolone", url: "/products/search?category=swiss", icon: "Cheese" },
          {
            title: "Specialty Cheese",
            url: "/products/search?category=specialty-cheese",
            icon: "Cheese"
          },
          { title: "Cream Cheese", url: "/products/search?category=cream-cheese", icon: "Cheese" }
        ]
      },
      {
        title: "Eggs & Yogurt",
        child: [
          { title: "Eggs", url: "/products/search?category=eggs", icon: "Egg" },
          { title: "Yogurt", url: "/products/search?category=yogurt", icon: "Yogurt" },
          { title: "Butter & Margarine", url: "/products/search?category=butter", icon: "Butter" },
          { title: "Sour Cream", url: "/products/search?category=sour-cream", icon: "Milk" }
        ]
      }
    ]
  },
  {
    title: "Meat & Seafood",
    child: [
      {
        title: "Fresh Meat",
        child: [
          { title: "Beef", url: "/products/search?category=beef", icon: "Meat" },
          { title: "Chicken", url: "/products/search?category=chicken", icon: "Chicken" },
          { title: "Pork", url: "/products/search?category=pork", icon: "Meat" },
          { title: "Turkey", url: "/products/search?category=turkey", icon: "Chicken" },
          { title: "Lamb", url: "/products/search?category=lamb", icon: "Meat" }
        ]
      },
      {
        title: "Seafood",
        child: [
          { title: "Fresh Fish", url: "/products/search?category=fish", icon: "Fish" },
          { title: "Shellfish", url: "/products/search?category=shellfish", icon: "Fish" },
          { title: "Salmon", url: "/products/search?category=salmon", icon: "Fish" },
          { title: "Shrimp", url: "/products/search?category=shrimp", icon: "Fish" },
          { title: "Frozen Seafood", url: "/products/search?category=frozen-seafood", icon: "Fish" }
        ]
      },
      {
        title: "Deli & Prepared",
        child: [
          { title: "Deli Meat", url: "/products/search?category=deli-meat", icon: "Meat" },
          { title: "Hot Dogs", url: "/products/search?category=hot-dogs", icon: "Meat" },
          { title: "Bacon & Sausage", url: "/products/search?category=bacon", icon: "Meat" },
          { title: "Prepared Meals", url: "/products/search?category=prepared-meals", icon: "Meal" }
        ]
      }
    ]
  },
  {
    title: "Bakery & Bread",
    child: [
      {
        title: "Fresh Bakery",
        child: [
          { title: "Artisan Bread", url: "/products/search?category=artisan-bread", icon: "Bread" },
          {
            title: "Sandwich Bread",
            url: "/products/search?category=sandwich-bread",
            icon: "Bread"
          },
          { title: "Rolls & Buns", url: "/products/search?category=rolls", icon: "Bread" },
          { title: "Bagels", url: "/products/search?category=bagels", icon: "Bread" },
          {
            title: "English Muffins",
            url: "/products/search?category=english-muffins",
            icon: "Bread"
          }
        ]
      },
      {
        title: "Pastries & Desserts",
        child: [
          { title: "Cakes", url: "/products/search?category=cakes", icon: "Cake" },
          { title: "Cookies", url: "/products/search?category=cookies", icon: "Cookie" },
          { title: "Pies", url: "/products/search?category=pies", icon: "Cake" },
          { title: "Donuts", url: "/products/search?category=donuts", icon: "Donut" },
          { title: "Muffins", url: "/products/search?category=muffins", icon: "Cupcake" }
        ]
      },
      {
        title: "Specialty Items",
        child: [
          { title: "Tortillas", url: "/products/search?category=tortillas", icon: "Bread" },
          { title: "Pita Bread", url: "/products/search?category=pita", icon: "Bread" },
          { title: "Crackers", url: "/products/search?category=crackers", icon: "Cracker" },
          { title: "Breadcrumbs", url: "/products/search?category=breadcrumbs", icon: "Bread" }
        ]
      }
    ]
  },
  {
    title: "Frozen Foods",
    child: [
      {
        title: "Frozen Meals",
        child: [
          { title: "Frozen Pizza", url: "/products/search?category=frozen-pizza", icon: "Pizza" },
          {
            title: "Frozen Dinners",
            url: "/products/search?category=frozen-dinners",
            icon: "Meal"
          },
          {
            title: "Frozen Breakfast",
            url: "/products/search?category=frozen-breakfast",
            icon: "Breakfast"
          },
          {
            title: "Frozen Appetizers",
            url: "/products/search?category=frozen-appetizers",
            icon: "Snack"
          }
        ]
      },
      {
        title: "Frozen Vegetables & Fruits",
        child: [
          {
            title: "Frozen Vegetables",
            url: "/products/search?category=frozen-vegetables",
            icon: "TreeLeaf"
          },
          { title: "Frozen Fruits", url: "/products/search?category=frozen-fruits", icon: "Apple" },
          {
            title: "Frozen Potatoes",
            url: "/products/search?category=frozen-potatoes",
            icon: "Potato"
          }
        ]
      },
      {
        title: "Ice Cream & Desserts",
        child: [
          { title: "Ice Cream", url: "/products/search?category=ice-cream", icon: "IceCream" },
          {
            title: "Frozen Yogurt",
            url: "/products/search?category=frozen-yogurt",
            icon: "IceCream"
          },
          {
            title: "Frozen Desserts",
            url: "/products/search?category=frozen-desserts",
            icon: "Cake"
          },
          { title: "Popsicles", url: "/products/search?category=popsicles", icon: "IceCream" }
        ]
      }
    ]
  },
  {
    title: "Beverages",
    child: [
      {
        title: "Water & Soft Drinks",
        child: [
          { title: "Bottled Water", url: "/products/search?category=water", icon: "Water" },
          { title: "Soft Drinks", url: "/products/search?category=soda", icon: "Soda" },
          {
            title: "Sparkling Water",
            url: "/products/search?category=sparkling-water",
            icon: "Water"
          },
          { title: "Energy Drinks", url: "/products/search?category=energy-drinks", icon: "Soda" }
        ]
      },
      {
        title: "Juice & Coffee",
        child: [
          { title: "Juice", url: "/products/search?category=juice", icon: "Juice" },
          { title: "Coffee", url: "/products/search?category=coffee", icon: "Coffee" },
          { title: "Tea", url: "/products/search?category=tea", icon: "Tea" },
          { title: "Hot Chocolate", url: "/products/search?category=hot-chocolate", icon: "Coffee" }
        ]
      },
      {
        title: "Wine & Beer",
        child: [
          { title: "Wine", url: "/products/search?category=wine", icon: "Wine" },
          { title: "Beer", url: "/products/search?category=beer", icon: "Beer" },
          { title: "Spirits", url: "/products/search?category=spirits", icon: "Wine" },
          { title: "Mixers", url: "/products/search?category=mixers", icon: "Soda" }
        ]
      }
    ]
  },
  {
    title: "Pantry Essentials",
    child: [
      {
        title: "Canned Goods",
        child: [
          { title: "Soups", url: "/products/search?category=soups", icon: "Soup" },
          { title: "Vegetables", url: "/products/search?category=canned-vegetables", icon: "Can" },
          { title: "Beans", url: "/products/search?category=beans", icon: "Can" },
          { title: "Tomatoes", url: "/products/search?category=canned-tomatoes", icon: "Can" }
        ]
      },
      {
        title: "Pasta & Rice",
        child: [
          { title: "Pasta", url: "/products/search?category=pasta", icon: "Pasta" },
          { title: "Rice", url: "/products/search?category=rice", icon: "Rice" },
          { title: "Noodles", url: "/products/search?category=noodles", icon: "Pasta" },
          { title: "Quinoa & Grains", url: "/products/search?category=grains", icon: "Rice" }
        ]
      },
      {
        title: "Condiments & Sauces",
        child: [
          { title: "Ketchup & Mustard", url: "/products/search?category=ketchup", icon: "Sauce" },
          { title: "Mayonnaise", url: "/products/search?category=mayo", icon: "Sauce" },
          { title: "Salad Dressing", url: "/products/search?category=dressing", icon: "Sauce" },
          { title: "BBQ & Hot Sauce", url: "/products/search?category=hot-sauce", icon: "Sauce" }
        ]
      }
    ]
  }
];

export default categoriesMegaMenu;
