// utils/geminiService.js
const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

/**
 * Get AI recommendations based on user data
 * @param {string} category - 'diet', 'sleep', 'fitness', 'medication'
 * @param {object} userData - User's health data for the category
 * @param {object} userProfile - User profile information (goals, age, gender, etc.)
 * @returns {Promise<string>} AI-generated recommendations
 */
const getAIRecommendations = async (category, userData, userProfile = {}) => {
  try {
    if (!process.env.GEMINI_API_KEY) {
      throw new Error('GEMINI_API_KEY is not set in environment variables');
    }

    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

    let prompt = '';
    
    switch (category) {
      case 'diet':
        prompt = `You are a professional nutritionist. Analyze the following diet data and provide personalized, actionable recommendations in a friendly, encouraging tone. Keep recommendations concise (3-5 bullet points) and practical.

User Profile: ${userProfile.goals ? `Goals: ${userProfile.goals.join(', ')}` : 'Not specified'}
Daily Calorie Target: ${userData.dailyTarget || 2000} kcal
Current Intake: ${userData.totalCalories || 0} kcal
Food Items Logged Today: ${JSON.stringify(userData.foodItems || [])}
Remaining Calories: ${userData.remaining || 0} kcal

Provide specific, actionable recommendations based on this data. Focus on:
- Whether they're meeting their calorie goals
- Nutritional balance suggestions
- Healthy food alternatives
- Meal timing recommendations
- Portion control tips

Format as a friendly, encouraging message with bullet points.`;
        break;

      case 'sleep':
        prompt = `You are a sleep specialist. Analyze the following sleep data and provide personalized, actionable recommendations in a friendly, encouraging tone. Keep recommendations concise (3-5 bullet points).

User Profile: ${userProfile.goals ? `Goals: ${userProfile.goals.join(', ')}` : 'Not specified'}
Sleep Data: ${JSON.stringify(userData)}
Sleep Duration: ${userData.duration || 'Not logged'} hours
Bedtime: ${userData.bedtime || 'Not logged'}
Wake Time: ${userData.wakeTime || 'Not logged'}
Monthly Goal: ${userData.monthlyGoal || 'Not set'} hours

Provide specific, actionable recommendations based on this data. Focus on:
- Sleep quality improvements
- Sleep schedule optimization
- Sleep hygiene tips
- Circadian rhythm alignment
- Restful sleep practices

Format as a friendly, encouraging message with bullet points.`;
        break;

      case 'fitness':
        prompt = `You are a fitness coach. Analyze the following fitness data and provide personalized, actionable recommendations in a friendly, encouraging tone. Keep recommendations concise (3-5 bullet points).

User Profile: ${userProfile.goals ? `Goals: ${userProfile.goals.join(', ')}` : 'Not specified'}
Steps Walked: ${userData.stepsWalked || 0} / ${userData.target || 1000}
Workout Type: ${userData.workoutType || 'Not set'}
Exercises Logged: ${userData.exercises?.length || 0}
Total Volume: ${userData.totalVolume || 0} kg
Exercise Details: ${JSON.stringify(userData.exercises || [])}

Provide specific, actionable recommendations based on this data. Focus on:
- Workout optimization
- Recovery and rest days
- Progressive overload suggestions
- Form and technique tips
- Goal achievement strategies

Format as a friendly, encouraging message with bullet points.`;
        break;

      case 'medication':
        prompt = `You are a healthcare advisor. Analyze the following medication data and provide personalized, helpful recommendations in a friendly, professional tone. Keep recommendations concise (3-5 bullet points).

User Profile: ${userProfile.goals ? `Goals: ${userProfile.goals.join(', ')}` : 'Not specified'}
Medications: ${JSON.stringify(userData.medications || [])}
Stock Information: ${JSON.stringify(userData.stockData || [])}

Provide specific, actionable recommendations based on this data. Focus on:
- Medication adherence tips
- Stock management
- Timing optimization
- Safety reminders
- Health monitoring suggestions

IMPORTANT: Do not provide medical advice. Only give general reminders and organizational tips. Always remind users to consult their healthcare provider for medical decisions.

Format as a friendly, professional message with bullet points.`;
        break;

      default:
        throw new Error(`Invalid category: ${category}`);
    }

    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error('Gemini API Error:', error);
    throw new Error(`Failed to generate AI recommendations: ${error.message}`);
  }
};

module.exports = { getAIRecommendations };

