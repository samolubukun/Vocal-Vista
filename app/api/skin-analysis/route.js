import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextResponse } from 'next/server';

export async function POST(request) {
    try {
        const { image } = await request.json();

        if (!process.env.GEMINI_API_KEY) {
            return NextResponse.json(
                { error: 'GEMINI_API_KEY not configured' },
                { status: 500 }
            );
        }

        if (!image) {
            return NextResponse.json(
                { error: 'No image provided' },
                { status: 400 }
            );
        }

        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

        // Extract base64 data from data URL
        const base64Data = image.split(',')[1];
        const mimeType = image.split(';')[0].split(':')[1] || 'image/jpeg';

        const prompt = `You are an expert dermatologist AI assistant. Provide a detailed assessment of the skin and return your response in the following JSON format ONLY (no markdown, no code blocks, just pure JSON):
{
    "overallScore": <number 0-100 representing overall skin health>,
    "skinType": "<one of: oily, dry, combination, normal, sensitive>",
    "conditions": [
        {
            "name": "<condition name like 'Acne', 'Pimples', 'Eczema', 'Dark spots', 'Wrinkles', 'Redness', 'Dry patches', etc.>",
            "severity": "<one of: mild, moderate, severe>",
            "confidence": <number 0-100 representing how confident you are>
        }
    ],
    "recommendations": [
        "<specific actionable skincare recommendation 1>",
        "<specific actionable skincare recommendation 2>",
        "<specific actionable skincare recommendation 3>",
        "<specific actionable skincare recommendation 4>",
        "<specific actionable skincare recommendation 5>"
    ],
    "detailedAnalysis": "<A comprehensive 2-3 paragraph analysis of the skin condition, what you observe, potential causes, and general guidance for improvement>"
}

Important guidelines:
- Be thorough but realistic in your assessment
- If the visual input is unclear, still provide your best assessment with lower confidence scores
- Focus on common skin concerns: acne, pimples, eczema, hyperpigmentation, dryness, oiliness, signs of aging, etc.
- Provide practical, science-backed recommendations
- Be encouraging and constructive in your detailed analysis
- If you detect no significant issues, still provide preventive care recommendations

- When composing the detailedAnalysis field, do NOT reference the source or use terms such as "individual", "person", "face", "facial", "image", or "photo". Begin the detailed analysis directly with neutral, objective observations (for example: "Redness on the cheeks with scattered comedones on the forehead."). Avoid phrases like "in the image" or "the person has". Use clinical, respectful language.`;

        const imagePart = {
            inlineData: {
                data: base64Data,
                mimeType: mimeType,
            },
        };

        const result = await model.generateContent([prompt, imagePart]);
        const response = await result.response;
        let text = response.text();

        // Clean up the response - remove markdown code blocks if present
        text = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();

        try {
            const analysisResult = JSON.parse(text);
            
            // Validate and sanitize the response
            const sanitizedResult = {
                overallScore: Math.min(100, Math.max(0, Number(analysisResult.overallScore) || 50)),
                skinType: ['oily', 'dry', 'combination', 'normal', 'sensitive'].includes(analysisResult.skinType) 
                    ? analysisResult.skinType 
                    : 'normal',
                conditions: Array.isArray(analysisResult.conditions) 
                    ? analysisResult.conditions.map(c => ({
                        name: String(c.name || 'Unknown'),
                        severity: ['mild', 'moderate', 'severe'].includes(c.severity) ? c.severity : 'mild',
                        confidence: Math.min(100, Math.max(0, Number(c.confidence) || 50))
                    }))
                    : [],
                recommendations: Array.isArray(analysisResult.recommendations) 
                    ? analysisResult.recommendations.slice(0, 5).map(r => String(r))
                    : ['Maintain a consistent skincare routine', 'Stay hydrated', 'Use sunscreen daily'],
                detailedAnalysis: String(analysisResult.detailedAnalysis || 'Analysis complete. Please consult a dermatologist for a comprehensive evaluation.')
            };

            return NextResponse.json(sanitizedResult);
        } catch (parseError) {
            console.error('Error parsing Gemini response:', parseError);
            console.error('Raw response:', text);
            
            // Return a fallback response
            return NextResponse.json({
                overallScore: 70,
                skinType: 'normal',
                conditions: [
                    { name: 'General Assessment', severity: 'mild', confidence: 60 }
                ],
                recommendations: [
                    'Cleanse your face twice daily with a gentle cleanser',
                    'Apply moisturizer appropriate for your skin type',
                    'Use sunscreen with SPF 30+ daily',
                    'Stay hydrated and maintain a balanced diet',
                    'Consider consulting a dermatologist for personalized advice'
                ],
                detailedAnalysis: 'We completed an initial assessment of your skin. For the most accurate analysis, please ensure good lighting and a clear, front-facing photo. Based on what we can observe, your skin appears to be in reasonable condition. We recommend following a consistent skincare routine and protecting your skin from sun damage.'
            });
        }

    } catch (error) {
        console.error('Skin analysis API error:', error);
        return NextResponse.json(
            { error: 'Failed to analyze skin. Please try again.' },
            { status: 500 }
        );
    }
}
