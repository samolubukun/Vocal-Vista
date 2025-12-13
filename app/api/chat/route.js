import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextResponse } from 'next/server';

export async function POST(request) {
    try {
        const { messages, scanContext } = await request.json();

        if (!process.env.GEMINI_API_KEY) {
            return NextResponse.json(
                { error: 'GEMINI_API_KEY not configured' },
                { status: 500 }
            );
        }

        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

        let systemPrompt = `You are an expert AI skincare consultant for Réstoir Health, a personalized skincare platform. You provide science-backed, helpful advice about:
- Skincare routines and best practices
- Product ingredients and their effects
- Skin conditions like acne, eczema, hyperpigmentation, etc.
- Lifestyle factors affecting skin health
- Product recommendations based on skin type and concerns

Guidelines:
- Be friendly, supportive, and encouraging
- Provide accurate, science-backed information
- Always recommend consulting a dermatologist for serious concerns
- Keep responses concise but informative (2-3 paragraphs max)
- Use simple language, avoid overly technical jargon
- Be culturally sensitive and aware that many users are from Africa
- Consider that access to certain products may vary by region
- Focus on practical, actionable advice

Remember: You're helping users understand their skin better and make informed decisions about their skincare journey.`;

        // Add scan context if available
        if (scanContext) {
            systemPrompt += `\n\nUser's Recent Skin Scan Results:
- Overall Skin Score: ${scanContext.overallScore}/100
- Skin Type: ${scanContext.skinType}
- Identified Conditions: ${scanContext.conditions?.map(c => `${c.name} (${c.severity})`).join(', ') || 'None detected'}
- Analysis: ${scanContext.detailedAnalysis}

Please reference these findings when providing advice and recommendations. Make your advice specific to their skin analysis results.`;
        }

        // Build conversation history
        let conversationHistory = systemPrompt + '\n\n';
        
        messages.forEach((message) => {
            if (message.role === 'user') {
                conversationHistory += `User: ${message.content}\n\n`;
            } else if (message.role === 'assistant') {
                conversationHistory += `Assistant: ${message.content}\n\n`;
            }
        });

        conversationHistory += 'Assistant:';

        const result = await model.generateContent(conversationHistory);
        const response = await result.response;
        const text = response.text();

        // Extract product recommendations from the response
        const products = await extractAndSearchProducts(text);

        return NextResponse.json({
            message: {
                role: 'assistant',
                content: text.trim()
            },
            products: products
        });

    } catch (error) {
        console.error('Chat API error:', error);
        return NextResponse.json(
            { error: 'Failed to generate response' },
            { status: 500 }
        );
    }
}

async function extractAndSearchProducts(text) {
    try {
        // Keywords that indicate product recommendations
        const productKeywords = [
            'recommend', 'use', 'try', 'product', 'cream', 'serum', 'cleanser', 'moisturizer',
            'sunscreen', 'tretinoin', 'retinol', 'vitamin c', 'niacinamide', 'hyaluronic',
            'salicylic acid', 'benzoyl peroxide', 'adapalene', 'azelaic acid', 'cerave',
            'neutrogena', 'olay', 'cetaphil', 'la roche posay', 'clinical', 'dermatological'
        ];

        // Check if response mentions products
        const hasProductMention = productKeywords.some(keyword =>
            text.toLowerCase().includes(keyword)
        );

        if (!hasProductMention) {
            return [];
        }

        // Extract potential product names using simple heuristics
        // Look for capitalized words/phrases that appear near product keywords
        const productNameRegex = /(?:recommend|suggest|try|use|with)\s+([A-Z][a-zA-Z0-9\s\-]+(?:cream|serum|cleanser|lotion|moisturizer|sunscreen|oil|mask|wash|acid|peroxide)?)/gi;
        
        const matches = [];
        let match;
        const extractedProducts = new Set();

        while ((match = productNameRegex.exec(text)) !== null) {
            const productName = match[1].trim();
            if (productName.length > 3 && productName.length < 100 && !extractedProducts.has(productName)) {
                extractedProducts.add(productName);
                matches.push(productName);
            }
        }

        // Also extract common skincare product names mentioned
        const commonProducts = [
            'cerave', 'neutrogena', 'olay', 'cetaphil', 'la roche posay',
            'tretinoin', 'adapalene', 'azelaic acid', 'benzoyl peroxide',
            'salicylic acid', 'niacinamide', 'vitamin c serum', 'hyaluronic acid'
        ];

        for (const product of commonProducts) {
            if (text.toLowerCase().includes(product) && !extractedProducts.has(product)) {
                extractedProducts.add(product);
                matches.push(product);
            }
        }

        // Search for top 3 products
        const searchResults = [];
        for (const productName of matches.slice(0, 3)) {
            try {
                const searchRes = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/search-products`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ productName })
                });

                if (searchRes.ok) {
                    const data = await searchRes.json();
                    if (data.products && data.products.length > 0) {
                        searchResults.push(...data.products.slice(0, 2));
                    }
                }
            } catch (error) {
                console.error(`Failed to search for product ${productName}:`, error);
            }
        }

        return searchResults.slice(0, 5);
    } catch (error) {
        console.error('Error extracting products:', error);
        return [];
    }
}
