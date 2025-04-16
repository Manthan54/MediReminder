
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { GoogleGenerativeAI } from "https://esm.sh/@google/generative-ai@0.2.0"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { message } = await req.json();
    const apiKey = Deno.env.get('GEMINI_API_KEY');

    if (!apiKey) {
      throw new Error('Missing Gemini API key');
    }

    // Initialize Gemini
    const genAI = new GoogleGenerativeAI(apiKey);
    // Use gemini-1.5-flash instead of gemini-pro (which is deprecated)
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // Create chat context with medical assistant prompt
    const chat = model.startChat({
      history: [
        {
          role: "user",
          parts: "You are a medical assistant. You should provide detailed information about medications, symptoms, and health recommendations. Always include relevant medical disclaimers.",
        },
        {
          role: "model",
          parts: "I understand that I am a medical assistant, and I will provide detailed information about medications, symptoms, and health recommendations while including appropriate medical disclaimers. I will ensure my responses are informative and responsible.",
        },
      ],
      generationConfig: {
        maxOutputTokens: 1000,
      },
    });

    // Get the chat response
    const result = await chat.sendMessage(message);
    const response = await result.response;
    const text = response.text();

    console.log('Generated response:', text);

    return new Response(
      JSON.stringify({ response: text }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      },
    );
  } catch (error) {
    console.error('Error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      },
    );
  }
});
