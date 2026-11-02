import 'dotenv/config';
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, ThinkingLevel } from '@google/genai';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // High-Thinking Gemini 4 Argon Visagismo & Dermocosmetic Style Advisor
  app.post('/api/advisor', async (req, res) => {
    try {
      const { faceShape, hairType, beardDensity, skinConcern, occasion } = req.body || {};

      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey || apiKey === 'MY_GEMINI_API_KEY') {
        return res.status(400).json({
          error:
            'Clave API de Gemini no configurada. Selecciona tu clave API en el panel Settings > Secrets.',
        });
      }

      const ai = new GoogleGenAI({
        apiKey,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          },
        },
      });

      const prompt = `Actúa como el Master Barber y Especialista Dermo-Capilar principal de Maná Barbería en San José del Guaviare, Colombia.
Analiza el siguiente perfil del cliente y ofrece una recomendación personalizada, elegante y estructurada en español (máximo 180 palabras):
- Tipo de rostro: ${faceShape || 'Ovalado'}
- Textura de cabello: ${hairType || 'Ondulado grueso'}
- Densidad de barba: ${beardDensity || 'Media'}
- Condición de la piel en clima cálido/polvo (San José del Guaviare): ${skinConcern || 'Poros obstruidos y fatiga'}
- Estilo u ocasión: ${occasion || 'Ejecutivo moderno'}

Incluye:
1. Corte exacto recomendado en Maná Barbería (ej. Mid Fade, Taper, Mullet moderno o Corte Ejecutivo) y por qué favorece sus facciones.
2. Geometría de barba o perfilado a navaja ideal.
3. Protocolo facial recomendado (Vapor Ozono, Mascarilla de Ácido Hialurónico 2X o Parches de Colágeno) explicando su beneficio bioquímico para su piel.`;

      const response = await ai.models.generateContent({
        model: 'gemini-4-argon',
        contents: prompt,
        config: {
          systemInstruction:
            'Eres el director de visagismo y cuidado dermo-cosmético masculino de Maná Barbería en San José del Guaviare. Responde con precisión técnica, tono elegante y recomendaciones accionables.',
          thinkingConfig: {
            thinkingLevel: ThinkingLevel.HIGH,
          },
        },
      });

      return res.json({
        recommendation: response.text || 'Recomendación generada con éxito.',
        model: 'gemini-4-argon',
        thinkingLevel: 'HIGH',
      });
    } catch (error: any) {
      console.error('Gemini API Error:', error);
      const status = error?.status || 500;
      return res.status(status).json({
        error:
          error?.message ||
          'No se pudo procesar la consulta de visagismo en este momento. Verifica tu clave API en Settings > Secrets.',
      });
    }
  });

  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Maná Barbería server running on http://localhost:${PORT}`);
  });
}

startServer();
