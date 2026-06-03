export interface NutritionData {
  calories: number;
  protein: number;      // g
  fat: number;          // g
  carbs: number;        // g
  sugar: number;        // g
  fiber: number;        // g
  sodium: number;       // mg
  servings: number;
  vitamins: { name: string; amount: string }[];
  minerals: { name: string; amount: string }[];
  healthScore: number;  // 1-10
  healthTip: string;
}

// Create empty nutrition data with default values
export function createEmptyNutrition(): NutritionData {
  return {
    calories: 0,
    protein: 0,
    fat: 0,
    carbs: 0,
    sugar: 0,
    fiber: 0,
    sodium: 0,
    servings: 1,
    vitamins: [],
    minerals: [],
    healthScore: 5,
    healthTip: '',
  };
}
