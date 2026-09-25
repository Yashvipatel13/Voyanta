import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load the destination dataset
const rawDataset = JSON.parse(
  fs.readFileSync(path.join(__dirname, 'dataset.json'), 'utf8')
);

// Map categories to indices
export const SEASON_MAP = { Winter: 1, Summer: 2, Monsoon: 3, Autumn: 4, Spring: 5 };
export const STYLE_MAP = { Backpacker: 1, Relaxed: 2, 'Fast-paced': 3, Cultural: 4, Luxury: 5, Adventure: 6 };
export const BUDGET_MAP = { Economy: 1, Moderate: 2, Luxury: 3 };
export const VIBES_LIST = rawDataset.vibes;

/**
 * Encodes user input into a flat numerical feature vector:
 * [budgetTier (1-3), durationDays, travelersCount, seasonId (1-5), styleId (1-6), ...vibeIndicators (12 elements)]
 */
export function encodeFeatures(input) {
  let budget = 2;
  const rawBudget = input.budget !== undefined ? input.budget : input.targetBudget;
  if (typeof rawBudget === 'number') {
    if (rawBudget < 25000) budget = 1; // Economy
    else if (rawBudget <= 65000) budget = 2; // Moderate
    else budget = 3; // Luxury
  } else if (typeof rawBudget === 'string') {
    budget = BUDGET_MAP[rawBudget] || 2;
  }

  const duration = Math.min(Math.max(Number(input.durationDays) || 5, 1), 30);
  const travelers = Math.min(Math.max(Number(input.travelers) || 2, 1), 15);
  const season = SEASON_MAP[input.season] || 1;
  const style = STYLE_MAP[input.travelStyle] || 2;

  const selectedVibes = Array.isArray(input.vibes)
    ? input.vibes
    : (input.vibes || '').split(',').map(s => s.trim()).filter(Boolean);

  const vibeVector = VIBES_LIST.map(v => selectedVibes.includes(v) ? 1 : 0);

  return [budget, duration, travelers, season, style, ...vibeVector];
}

/**
 * Gini Impurity calculator for a list of class labels
 */
function calculateGini(labels) {
  if (labels.length === 0) return 0;
  const counts = {};
  for (const label of labels) {
    counts[label] = (counts[label] || 0) + 1;
  }
  let impurity = 1;
  for (const label in counts) {
    const p = counts[label] / labels.length;
    impurity -= p * p;
  }
  return impurity;
}

/**
 * Single Decision Tree Node
 */
class TreeNode {
  constructor() {
    this.isLeaf = false;
    this.prediction = null;
    this.probabilities = {};
    this.featureIndex = null;
    this.splitValue = null;
    this.left = null;
    this.right = null;
  }
}

/**
 * Decision Tree Classifier
 */
class DecisionTree {
  constructor(maxDepth = 6, minSamplesSplit = 2, maxFeatures = null) {
    this.maxDepth = maxDepth;
    this.minSamplesSplit = minSamplesSplit;
    this.maxFeatures = maxFeatures;
    this.root = null;
  }

  fit(X, y) {
    this.root = this.buildTree(X, y, 0);
  }

  buildTree(X, y, depth) {
    const numSamples = X.length;
    const uniqueLabels = [...new Set(y)];

    // Check stopping criteria
    if (depth >= this.maxDepth || uniqueLabels.length <= 1 || numSamples < this.minSamplesSplit) {
      const node = new TreeNode();
      node.isLeaf = true;
      const counts = {};
      y.forEach(label => counts[label] = (counts[label] || 0) + 1);
      node.probabilities = {};
      for (const l in counts) {
        node.probabilities[l] = counts[l] / numSamples;
      }
      node.prediction = uniqueLabels.reduce((a, b) => (counts[a] || 0) > (counts[b] || 0) ? a : b);
      return node;
    }

    const numFeatures = X[0].length;
    // Feature subspace sampling (random features)
    const featureIndices = Array.from({ length: numFeatures }, (_, i) => i);
    const sampledFeatures = this.maxFeatures
      ? featureIndices.sort(() => 0.5 - Math.random()).slice(0, this.maxFeatures)
      : featureIndices;

    let bestGini = Infinity;
    let bestFeature = null;
    let bestThreshold = null;

    for (const featIdx of sampledFeatures) {
      const values = X.map(row => row[featIdx]);
      const uniqueVals = [...new Set(values)].sort((a, b) => a - b);

      for (let i = 0; i < uniqueVals.length - 1; i++) {
        const threshold = (uniqueVals[i] + uniqueVals[i + 1]) / 2;
        const leftY = [];
        const rightY = [];

        for (let j = 0; j < numSamples; j++) {
          if (X[j][featIdx] <= threshold) {
            leftY.push(y[j]);
          } else {
            rightY.push(y[j]);
          }
        }

        if (leftY.length === 0 || rightY.length === 0) continue;

        const giniLeft = calculateGini(leftY);
        const giniRight = calculateGini(rightY);
        const weightedGini = (leftY.length / numSamples) * giniLeft + (rightY.length / numSamples) * giniRight;

        if (weightedGini < bestGini) {
          bestGini = weightedGini;
          bestFeature = featIdx;
          bestThreshold = threshold;
        }
      }
    }

    if (bestFeature === null) {
      const node = new TreeNode();
      node.isLeaf = true;
      const counts = {};
      y.forEach(label => counts[label] = (counts[label] || 0) + 1);
      node.probabilities = {};
      for (const l in counts) {
        node.probabilities[l] = counts[l] / numSamples;
      }
      node.prediction = uniqueLabels.reduce((a, b) => (counts[a] || 0) > (counts[b] || 0) ? a : b);
      return node;
    }

    const leftX = [];
    const leftY = [];
    const rightX = [];
    const rightY = [];

    for (let i = 0; i < numSamples; i++) {
      if (X[i][bestFeature] <= bestThreshold) {
        leftX.push(X[i]);
        leftY.push(y[i]);
      } else {
        rightX.push(X[i]);
        rightY.push(y[i]);
      }
    }

    const node = new TreeNode();
    node.featureIndex = bestFeature;
    node.splitValue = bestThreshold;
    node.left = this.buildTree(leftX, leftY, depth + 1);
    node.right = this.buildTree(rightX, rightY, depth + 1);
    return node;
  }

  predictProba(x) {
    let node = this.root;
    while (node && !node.isLeaf) {
      if (x[node.featureIndex] <= node.splitValue) {
        node = node.left;
      } else {
        node = node.right;
      }
    }
    return node ? node.probabilities : {};
  }
}

/**
 * Random Forest Classifier Ensemble
 */
export class RandomForestClassifier {
  constructor(nEstimators = 30, maxDepth = 6, maxFeatures = null) {
    this.nEstimators = nEstimators;
    this.maxDepth = maxDepth;
    this.maxFeatures = maxFeatures;
    this.trees = [];
    this.destinations = rawDataset.destinations;
    this.isTrained = false;
  }

  /**
   * Generates training samples from destination feature vectors and synthetic perturbations
   */
  generateTrainingData() {
    const X = [];
    const y = [];

    for (const dest of this.destinations) {
      const targetVibes = VIBES_LIST.map(v => dest.vibes.includes(v) ? 1 : 0);
      const budgetVal = dest.budgetLevel;
      const avgDuration = Math.round((dest.bestDurationDays[0] + dest.bestDurationDays[1]) / 2);
      const primarySeason = SEASON_MAP[dest.bestSeasons[0]] || 1;
      const primaryStyle = STYLE_MAP[dest.travelStyles[0]] || 2;

      // Base vector
      X.push([budgetVal, avgDuration, 2, primarySeason, primaryStyle, ...targetVibes]);
      y.push(dest.name);

      // Jitter variations for training robust multi-class tree boundaries
      for (let i = 0; i < 25; i++) {
        const jitterDuration = Math.max(1, avgDuration + Math.floor(Math.random() * 5 - 2));
        const travelerCount = Math.floor(Math.random() * 5) + 1;
        const seasonVal = Math.random() > 0.4
          ? primarySeason
          : (SEASON_MAP[dest.bestSeasons[Math.floor(Math.random() * dest.bestSeasons.length)]] || primarySeason);
        const styleVal = Math.random() > 0.4
          ? primaryStyle
          : (STYLE_MAP[dest.travelStyles[Math.floor(Math.random() * dest.travelStyles.length)]] || primaryStyle);

        // Vibe noise with high retention of true vibes
        const vibeJitter = targetVibes.map(v => (v === 1 && Math.random() > 0.1) ? 1 : (v === 0 && Math.random() < 0.04 ? 1 : 0));

        X.push([budgetVal, jitterDuration, travelerCount, seasonVal, styleVal, ...vibeJitter]);
        y.push(dest.name);
      }
    }

    return { X, y };
  }

  /**
   * Train the Random Forest ensemble
   */
  train() {
    const { X, y } = this.generateTrainingData();
    const numSamples = X.length;
    const numFeatures = X[0].length;
    const subFeatures = this.maxFeatures || Math.floor(Math.sqrt(numFeatures)) + 2;

    this.trees = [];

    for (let i = 0; i < this.nEstimators; i++) {
      // Bootstrap sampling (with replacement)
      const bootX = [];
      const bootY = [];
      for (let s = 0; s < numSamples; s++) {
        const randIdx = Math.floor(Math.random() * numSamples);
        bootX.push(X[randIdx]);
        bootY.push(y[randIdx]);
      }

      const tree = new DecisionTree(this.maxDepth, 2, subFeatures);
      tree.fit(bootX, bootY);
      this.trees.push(tree);
    }

    this.isTrained = true;
    console.log(`[ML Engine] Random Forest trained successfully with ${this.nEstimators} trees on ${numSamples} Indian travel sample vectors.`);
  }

  /**
   * Predict top destinations with confidence and match breakdown
   */
  predict(input) {
    if (!this.isTrained) {
      this.train();
    }

    const featureVector = encodeFeatures(input);
    const votes = {};

    for (const tree of this.trees) {
      const probas = tree.predictProba(featureVector);
      for (const dest in probas) {
        votes[dest] = (votes[dest] || 0) + probas[dest];
      }
    }

    // Direct vibe similarity bonus
    const userVibes = Array.isArray(input.vibes)
      ? input.vibes
      : (input.vibes || '').split(',').map(s => s.trim()).filter(Boolean);

    // Normalize confidence
    const totalTrees = this.trees.length;
    let targetBudgetLevel = 2;
    const rawBudget = input.budget !== undefined ? input.budget : input.targetBudget;
    if (typeof rawBudget === 'number') {
      if (rawBudget < 25000) targetBudgetLevel = 1;
      else if (rawBudget <= 65000) targetBudgetLevel = 2;
      else targetBudgetLevel = 3;
    } else if (typeof rawBudget === 'string') {
      targetBudgetLevel = BUDGET_MAP[rawBudget] || 2;
    }

    const ranked = this.destinations.map(dest => {
      const rawScore = (votes[dest.name] || 0) / totalTrees;
      
      // Calculate vibe overlap (multi-attribute similarity)
      const sharedVibes = dest.vibes.filter(v => userVibes.includes(v));
      const vibeScore = userVibes.length > 0 ? (sharedVibes.length / userVibes.length) : 0.6;

      // Calculate budget match
      const budgetDiff = Math.abs(dest.budgetLevel - targetBudgetLevel);
      const budgetScore = budgetDiff === 0 ? 1.0 : (budgetDiff === 1 ? 0.75 : 0.45);

      // Duration compatibility
      const duration = Number(input.durationDays) || 5;
      const inDurationRange = duration >= dest.bestDurationDays[0] && duration <= dest.bestDurationDays[1];
      const durationScore = inDurationRange ? 1.0 : 0.8;

      // Composite Confidence (Random Forest vote 40% + Vibe overlap 35% + Budget match 15% + Duration 10%)
      const confidence = Math.min(
        Math.round((rawScore * 0.40 + vibeScore * 0.35 + budgetScore * 0.15 + durationScore * 0.10) * 100),
        99
      );

      return {
        ...dest,
        matchConfidence: Math.max(confidence, 52),
        sharedVibes,
        matchExplanation: {
          vibeAlignment: sharedVibes.length > 0 
            ? `Top match for your ${sharedVibes.join(', ')} vibes`
            : 'Offers relaxing retreats aligned with your style',
          budgetFit: dest.budgetLevel === targetBudgetLevel 
            ? `Fits perfectly within your ₹ budget plan`
            : `Compatible with ${dest.budgetTier} Indian travel`,
          seasonFit: dest.bestSeasons.includes(input.season)
            ? `Ideal weather during ${input.season}`
            : `Accessible and pleasant year-round`
        }
      };
    });

    // Sort descending by match confidence
    ranked.sort((a, b) => b.matchConfidence - a.matchConfidence);

    return {
      topRecommendations: ranked.slice(0, 6),
      allRecommendations: ranked,
      featureVectorSummary: {
        budget: rawBudget,
        budgetTier: targetBudgetLevel === 1 ? 'Economy' : targetBudgetLevel === 2 ? 'Moderate' : 'Luxury',
        durationDays: input.durationDays || 5,
        travelers: input.travelers || 2,
        season: input.season || 'Winter',
        travelStyle: input.travelStyle || 'Relaxed',
        vibes: userVibes
      },
      modelMetrics: {
        algorithm: "Random Forest Classifier (Ensemble of Decision Trees)",
        nEstimators: this.nEstimators,
        maxDepth: this.maxDepth,
        treesEvaluated: this.trees.length
      }
    };
  }
}

// Singleton ML Engine Instance
export const mlEngine = new RandomForestClassifier(30, 6);
mlEngine.train();
