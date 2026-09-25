"""
Voyanta ML: Destination Recommendation Engine
Algorithm: Random Forest Classifier (scikit-learn)

This script trains a Random Forest model on the travel feature space
(Budget, Duration, Travelers, Season, Travel Style, Vibe Vector)
and evaluates feature importances and classification metrics.
"""

import json
import os
import numpy as np
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import classification_report, accuracy_score

DATASET_PATH = os.path.join(os.path.dirname(__file__), "dataset.json")

def load_data():
    with open(DATASET_PATH, "r", encoding="utf-8") as f:
        data = json.load(f)
    return data

def build_training_matrix(data):
    vibes_list = data["vibes"]
    destinations = data["destinations"]

    X = []
    y = []

    season_map = {"Spring": 1, "Summer": 2, "Autumn": 3, "Winter": 4, "Monsoon": 5}
    style_map = {"Backpacker": 1, "Relaxed": 2, "Fast-paced": 3, "Cultural": 4, "Luxury": 5}

    for dest in destinations:
        dest_name = dest["name"]
        target_vibes = [1 if v in dest["vibes"] else 0 for v in vibes_list]
        budget = dest["budgetLevel"]
        avg_duration = sum(dest["bestDurationDays"]) // 2
        season = season_map.get(dest["bestSeasons"][0], 1)
        style = style_map.get(dest["travelStyles"][0], 2)

        # Generate synthetic samples with realistic variance
        np.random.seed(42)
        for _ in range(50):
            dur = max(1, int(np.random.normal(avg_duration, 1.5)))
            travelers = np.random.randint(1, 5)
            s_val = season if np.random.rand() > 0.3 else np.random.choice(list(season_map.values()))
            st_val = style if np.random.rand() > 0.3 else np.random.choice(list(style_map.values()))
            vibe_vec = [1 if (val == 1 and np.random.rand() > 0.1) else (1 if np.random.rand() < 0.05 else 0) for val in target_vibes]

            features = [budget, dur, travelers, s_val, st_val] + vibe_vec
            X.append(features)
            y.append(dest_name)

    return np.array(X), np.array(y), vibes_list

def main():
    print("=" * 60)
    print(" Voyanta ML Recommendation Model Training (Random Forest)")
    print("=" * 60)

    data = load_data()
    X, y, vibes_list = build_training_matrix(data)
    feature_names = ["Budget", "Duration", "Travelers", "Season", "Style"] + [f"Vibe_{v}" for v in vibes_list]

    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42, stratify=y)

    print(f"Total samples: {len(X)} | Training: {len(X_train)} | Test: {len(X_test)}")
    print(f"Feature count: {len(feature_names)}")

    # Initialize Random Forest Classifier
    rf = RandomForestClassifier(
        n_estimators=100,
        max_depth=8,
        min_samples_split=2,
        random_state=42,
        n_jobs=-1
    )

    rf.fit(X_train, y_train)
    y_pred = rf.predict(X_test)

    acc = accuracy_score(y_test, y_pred)
    print(f"\nAccuracy on Test Set: {acc * 100:.2f}%\n")

    print("Classification Report:")
    print(classification_report(y_test, y_pred))

    print("-" * 60)
    print("Top Feature Importances:")
    importances = rf.feature_importances_
    indices = np.argsort(importances)[::-1]
    for i in range(min(10, len(indices))):
        idx = indices[i]
        print(f"  {i+1}. {feature_names[idx]:<25} : {importances[idx]:.4f}")

    print("=" * 60)
    print("Random Forest model training and validation complete.")

if __name__ == "__main__":
    main()
