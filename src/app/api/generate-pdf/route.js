// Create this file: app/api/generate-pdf/route.js
import puppeteer from "puppeteer";
import { generateLetterHTML } from "../send-letter/letterTemplate";

async function generatePDF({ letterTo, letterFrom, message }) {
	let browser;
	try {
		// Launch browser
		browser = await puppeteer.launch({
			headless: true,
			args: [
				"--no-sandbox",
				"--disable-setuid-sandbox",
				"--disable-dev-shm-usage",
				"--disable-accelerated-2d-canvas",
				"--no-first-run",
				"--no-zygote",
				"--disable-gpu",
			],
		});

		const page = await browser.newPage();

		// Generate HTML content from separate template file
		const htmlContent = generateLetterHTML({
			letterTo,
			letterFrom,
			message,
		});

		await page.setViewport({
			width: 794, // A4 width in pixels at 96 DPI
			height: 1123, // A4 height in pixels at 96 DPI
			deviceScaleFactor: 1,
		});

		// Set content and generate PDF
		await page.setContent(htmlContent, { waitUntil: "networkidle0" });

		const pdfBuffer = await page.pdf({
			format: "A4",
			printBackground: true,
			margin: {
				top: "0mm",
				right: "0mm",
				bottom: "0mm",
				left: "0mm",
			},
			preferCSSPageSize: true,
		});

		return pdfBuffer;
	} catch (error) {
		console.error("Error generating PDF:", error);
		throw error;
	} finally {
		if (browser) {
			await browser.close();
		}
	}
}

export async function POST(req) {
	try {
		const body = await req.json();
		const { letterTo, letterFrom, message } = body;

		// Validate required fields
		if (!letterTo || !letterFrom || !message) {
			return new Response(
				JSON.stringify({
					success: false,
					error: "Missing required fields: letterTo, letterFrom, or message",
				}),
				{
					status: 400,
					headers: { "Content-Type": "application/json" },
				}
			);
		}

		const pdfBuffer = await generatePDF({
			letterTo,
			letterFrom,
			message,
		});

		if (!pdfBuffer || pdfBuffer.length === 0) {
			throw new Error("Generated PDF is empty");
		}

		return new Response(pdfBuffer, {
			status: 200,
			headers: {
				"Content-Type": "application/pdf",
				"Content-Disposition": "attachment; filename=letter.pdf",
			},
		});
	} catch (error) {
		console.error("PDF generation error:", error);
		return new Response(
			JSON.stringify({ success: false, error: error.message }),
			{
				status: 500,
				headers: { "Content-Type": "application/json" },
			}
		);
	}
}
