export type CategoryIconOption = {
  label: string;
  value: string;
  tags: string[];
};

export type CategoryImageOption = {
  label: string;
  value: string;
  tags: string[];
};

export const CATEGORY_ICON_OPTIONS: CategoryIconOption[] = [
  { label: "Fruits", value: "🍎", tags: ["parent", "fruits", "fresh"] },
  { label: "Apples", value: "🍎", tags: ["fruits", "apples", "child"] },
  { label: "Bananas", value: "🍌", tags: ["fruits", "bananas", "child"] },
  { label: "Berries", value: "🫐", tags: ["fruits", "berries", "child"] },
  { label: "Citrus", value: "🍊", tags: ["fruits", "citrus", "child"] },
  { label: "Tropical Fruits", value: "🥭", tags: ["fruits", "tropical", "child"] },

  { label: "Vegetables", value: "🥕", tags: ["parent", "vegetables", "fresh"] },
  { label: "Leafy Greens", value: "🥬", tags: ["vegetables", "leafy", "child"] },
  { label: "Root Vegetables", value: "🥔", tags: ["vegetables", "root", "child"] },
  { label: "Mushrooms", value: "🍄", tags: ["vegetables", "mushrooms", "child"] },
  { label: "Peppers", value: "🌶️", tags: ["vegetables", "peppers", "child"] },
  { label: "Tomatoes", value: "🍅", tags: ["vegetables", "tomatoes", "child"] },

  { label: "Dairy & Eggs", value: "🥛", tags: ["parent", "dairy", "eggs"] },
  { label: "Milk", value: "🥛", tags: ["dairy", "milk", "child"] },
  { label: "Cheese", value: "🧀", tags: ["dairy", "cheese", "child"] },
  { label: "Yogurt", value: "🥣", tags: ["dairy", "yogurt", "child"] },
  { label: "Butter", value: "🧈", tags: ["dairy", "butter", "child"] },
  { label: "Eggs", value: "🥚", tags: ["dairy", "eggs", "child"] },

  { label: "Meat & Seafood", value: "🥩", tags: ["parent", "meat", "seafood"] },
  { label: "Beef", value: "🥩", tags: ["meat", "beef", "child"] },
  { label: "Chicken", value: "🍗", tags: ["meat", "chicken", "child"] },
  { label: "Pork", value: "🍖", tags: ["meat", "pork", "child"] },
  { label: "Fish", value: "🐟", tags: ["seafood", "fish", "child"] },
  { label: "Shellfish", value: "🦐", tags: ["seafood", "shellfish", "child"] },

  { label: "Bakery", value: "🍞", tags: ["parent", "bakery", "bread"] },
  { label: "Bread", value: "🍞", tags: ["bakery", "bread", "child"] },
  { label: "Cakes", value: "🍰", tags: ["bakery", "cakes", "child"] },
  { label: "Pastries", value: "🥐", tags: ["bakery", "pastries", "child"] },
  { label: "Cookies", value: "🍪", tags: ["bakery", "cookies", "child"] },

  { label: "Beverages", value: "🥤", tags: ["parent", "beverages", "drinks"] },
  { label: "Water", value: "💧", tags: ["beverages", "water", "child"] },
  { label: "Juice", value: "🧃", tags: ["beverages", "juice", "child"] },
  { label: "Soda", value: "🥤", tags: ["beverages", "soda", "child"] },
  { label: "Coffee", value: "☕", tags: ["beverages", "coffee", "child"] },
  { label: "Tea", value: "🍵", tags: ["beverages", "tea", "child"] },

  { label: "Pantry", value: "🥫", tags: ["parent", "pantry", "staples"] },
  { label: "Rice & Grains", value: "🍚", tags: ["pantry", "rice", "grains", "child"] },
  { label: "Pasta & Noodles", value: "🍝", tags: ["pantry", "pasta", "noodles", "child"] },
  { label: "Canned Food", value: "🥫", tags: ["pantry", "canned", "child"] },
  { label: "Sauces", value: "🍯", tags: ["pantry", "sauces", "child"] },
  { label: "Cooking Oil", value: "🫒", tags: ["pantry", "cooking", "oil", "child"] },

  { label: "Frozen Foods", value: "🧊", tags: ["parent", "frozen", "foods"] },
  {
    label: "Frozen Vegetables",
    value: "🧊",
    tags: ["frozen", "vegetables", "child"]
  },
  { label: "Frozen Meat", value: "🥩", tags: ["frozen", "meat", "child"] },
  { label: "Ice Cream", value: "🍨", tags: ["frozen", "ice", "cream", "child"] },
  { label: "Frozen Meals", value: "🍱", tags: ["frozen", "meals", "child"] },

  { label: "Snacks", value: "🍿", tags: ["parent", "snacks", "quick"] },
  { label: "Chips", value: "🍟", tags: ["snacks", "chips", "child"] },
  { label: "Nuts", value: "🥜", tags: ["snacks", "nuts", "child"] },
  { label: "Chocolate", value: "🍫", tags: ["snacks", "chocolate", "child"] },
  { label: "Candy", value: "🍬", tags: ["snacks", "candy", "child"] },

  { label: "Organic", value: "🌿", tags: ["parent", "organic", "healthy"] },
  { label: "Organic Fruits", value: "🍏", tags: ["organic", "fruits", "child"] },
  {
    label: "Organic Vegetables",
    value: "🥦",
    tags: ["organic", "vegetables", "child"]
  },
  { label: "Gluten Free", value: "🌾", tags: ["organic", "gluten free", "child"] },
  { label: "Vegan", value: "🌱", tags: ["organic", "vegan", "child"] }
];

function emojiToTwemojiUrl(emoji: string): string {
  const codePoints = Array.from(emoji)
    .map((char) => char.codePointAt(0)?.toString(16))
    .filter((cp): cp is string => Boolean(cp) && cp !== "fe0f")
    .join("-");

  return `https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/72x72/${codePoints}.png`;
}

export const CATEGORY_IMAGE_OPTIONS: CategoryImageOption[] = CATEGORY_ICON_OPTIONS.map((item) => ({
  label: item.label,
  value: emojiToTwemojiUrl(item.value),
  tags: [...item.tags]
}));
