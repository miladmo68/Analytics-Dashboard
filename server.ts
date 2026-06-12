/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

// Wrap the full stack express server inside async initializer block
async function startServer() {
  const app = express();
  const PORT = 3000;

  // Accept incoming payload objects
  app.use(express.json());

  // Operations AI proxy analyzer route
  app.post('/api/gemini/analyze', async (req, res) => {
    try {
      const { message, dashboardContext } = req.body;

      // Extract runtime secret keys
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        return res.status(500).json({
          error: "GEMINI_API_KEY environment variable is required",
          help: "Please configure your GEMINI_API_KEY inside the Secrets tab of the Google AI Studio settings panel."
        });
      }

      // Initialize Google GenAI Client with required telemetry headers
      const ai = new GoogleGenAI({
        apiKey: apiKey,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build'
          }
        }
      });

      // Formulate detailed background guidance system prompt
      const systemGuide = `You are an expert Chief Operating Officer (COO) and business intelligence analyst.
You are evaluating the operational stats of a digital subscription product.
Here is the raw context of the platform metrics received from the frontend:
- Total revenue aggregate value: $${dashboardContext?.totalRevenueSum || 148932}
- Active subscriber count: ${dashboardContext?.activeCustomersCount || 12480}
- Benchmark conversion rate efficiency: ${dashboardContext?.currentConversionRate || '4.8%'}
- Client geo focus: North America, Europe, Asia Pacific
- Host local server date: 2026-06-04

Help the user review their data, answer operational queries, suggest marketing or performance tweaks, and describe analytics patterns. 
Keep your response concise, professional, structured, using bullet points or simple headers. 
Always remain objective. Do not make up fake clients or transactions outside the context.
Output standard Markdown format cleanly without double markdown tags.`;

      // Call Gemini 3.5 Flash model
      const modelResponse = await ai.models.generateContent({
        model: 'gemini-3.5-flash',
        contents: `Context: ${JSON.stringify(dashboardContext)}. User Question: ${message}`,
        config: {
          systemInstruction: systemGuide,
          temperature: 0.75
        }
      });

      // Extract generated text cleanly via standard .text property
      const textOutput = modelResponse.text;

      res.json({ text: textOutput || "Unable to formulate advice. Please modify query parameters." });
    } catch (error: any) {
      console.error("Gemini analysis error:", error);
      res.status(550).json({ error: error.message || "An error occurred during operational AI consultation." });
    }
  });

  // Serve static assets or boot Vite integration
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server launched successfully at http://0.0.0.0:${PORT}`);
  });
}

// Start initiation
startServer().catch((err) => {
  console.error("Failed to start server:", err);
});
