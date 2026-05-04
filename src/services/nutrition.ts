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

export async function analyzeNutrition(
  ingredients: string[],
  recipeName: string
): Promise<NutritionData> {
  const prompt = `You are a professional nutritionist. Analyze these ingredients for the recipe "${recipeName}" and return ONLY valid JSON, no markdown, no explanation.

Ingredients:
${ingredients.map((i, idx) => `${idx + 1}. ${i}`).join('\n')}

Return this exact JSON structure (numbers only, no units in number fields):
{
  "calories": <total kcal for whole recipe>,
  "protein": <grams>,
  "fat": <grams>,
  "carbs": <grams>,
  "sugar": <grams>,
  "fiber": <grams>,
  "sodium": <milligrams>,
  "servings": <estimated servings>,
  "vitamins": [
    {"name": "Vitamin C", "amount": "24mg"},
    {"name": "Vitamin A", "amount": "120mcg"},
    {"name": "Vitamin D", "amount": "2mcg"},
    {"name": "Vitamin B12", "amount": "0.5mcg"}
  ],
  "minerals": [
    {"name": "Iron", "amount": "3mg"},
    {"name": "Calcium", "amount": "150mg"},
    {"name": "Potassium", "amount": "420mg"}
  ],
  "healthScore": <1-10 integer>,
  "healthTip": "<one short helpful tip about this recipe's nutrition>"
}`;

  try {
    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 1000,
        messages: [{ role: 'user', content: prompt }],
      }),
    });

    if (!res.ok) throw new Error(`API ${res.status}`);
    const data = await res.json();
    const text = data.content?.find((b: { type: string }) => b.type === 'text')?.text ?? '';
    // Strip any accidental markdown fences
    const clean = text.replace(/```json|```/gi, '').trim();
    return JSON.parse(clean) as NutritionData;
  } catch (err) {
    console.error('Nutrition analysis failed:', err);
    // Fallback: estimated values
    return buildFallback(ingredients, recipeName);
  }
}

// Rough offline fallback if API fails
function buildFallback(ingredients: string[], _name: string): NutritionData {
  const count = ingredients.length;
  return {
    calories: count * 45 + Math.round(Math.random() * 80),
    protein:  Math.round(count * 2.5),
    fat:      Math.round(count * 1.8),
    carbs:    Math.round(count * 8),
    sugar:    Math.round(count * 1.5),
    fiber:    Math.round(count * 0.8),
    sodium:   Math.round(count * 60),
    servings: 4,
    vitamins: [
      { name: 'Vitamin C', amount: '18mg' },
      { name: 'Vitamin A', amount: '95mcg' },
      { name: 'Vitamin B6', amount: '0.3mg' },
    ],
    minerals: [
      { name: 'Iron',      amount: '2mg'   },
      { name: 'Calcium',   amount: '80mg'  },
      { name: 'Potassium', amount: '310mg' },
    ],
    healthScore: 6,
    healthTip: 'Add more vegetables to boost fiber and vitamins.',
  };
}
