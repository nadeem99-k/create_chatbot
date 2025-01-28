import { NextResponse } from 'next/server';

const HUGGINGFACE_API_URL = "https://api-inference.huggingface.co/models/mistralai/Mixtral-8x7B-Instruct-v0.1";

// Move prompt generation to a pure function
function generatePrompt(mood: string, message: string): string {
  return `You are ${mood}. Please provide a helpful response while staying in character and responding in the same language as the user's message and in the same tone and style as the user's message.

User's message: ${message}

Response:`;
}

interface WeatherData {
  type: 'weather';
  data: {
    temperature: number;
    condition: string;
  };
}

// Separate media enrichment logic
function enrichResponse(message: string) {
  const response = { text: message, media: [] as WeatherData[] };
  
  // Only add media if specific patterns are matched
  if (/weather|temperature|forecast/i.test(message)) {
    response.media.push({
      type: 'weather',
      data: {
        temperature: Math.floor(15 + Math.random() * 15), // Random temp between 15-30
        condition: ['Sunny', 'Cloudy', 'Rainy'][Math.floor(Math.random() * 3)]
      }
    });
  }

  return response;
}

export async function POST(request: Request) {
  try {
    const { message, mood } = await request.json();
    
    if (!message || !mood) {
      return NextResponse.json({ 
        success: false, 
        error: 'Message and mood are required' 
      }, { status: 400 });
    }

    const prompt = generatePrompt(mood, message);
    
    const response = await fetch(HUGGINGFACE_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.HUGGING_FACE_API_KEY}`,
      },
      body: JSON.stringify({
        inputs: prompt,
        parameters: {
          max_new_tokens: 1000,
          temperature: 0.7,
          top_p: 0.95,
          do_sample: true,
        },
      }),
    });

    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }

    const result = await response.json();
    
    if (!result?.[0]?.generated_text) {
      throw new Error('Invalid response format from API');
    }

    const assistantMessage = result[0].generated_text
      .split('Response:')[1]?.trim() ?? 'I apologize, but I could not generate a proper response.';

    const enrichedResponse = enrichResponse(assistantMessage);

    return NextResponse.json({
      success: true,
      response: enrichedResponse.text,
      media: enrichedResponse.media
    });

  } catch (error: unknown) {
    console.error('Chat error:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to process chat message',
      details: process.env.NODE_ENV === 'development' ? 
        error instanceof Error ? error.message : 'Unknown error' 
        : undefined
    }, { status: 500 });
  }
} 