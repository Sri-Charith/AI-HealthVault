// ==== Backend: utils/estimateCalories.js ====
// Mock Gemini API calorie estimation (replace with actual API call)
module.exports = async function estimateCalories(foodItem) {
    const lookup = {
      rice: 200,
      roti: 100,
      chicken: 250,
      salad: 50,
      milk: 120
    };
    return lookup[foodItem.toLowerCase()] || 150; // default fallback
  };
  