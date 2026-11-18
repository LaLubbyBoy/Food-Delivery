import express from 'express';
import { fileURLToPath } from 'url';
import path from 'path';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json());

const apiKey = process.env.GEMINI_API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

// API Endpoints for Gemini AI
app.post('/api/gemini/chat', async (req, res) => {
  try {
    const { message, history } = req.body;
    if (!apiKey) {
      return res.status(400).json({ error: 'Gemini API key not configured on server.' });
    }

    const prompt = `You are CraveBot, a friendly and helpful AI customer support assistant for BiteDash, a premium food delivery marketplace. Help the user with their food ordering, menu recommendations, delivery questions, or issue resolution. Keep answers concise, polite, and practical.\n\nUser message: ${message}`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    res.json({ reply: response.text || 'I am here to help with your food delivery needs!' });
  } catch (error: any) {
    console.error('Gemini chat error:', error);
    res.status(500).json({ error: error.message || 'AI service error' });
  }
});

app.post('/api/gemini/recommendations', async (req, res) => {
  try {
    const { preferences, cuisine, timeOfDay } = req.body;
    if (!apiKey) {
      return res.status(400).json({ error: 'Gemini API key not configured.' });
    }

    const prompt = `Based on user preferences "${preferences || 'general'}", favorite cuisine "${cuisine || 'any'}", and time of day "${timeOfDay || 'lunch'}": suggest 3 delicious meal types and explain why in a short appetizing paragraph. Return as JSON format if possible or clean bullet points.`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    res.json({ recommendations: response.text });
  } catch (error: any) {
    console.error('Gemini recommendations error:', error);
    res.status(500).json({ error: error.message || 'AI service error' });
  }
});

app.post('/api/gemini/menu-description', async (req, res) => {
  try {
    const { dishName, ingredients } = req.body;
    if (!apiKey) {
      return res.status(400).json({ error: 'Gemini API key not configured.' });
    }

    const prompt = `Write an extremely appetizing, mouth-watering menu description for a dish named "${dishName}" containing ingredients/details: "${ingredients}". Keep it under 30 words.`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    res.json({ description: response.text?.trim() });
  } catch (error: any) {
    console.error('Gemini menu description error:', error);
    res.status(500).json({ error: error.message || 'AI service error' });
  }
});

app.post('/api/gemini/analytics', async (req, res) => {
  try {
    const { salesData } = req.body;
    if (!apiKey) {
      return res.status(400).json({ error: 'Gemini API key not configured.' });
    }

    const prompt = `Analyze this restaurant sales data summary and provide 3 actionable business recommendations to increase revenue and customer satisfaction:\n${JSON.stringify(salesData)}`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    res.json({ insights: response.text });
  } catch (error: any) {
    console.error('Gemini analytics error:', error);
    res.status(500).json({ error: error.message || 'AI service error' });
  }
});

// Secure Payment Verification API (Paystack / Flutterwave simulation)
app.post('/api/payment/verify', async (req, res) => {
  try {
    const { reference, provider, amount } = req.body;
    // Server-side validation logic for payment reference
    if (!reference) {
      return res.status(400).json({ success: false, message: 'Invalid payment reference' });
    }

    // In production, this would call Paystack/Flutterwave API to verify transaction
    // Here we verify simulation successfully
    setTimeout(() => {
      res.json({
        success: true,
        reference,
        provider: provider || 'paystack',
        amount,
        status: 'successful',
        verifiedAt: new Date().toISOString(),
      });
    }, 600);
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Vite integration in development
if (process.env.NODE_ENV !== 'production') {
  const { createServer: createViteServer } = await import('vite');
  const vite = await createViteServer({
    server: { middlewareMode: true },
  });
  app.use(vite.middlewares);
} else {
  app.use(express.static(path.join(__dirname, 'dist')));
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
  });
}

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
