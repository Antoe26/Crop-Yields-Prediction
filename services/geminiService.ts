import { GoogleGenAI, Type } from "@google/genai";
import { PredictionInput, PredictionOutput } from '../types';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  throw new Error("API_KEY environment variable not set.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

export async function predictYield(data: PredictionInput): Promise<PredictionOutput> {
  const model = "gemini-2.5-flash";

  const prompt = `
    You are an expert agricultural AI model specialized in crop yield prediction. Based on the following data, perform four tasks:
    1. Predict the primary crop yield in kilograms per hectare (kg/ha).
    2. Provide a brief justification for your prediction. Consider the interplay of the input factors and compare the prediction to typical yield ranges for this crop under similar conditions.
    3. Generate data for a sensitivity analysis. For each of 'Average Annual Rainfall', 'Average Temperature', and 'Fertilizer Applied', calculate the predicted yield for 5 data points: the original value, two steps below (-20%, -10%), and two steps above (+10%, +20%). Keep all other input factors constant for each analysis. The five points should be ordered by value.
    4. Provide a detailed comparison of three different machine learning models (Linear Regression, Random Forest, and a simple Neural Network) for this prediction task. For each model, provide:
       - modelName: The name of the model.
       - pros: An array of 2-3 key advantages.
       - cons: An array of 2-3 key disadvantages.
       - suitability: A suitability rating ('High', 'Medium', or 'Low').
       - metrics: An object containing:
           - rSquared: A typical R-squared value range (e.g., "0.85 - 0.92").
           - mae: A typical Mean Absolute Error range in kg/ha (e.g., "150 - 250 kg/ha").
           - explanation: A brief explanation of what these metrics mean in the context of crop yield prediction.

    Input Data:
    - Crop: ${data.cropType}
    - Average Annual Rainfall: ${data.rainfall} mm
    - Average Temperature: ${data.temperature} °C
    - Fertilizer Applied: ${data.fertilizer} kg/ha
    - Soil Type: ${data.soilType}
    - Pesticide Applied: ${data.pesticide} kg/ha
    - Year: ${data.year}

    Return the entire response as a single, well-formed JSON object.
  `;

  try {
    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            predictedYield: {
              type: Type.NUMBER,
              description: "The predicted crop yield in kilograms per hectare (kg/ha). Example: 4500.5"
            },
            justification: {
              type: Type.STRING,
              description: "A brief, easy-to-understand explanation for the prediction, highlighting key factors and comparing to typical yields."
            },
            analysis: {
              type: Type.OBJECT,
              description: "Data for sensitivity analysis charts.",
              properties: {
                rainfall: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: { value: { type: Type.NUMBER }, yield: { type: Type.NUMBER } },
                    required: ["value", "yield"]
                  }
                },
                temperature: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: { value: { type: Type.NUMBER }, yield: { type: Type.NUMBER } },
                     required: ["value", "yield"]
                  }
                },
                fertilizer: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: { value: { type: Type.NUMBER }, yield: { type: Type.NUMBER } },
                     required: ["value", "yield"]
                  }
                }
              },
              required: ["rainfall", "temperature", "fertilizer"]
            },
            modelComparison: {
              type: Type.ARRAY,
              description: "An array comparing different machine learning models for this task.",
              items: {
                type: Type.OBJECT,
                properties: {
                  modelName: { type: Type.STRING, description: "e.g., 'Linear Regression'" },
                  pros: { type: Type.ARRAY, items: { type: Type.STRING }, description: "List of advantages." },
                  cons: { type: Type.ARRAY, items: { type: Type.STRING }, description: "List of disadvantages." },
                  suitability: { type: Type.STRING, description: "Suitability rating: 'High', 'Medium', or 'Low'." },
                  metrics: {
                    type: Type.OBJECT,
                    properties: {
                        rSquared: { type: Type.STRING, description: "Expected R-squared value range." },
                        mae: { type: Type.STRING, description: "Expected Mean Absolute Error range in kg/ha." },
                        explanation: { type: Type.STRING, description: "Explanation of the metrics." }
                    },
                    required: ["rSquared", "mae", "explanation"]
                  }
                },
                required: ["modelName", "pros", "cons", "suitability", "metrics"]
              }
            }
          },
          required: ["predictedYield", "justification", "analysis", "modelComparison"]
        },
        temperature: 0.3,
      },
    });

    const jsonString = response.text.trim();
    const result = JSON.parse(jsonString);

    if (typeof result.predictedYield !== 'number' || typeof result.justification !== 'string' || !result.analysis || !Array.isArray(result.modelComparison)) {
        throw new Error("Invalid response format from API.");
    }
    
    return result as PredictionOutput;

  } catch (error) {
    console.error("Error calling Gemini API:", error);
    throw new Error("Failed to get prediction from the AI model. Please check the input values and try again.");
  }
}