
import { GoogleGenAI, Type } from "@google/genai";

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  console.error("API_KEY environment variable not set.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY! });

const recordSchema = {
    type: Type.OBJECT,
    properties: {
        recordType: {
            type: Type.STRING,
            description: "The type of medical record (e.g., 'Consultation Note', 'Lab Result', 'Prescription'). Infer this from the document.",
        },
        date: {
            type: Type.STRING,
            description: "The date of the record in YYYY-MM-DD format. If not found, use the current date.",
        },
        doctorName: {
            type: Type.STRING,
            description: "The name of the attending doctor or medical professional. If not found, leave blank.",
        },
        summary: {
            type: Type.STRING,
            description: "A concise, one-to-three sentence summary of the key findings, diagnosis, or treatment in the document."
        },
        fullText: {
            type: Type.STRING,
            description: "The full transcribed text extracted from the document."
        }
    },
    required: ["recordType", "date", "summary", "fullText"],
};


export const extractMedicalRecord = async (imageBase64: string, mimeType: string) => {
  try {
    const imagePart = {
        inlineData: {
            data: imageBase64,
            mimeType: mimeType,
        },
    };

    const textPart = {
        text: "You are a highly-skilled medical data entry specialist. Analyze the provided image of a medical document. Perform OCR to extract all text, and then structure the key information into the provided JSON schema. Be precise and accurate."
    };

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: { parts: [imagePart, textPart] },
      config: {
        responseMimeType: 'application/json',
        responseSchema: recordSchema,
      }
    });
    
    const jsonText = response.text.trim();
    return JSON.parse(jsonText);
  } catch (error) {
    console.error("Error processing medical document with Gemini:", error);
    throw new Error("Failed to extract information from the document. Please try again.");
  }
};
