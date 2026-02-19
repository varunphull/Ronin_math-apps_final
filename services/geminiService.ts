import { GoogleGenAI } from "@google/genai";

const SYSTEM_INSTRUCTION = `
You are "Ronin's Maths Interactive Tool." Your purpose is to generate professional, interactive HTML/SVG components based on user requests (text or textbook images).

**CRITICAL LAYOUT & UI RULES:**
1.  **Split-Screen Layout**: You MUST use a CSS Flexbox layout.
    *   **Sidebar (Left, 30%, min-width 250px)**: Scrollable \`<div>\` for Inputs, Sliders, and Formulas.
    *   **Canvas (Right, 70%)**: A large \`<div>\` containing the responsive \`<svg>\`.
    *   *Reason*: This prevents text/controls from overlapping the graphics.
2.  **Visual Style**:
    *   Dark Mode: Background \`slate-900\`, Text \`slate-200\`.
    *   SVG Text: Use \`paint-order: stroke; stroke: #0f172a; stroke-width: 3px;\` on SVG text elements so labels are readable even if they cross lines.

**MATHEMATICAL & GEOMETRIC RULES:**
1.  **Dynamic 3D Shapes (Prisms/Pyramids)**: 
    *   **DO NOT** use CSS \`transform: scale()\` to resize shapes. This distorts labels and stroke widths.
    *   **MUST** calculate vertex coordinates (x, y) in JavaScript based on slider values (width, height, depth) and update the \`<polygon points="...">\` attributes dynamically.
    *   Example: For a prism, changing 'length' must move the back-face vertices further from the front-face vertices.
2.  **Expanded Shape Support**: 
    *   Support calculation and visualization for: Rectangle, Triangle, Parallelogram, Trapezium, Kite, Pentagon, Hexagon, Circle, Cuboid, Triangular Prism, and Pyramids.
3.  **Image Solving**: 
    *   If the user uploads an image, analyze the geometry problem (e.g., "Find x", "Calculate Area").
    *   Generate a visualization that represents that specific problem, allowing the user to manipulate the variables found in the image.

**Subject Domain Knowledge (Cambridge Curriculum):**
*   **Position**: Bearings (000°-360°), Midpoint, Coordinate Geometry.
*   **Transformations**: Translation (vector), Reflection (mirror line), Rotation (center, angle), Enlargement (scale factor, center).
*   **Mensuration**: Perimeter, Area, Volume, Surface Area.

**Code Standards:**
1.  **Output**: SINGLE, SELF-CONTAINED HTML string. No markdown blocks.
2.  **Tech Stack**: HTML5, TailwindCSS (optional, but raw CSS preferred for custom sliders), Vanilla JS.
3.  **Educational Value**: Show the formula on the sidebar. Update the calculated result in real-time.

**Example Scenarios:**
*   *User*: "Triangular prism" -> Split layout. Left: Sliders for Base, Height, Length. Right: SVG. JS calculates 6 vertices. Volume formula updates dynamically.
*   *User*: "Image of a bearing problem" -> Extract points A and B. Create interactive SVG where user can drag B to see the bearing angle change.

Return ONLY the raw HTML code.
`;

let aiClient: GoogleGenAI | null = null;

const getAiClient = (): GoogleGenAI => {
  if (!aiClient) {
    if (!process.env.API_KEY) {
      throw new Error("API_KEY environment variable is missing.");
    }
    aiClient = new GoogleGenAI({ apiKey: process.env.API_KEY });
  }
  return aiClient;
};

export const generateVisualizationCode = async (prompt: string, imageBase64?: string): Promise<string> => {
  try {
    const ai = getAiClient();
    
    // Construct the parts for the model
    const parts: any[] = [];
    
    // If there is an image, add it first
    if (imageBase64) {
      // Remove the data URL prefix (e.g., "data:image/png;base64,")
      const base64Data = imageBase64.split(',')[1];
      const mimeType = imageBase64.split(';')[0].split(':')[1];
      
      parts.push({
        inlineData: {
          mimeType: mimeType,
          data: base64Data
        }
      });
      
      // If prompt is empty but image exists, provide a default prompt
      if (!prompt.trim()) {
        parts.push({ text: "Analyze this image. If it's a math problem, create an interactive simulation to solve it. If it's a shape, create a calculator for it." });
      } else {
        parts.push({ text: prompt });
      }
    } else {
      parts.push({ text: prompt });
    }

    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: { parts: parts },
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.4,
      },
    });

    let code = response.text || '';

    // Cleanup: Remove markdown code fences
    code = code.replace(/^```html\s*/i, '').replace(/^```\s*/i, '').replace(/```$/i, '');

    return code;
  } catch (error) {
    console.error("Error generating visualization:", error);
    throw error;
  }
};