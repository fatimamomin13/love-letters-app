// api/enhance-letter/route.js
import { createOpenAI } from "@ai-sdk/openai";
import { generateText } from "ai";

// Initialize DeepInfra client
const deepinfra = createOpenAI({
	apiKey: process.env.DEEPINFRA_API_KEY,
	baseURL: "https://api.deepinfra.com/v1/openai",
});

export async function POST(req) {
	try {
		const body = await req.json();
		const { message, letterTo, letterFrom } = body;

		if (!message || message.trim().length === 0) {
			return new Response(
				JSON.stringify({ error: "Message is required" }),
				{
					status: 400,
					headers: { "Content-Type": "application/json" },
				}
			);
		}

		// Create a prompt for enhancing the letter
		const prompt = `You are a professional letter writer specializing in heartfelt, personal correspondence. Your task is to enhance the following letter while preserving the original sender's voice, emotions, and personal touches. 

Key guidelines:
- Maintain the original tone and sentiment
- Keep all personal details, memories, and specific references
- Improve grammar, flow, and emotional expression
- Add elegant transitions between thoughts
- Enhance the romantic or heartfelt language without making it overly dramatic
- IMPORTANT: Keep the enhanced letter under 800 characters total
- Make it feel more polished while staying authentic
- Do not add any fake details or memories that weren't in the original
- Return ONLY the enhanced letter content without any prefixes, explanations, or introductory text
- Focus on quality improvements rather than length expansion

Original letter from ${letterFrom} to ${letterTo}:
"${message}"

Enhanced letter (must be under 800 characters):`;

		const result = await generateText({
			model: deepinfra("meta-llama/Meta-Llama-3.1-70B-Instruct"),
			prompt: prompt,
			maxTokens: 800,
			temperature: 0.7,
		});

		let enhancedMessage = result.text.trim();

		// Clean up common AI response prefixes
		const prefixesToRemove = [
			/^here'?s your enhanced letter:?\s*/i,
			/^enhanced letter:?\s*/i,
			/^here'?s the enhanced version:?\s*/i,
			/^the enhanced letter is:?\s*/i,
			/^enhanced version:?\s*/i,
			/^here'?s an enhanced version:?\s*/i,
		];

		prefixesToRemove.forEach((prefix) => {
			enhancedMessage = enhancedMessage.replace(prefix, "");
		});

		// Remove any leading/trailing quotes if they wrap the entire message
		if (enhancedMessage.startsWith('"') && enhancedMessage.endsWith('"')) {
			enhancedMessage = enhancedMessage.slice(1, -1);
		}

		enhancedMessage = enhancedMessage.trim();

		// Ensure the enhanced message doesn't exceed 800 characters
		if (enhancedMessage.length > 800) {
			enhancedMessage = enhancedMessage.substring(0, 797) + "...";
		}

		// Basic validation
		if (!enhancedMessage || enhancedMessage.length < 20) {
			throw new Error("AI generated an invalid response");
		}

		return new Response(JSON.stringify({ enhancedMessage }), {
			status: 200,
			headers: { "Content-Type": "application/json" },
		});
	} catch (error) {
		console.error("Error enhancing letter:", error);

		// Check if it's an API key error
		if (
			error.message?.includes("API key") ||
			error.message?.includes("authentication")
		) {
			return new Response(
				JSON.stringify({
					error: "AI service configuration error. Please check API key.",
				}),
				{
					status: 500,
					headers: { "Content-Type": "application/json" },
				}
			);
		}

		// Check if it's a rate limit error
		if (error.message?.includes("rate limit") || error.status === 429) {
			return new Response(
				JSON.stringify({
					error: "AI service is temporarily busy. Please try again in a moment.",
				}),
				{
					status: 429,
					headers: { "Content-Type": "application/json" },
				}
			);
		}

		return new Response(
			JSON.stringify({
				error: "Failed to enhance letter. Please try again.",
			}),
			{
				status: 500,
				headers: { "Content-Type": "application/json" },
			}
		);
	}
}
