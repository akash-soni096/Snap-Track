import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No image provided" }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const base64Image = buffer.toString("base64");

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

    // Using the Pro model for better accuracy
   const model = genAI.getGenerativeModel({ model: "gemini-3-flash-preview" });


    // The Prompt: More flexible for dates and totals
    const prompt = `
      Analyze this receipt image. Your task is to extract key information into a strict JSON format.

      If a field cannot be found or is illegible, return null or an empty string for string fields, and an empty array for items.

      Extract the following:
      - merchant (string): The name of the store or business.
      - date (string): The date of the transaction. Try to convert it to YYYY-MM-DD format if possible.
      - total (string): The final total amount paid. Look for labels like "Total", "Net Amt", "Grand Total". Clean any currency symbols.
      - category (string): Guess the general category (e.g., "Groceries", "Food", "Shopping").
      - items (array): A list of items purchased. Each item object should have:
        - name (string): The description of the item.
        - price (string): The individual price of the item.

      Return ONLY raw JSON. Do not include markdown formatting like \`\`\`json.
    `;

    const result = await model.generateContent([
      prompt,
      {
        inlineData: {
          data: base64Image,
          mimeType: file.type,
        },
      },
    ]);

    const response = await result.response;
    const text = response.text();
    const cleanedText = text.replace(/```json/g, "").replace(/```/g, "").trim();
    const jsonData = JSON.parse(cleanedText);

    return NextResponse.json(jsonData);

  } catch (error) {
    // This logs the exact error to your terminal
    console.error("Gemini Analysis Error:", error);
    return NextResponse.json({ error: "Failed to analyze receipt" }, { status: 500 });
  }
}