import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextResponse } from 'next/server';

export async function POST(request) {
    try {
        const { messages } = await request.json();

        if (!process.env.GEMINI_API_KEY) {
            return NextResponse.json(
                { error: 'GEMINI_API_KEY not configured' },
                { status: 500 }
            );
        }

        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-3.1-flash-lite" });

        // Convert messages to Gemini format
        let prompt = '';
        let systemPrompt = '';
        
        messages.forEach((message) => {
            if (message.role === 'system') {
                systemPrompt += message.content + '\n\n';
            } else if (message.role === 'user') {
                prompt += `User: ${message.content}\n\n`;
            } else if (message.role === 'assistant') {
                prompt += `Assistant: ${message.content}\n\n`;
            }
        });

        // Combine system prompt with conversation
        const fullPrompt = systemPrompt + prompt + 'Assistant:';

        const result = await model.generateContent(fullPrompt);
        const response = await result.response;
        const text = response.text();

        return NextResponse.json({
            message: {
                role: 'assistant',
                content: text
            }
        });

    } catch (error) {
        console.error('Gemini API error:', error);
        return NextResponse.json(
            { error: 'Failed to generate response' },
            { status: 500 }
        );
    }
}