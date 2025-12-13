import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextResponse } from 'next/server';

export async function POST(request) {
    try {
        const { products, skinType, conditions } = await request.json();

        if (!process.env.GEMINI_API_KEY) {
            return NextResponse.json(
                { error: 'GEMINI_API_KEY not configured' },
                { status: 500 }
            );
        }

        if (!products || products.length === 0) {
            return NextResponse.json({ guide: null });
        }

        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

        const productList = products.map(p => `- ${p.name}`).join('\n');
        const conditionsList = conditions?.map(c => c.name).join(', ') || 'general skincare';

        const prompt = `You are a skincare expert. A user has access to these products from a pharmacy:

${productList}

User's skin type: ${skinType || 'Not specified'}
User's skin concerns: ${conditionsList}

IMPORTANT: Do NOT recommend all products. Instead, provide 3-4 DIFFERENT ROUTINE OPTIONS that users can choose from based on budget and skin tolerance.

CRITICAL FORMATTING RULES:
1. Each routine option MUST start with: **ROUTINE OPTION [NUMBER]: [DESCRIPTIVE NAME]**
2. Each option section must have clear formatting with dashes or underscores
3. Include ONLY these sections per routine option (in this exact order):
   - **Description:** Brief explanation of who this option is for
   - **Products Used:** Simple list of product names
   - **Morning Routine:** Numbered steps with products
   - **Evening Routine:** Numbered steps with products
   - **Throughout the Day:** Optional, for daytime treatments
   - **Best For:** Which specific concerns/skin conditions it targets

Example format:

**ROUTINE OPTION 1: Budget-Friendly Basic**

**Description:** Perfect for beginners or those on a tight budget. This focuses on essentials: cleanse, treat, and protect.

**Products Used:**
- Product A
- Product B
- Product C

**Morning Routine:**
1. [Product name]: [brief detail about application]
2. [Product name]: [brief detail]
3. [Product name]: [brief detail]

**Evening Routine:**
1. [Product name]: [brief detail]
2. [Product name]: [brief detail]

**Throughout the Day:**
- [Optional product with usage]

**Best For:** [List specific concerns this targets]

---

**ROUTINE OPTION 2: [NAME]**
[Same structure]

---

**ROUTINE OPTION 3: [NAME]**
[Same structure]

---

**ROUTINE OPTION 4: [NAME]** (if you have 4+ product options)
[Same structure]

---

**Important Tips:**
- Avoid combining: [specific product conflicts]
- Introduction strategy: [how to gradually add products]
- Overtreatment signs: [warning signs of too many products]
- Sunscreen note: [whether it's essential for this skin type]

Format MUST be exact with clear section headers and dashes between options. Each routine option is independent and complete.`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        return NextResponse.json({
            guide: text.trim()
        });

    } catch (error) {
        console.error('Product usage guide API error:', error);
        return NextResponse.json(
            { error: 'Failed to generate usage guide' },
            { status: 500 }
        );
    }
}
