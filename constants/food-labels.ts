/**
 * Food-101 dataset class labels.
 * These map directly to the output indices of the Food-101 TFLite model.
 * The model outputs a probability distribution over these 101 classes.
 *
 * Model: MobileNetV1 0.5x trained on Food-101 (int8 quantized)
 * Input: 224x224 RGB image
 * Output: 101-class probability vector
 */
export const FOOD_LABELS: string[] = [
  "Apple Pie",
  "Baby Back Ribs",
  "Baklava",
  "Beef Carpaccio",
  "Beef Tartare",
  "Beet Salad",
  "Beignets",
  "Bibimbap",
  "Bread Pudding",
  "Breakfast Burrito",
  "Bruschetta",
  "Caesar Salad",
  "Cannoli",
  "Caprese Salad",
  "Carrot Cake",
  "Ceviche",
  "Cheesecake",
  "Cheese Plate",
  "Chicken Curry",
  "Chicken Quesadilla",
  "Chicken Wings",
  "Chocolate Cake",
  "Chocolate Mousse",
  "Churros",
  "Clam Chowder",
  "Club Sandwich",
  "Crab Cakes",
  "Creme Brulee",
  "Croque Madame",
  "Cup Cakes",
  "Deviled Eggs",
  "Donuts",
  "Dumplings",
  "Edamame",
  "Eggs Benedict",
  "Escargots",
  "Falafel",
  "Filet Mignon",
  "Fish And Chips",
  "Foie Gras",
  "French Fries",
  "French Onion Soup",
  "French Toast",
  "Fried Calamari",
  "Fried Rice",
  "Frozen Yogurt",
  "Garlic Bread",
  "Gnocchi",
  "Greek Salad",
  "Grilled Cheese Sandwich",
  "Grilled Salmon",
  "Guacamole",
  "Gyoza",
  "Hamburger",
  "Hot And Sour Soup",
  "Hot Dog",
  "Huevos Rancheros",
  "Hummus",
  "Ice Cream",
  "Lasagna",
  "Lobster Bisque",
  "Lobster Roll Sandwich",
  "Macaroni And Cheese",
  "Macarons",
  "Miso Soup",
  "Mussels",
  "Nachos",
  "Omelette",
  "Onion Rings",
  "Oysters",
  "Pad Thai",
  "Paella",
  "Pancakes",
  "Panna Cotta",
  "Peking Duck",
  "Pho",
  "Pizza",
  "Pork Chop",
  "Poutine",
  "Prime Rib",
  "Pulled Pork Sandwich",
  "Ramen",
  "Ravioli",
  "Red Velvet Cake",
  "Risotto",
  "Samosa",
  "Sashimi",
  "Scallops",
  "Seaweed Salad",
  "Shrimp And Grits",
  "Spaghetti Bolognese",
  "Spaghetti Carbonara",
  "Spring Rolls",
  "Steak",
  "Strawberry Shortcake",
  "Sushi",
  "Tacos",
  "Takoyaki",
  "Tiramisu",
  "Tuna Tartare",
  "Waffles",
];

/**
 * Check if a given label is a recognized food item.
 * Useful when using a general-purpose model (e.g. ImageNet)
 * where not all classes are food.
 */
export function isFoodLabel(label: string): boolean {
  return FOOD_LABELS.some(
    (food) => food.toLowerCase() === label.toLowerCase(),
  );
}

/**
 * Get a human-friendly display name for a food label.
 * Capitalizes properly and cleans up underscores.
 */
export function formatFoodLabel(label: string): string {
  return label
    .split(/[_\s]+/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
}

/**
 * Confidence threshold for triggering a "catch" event.
 * The model must output >= this confidence for the same class
 * across CONSECUTIVE_FRAME_THRESHOLD consecutive frames.
 */
export const CONFIDENCE_THRESHOLD = 0.85;

/**
 * Number of consecutive frames the model must detect the same
 * food item above CONFIDENCE_THRESHOLD before triggering a catch.
 */
export const CONSECUTIVE_FRAME_THRESHOLD = 5;
