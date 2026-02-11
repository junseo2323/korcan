import { NextResponse } from 'next/server'
import OpenAI from 'openai'

export const dynamic = 'force-dynamic'

// Initialize OpenAI client
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
})

export async function POST(req: Request) {
    try {
        const formData = await req.formData()
        const file = formData.get('file') as File

        if (!file) {
            return NextResponse.json({ error: 'No file provided' }, { status: 400 })
        }

        // Check if API key is configured
        if (!process.env.OPENAI_API_KEY) {
            return NextResponse.json({
                error: 'OpenAI API Key is missing. Please add OPENAI_API_KEY to your .env.local file.'
            }, { status: 500 })
        }

        // Convert file to base64
        const buffer = await file.arrayBuffer()
        const base64Image = Buffer.from(buffer).toString('base64')
        const dataUrl = `data:${file.type};base64,${base64Image}`

        const prompt = `
      Analyze this receipt image and extract the following information in JSON format:
      - total_amount (number, e.g., 12.50)
      - currency (string, e.g., 'CAD', 'KRW', 'USD'. deeply prefer 'CAD' or 'KRW' if ambiguous based on context commonly found in Canada/Korea receipts)
      - date (string, YYYY-MM-DD format. If year is missing, assume current year 2025 unless clearly otherwise)
      - category (string, strictly one of: 'Food', 'Transport', 'Shopping', 'Other'. Use 'Food' for restaurants/groceries, 'Transport' for gas/transit, 'Shopping' for clothing/electronics/etc.)
      - merchant_name (string, the name of the store/vendor)
      - tags (array of strings. Select relevant tags ONLY from this list: ['음식', '커피', '여가', '생필품', '학습', '구독비용', '기타']. Example: ['음식', '커피'] for a cafe that serves food and coffee)

      If any field is missing or illegible, make a best guess or use null.
      Return ONLY the JSON object, no markdown formatting.
    `

        const response = await openai.chat.completions.create({
            model: 'gpt-4o',
            messages: [
                {
                    role: 'user',
                    content: [
                        { type: 'text', text: prompt },
                        {
                            type: 'image_url',
                            image_url: {
                                url: dataUrl,
                            },
                        },
                    ],
                },
            ],
            max_tokens: 500,
        })

        const content = response.choices[0]?.message?.content

        if (!content) {
            throw new Error('No response from OpenAI')
        }

        // Clean up response if it contains markdown code blocks
        const cleanContent = content.replace(/```json\n?|\n?```/g, '').trim()

        let result
        try {
            result = JSON.parse(cleanContent)
        } catch (e) {
            console.error('Failed to parse JSON from OpenAI:', content)
            return NextResponse.json({ error: 'Failed to parse AI response' }, { status: 500 })
        }

        return NextResponse.json(result)

    } catch (error) {
        console.error('Error analyzing receipt:', error)
        return NextResponse.json(
            { error: 'Failed to analyze receipt' },
            { status: 500 }
        )
    }
}
