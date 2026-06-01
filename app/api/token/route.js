import { DeepgramClient } from "@deepgram/sdk";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const key = process.env.DEEPGRAM_API_KEY;

        if (!key) {
            console.error("❌ DEEPGRAM_API_KEY is not defined in environment variables.");
            return new NextResponse("Deepgram API key is not configured", { status: 500 });
        }

        // Return the actual key to authorize Agent Converse WebSockets
        return NextResponse.json({ token: key });
    } catch (error) {
        console.error("❌ Token route error:", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}
