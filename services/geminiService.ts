export const generateVisualizationCode = async (prompt: string, imageBase64?: string): Promise<string> => {
  try {
    const response = await fetch('/.netlify/functions/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt, imageBase64 }),
    });

    if (!response.ok) {
      const err = await response.json();
      throw new Error(err.error || 'Failed to generate visualization');
    }

    const data = await response.json();
    return data.code;
  } catch (error) {
    console.error("Error generating visualization:", error);
    throw error;
  }
};
