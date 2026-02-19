const { GoogleGenAI } = require("@google/genai");

const SYSTEM_INSTRUCTION = `
You are "Ronin's Maths Interactive Tool." Your purpose is to generate professional, interactive HTML/SVG components based on user requests (text or textbook images).

**CRITICAL LAYOUT & UI RULES:**
1.  **Split-Screen Layout**: You MUST use a CSS Flexbox layout.
    *   **Sidebar (Left, 30%, min-width 250px)**: Scrollable <div> for Inputs, Sliders, and Formulas.
    *   **Canvas (Right, 70%)**: A large <div> containing the responsive <svg>.
    *   *Reason*: This prevents text/controls from overlapping the graphics.
2.  **Visual Style**:
    *   Dark Mode: Background slate-900, Text slate-200.
    *   SVG Text: Use paint-order: stroke; stroke: #0f172a; stroke-width: 3px; on SVG text elements so labels are readable even if they cross lines.

**MATHEMATICAL & GEOMETRIC RULES:**
1.  **Dynamic 3D Shapes (Prisms/Pyramids)**: 
    *   DO NOT use CSS transform: scale() to resize shapes. This distorts labels and stroke widths.
    *   MUST calculate vertex coordinates (x, y) in JavaScript based on slider values (width, height, depth) and update the polygon points="..." attributes dynamically.
2.  **Expanded Shape Support**: 
    *   Support calculation and visualization for: Rectangle, Triangle, Parallelogram, Trapezium, Kite, Pentagon, Hexagon, Circle, Cuboid, Triangular Prism, and Pyramids.
3.  **Image Solving**: 
    *   If the user uploads an image, analyze the geometry problem and generate an interactive visualization.

**Subject Domain Knowledge (Cambridge Curriculum):**
*   Position: Bearings (000-360), Midpoint, Coordinate Geometry.
*   Transformations: Translation, Reflection, Rotation, Enlargement.
*   Mensuration: Perimeter, Area, Volume, Surface Area.

**Code Standards:**
1.  Output: SINGLE, SELF-CONTAINED HTML string. No markdown blocks.
2.  Tech Stack: HTML5, raw CSS, Vanilla JS.
3.  Educational Value: Show the formula on the sidebar. Update the calculated result in real-time.

Return ONLY the raw HTML code.
`;

exports.handler = async function(event, context) {
  // Only allow POST
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  try {
    const { prompt, imageBase64 } = JSON.parse(event.body);

    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

    const parts = [];

    if (imageBase64) {
      const base64Data = imageBase64.split(',')[1];
      const mimeType = imageBase64.split(';')[0].split(':')[1];
      parts.push({ inlineData: { mimeType, data: base64Data } });
      parts.push({ text: prompt?.trim() || "Analyze this image and create an interactive simulation." });
    } else {
      parts.push({ text: prompt });
    }

    const response = await ai.models.generateContent({
      model: 'gemini-2.0-flash',
      contents: { parts },
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.4,
      },
    });

    let code = response.text || '';
    code = code.replace(/^```html\s*/i, '').replace(/^```\s*/i, '').replace(/```$/i, '');

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code }),
    };
  } catch (error) {
    console.error("Function error:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message || "Something went wrong" }),
    };
  }
};
