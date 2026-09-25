import { mlEngine } from './randomForest.js';

console.log("Testing Voyanta Random Forest Model...");

const testInput = {
  budget: "Moderate",
  durationDays: 5,
  travelers: 2,
  season: "Spring",
  travelStyle: "Cultural",
  vibes: ["Culture & History", "Café / Slow Travel", "Nature & Peace"]
};

const result = mlEngine.predict(testInput);

console.log("\n--- Top Recommendation ---");
console.log(`Destination: ${result.topRecommendations[0].name}, ${result.topRecommendations[0].country}`);
console.log(`Match Confidence: ${result.topRecommendations[0].matchConfidence}%`);
console.log(`Vibes: ${result.topRecommendations[0].vibes.join(', ')}`);
console.log(`Explanation:`, result.topRecommendations[0].matchExplanation);

console.log("\n--- Model Metrics ---");
console.log(result.modelMetrics);
