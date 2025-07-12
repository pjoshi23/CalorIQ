// Gemini Vision API service for food analysis
// Note: You'll need to set up your GCP project and get an API key

const GEMINI_API_KEY = 'API_KEY';
// Fixed: Updated to use the correct model name
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent';

export interface FoodAnalysisResult {
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  confidence?: number;
  serving_size?: string;
  error?: string;
}

export async function analyzeFoodImage(base64Image: string): Promise<FoodAnalysisResult> {
  try {
    console.log("starting analysis")
    const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: `Analyze this food image and provide nutrition information. Return ONLY a JSON object with the following structure:
                {
                  "name": "food name",
                  "calories": number,
                  "protein": number (in grams),
                  "carbs": number (in grams),
                  "fat": number (in grams),
                  "serving_size": "estimated serving size",
                  "confidence": number (0-100)
                }
                
                Be realistic with the nutrition values. If you can't identify the food clearly, estimate based on what you can see. Make sure all numbers are numeric values, not strings.`
              },
              {
                // Fixed: Corrected the property name from 'inline_data' to 'inlineData'
                inlineData: {
                  // Fixed: Corrected the property name from 'mime_type' to 'mimeType'
                  mimeType: 'image/jpeg',
                  data: base64Image
                }
              }
            ]
          }
        ]
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('API Error Response:', errorText);
      throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
    }

    const data = await response.json();
    
    if (!data.candidates || !data.candidates[0] || !data.candidates[0].content) {
      console.error('Invalid API response structure:', data);
      throw new Error('Invalid response from Gemini API');
    }

    console.log("raw gemini response", data)

    const textResponse = data.candidates[0].content.parts[0].text;
    console.log("gemini text", textResponse)
    
    // Try to extract JSON from the response
    let jsonText = textResponse.trim();
    
    // Remove markdown code blocks if present
    jsonText = jsonText.replace(/```json\n?/g, '').replace(/```\n?/g, '');
    
    const jsonMatch = jsonText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('Could not parse JSON response from Gemini');
    }

    const result = JSON.parse(jsonMatch[0]) as FoodAnalysisResult;
    
    // Validate the result and ensure all required fields are present
    if (!result.name || typeof result.calories !== 'number' || 
        typeof result.protein !== 'number' || typeof result.carbs !== 'number' || 
        typeof result.fat !== 'number') {
      throw new Error('Invalid nutrition data from Gemini');
    }

    // Ensure numbers are valid (not NaN or negative where inappropriate)
    result.calories = Math.max(0, result.calories || 0);
    result.protein = Math.max(0, result.protein || 0);
    result.carbs = Math.max(0, result.carbs || 0);
    result.fat = Math.max(0, result.fat || 0);

    return result;
  } catch (error) {
    console.error('Error analyzing food image:', error);
    
    // Return a fallback result if the API fails
    return {
      name: 'Unknown Food',
      calories: 0,
      protein: 0,
      carbs: 0,
      fat: 0,
      serving_size: 'unknown',
      confidence: 0,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
}

// Helper function to validate base64 image data
export function validateBase64Image(base64Data: string): boolean {
  try {
    // Check if it's a valid base64 string
    if (!base64Data || typeof base64Data !== 'string') {
      return false;
    }
    
    // Remove data URL prefix if present
    const cleanBase64 = base64Data.replace(/^data:image\/[a-z]+;base64,/, '');
    
    // Validate base64 format
    const base64Regex = /^[A-Za-z0-9+/]*={0,2}$/;
    return base64Regex.test(cleanBase64) && cleanBase64.length > 0;
  } catch {
    return false;
  }
}

// Enhanced function with validation
export async function analyzeFoodImageSafe(base64Image: string): Promise<FoodAnalysisResult> {
  if (!validateBase64Image(base64Image)) {
    return {
      name: "Invalid image",
      calories: 0,
      protein: 0,
      carbs: 0,
      fat: 0,
      serving_size: "unknown",
      confidence: 0,
      error: "Invalid base64 image data provided"
    };
  }
  
  // Remove data URL prefix if present
  const cleanBase64 = base64Image.replace(/^data:image\/[a-z]+;base64,/, '');
  
  return analyzeFoodImage(cleanBase64);
}