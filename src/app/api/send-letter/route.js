import puppeteer from "puppeteer-core";
import puppeteerRegular from "puppeteer";
import chromium from "@sparticuz/chromium";
import { generateLetterHTML } from "./letterTemplate";
import nodemailer from "nodemailer";

async function generatePDF({ letterTo, letterFrom, message }) {
	let browser;
	try {
		// Environment-specific browser configuration
		const isProduction = process.env.NODE_ENV === "production";

		if (isProduction) {
			// Production (Vercel) - use puppeteer-core with chromium
			const browserOptions = {
				args: [
					...chromium.args,
					"--hide-scrollbars",
					"--disable-web-security",
					"--no-sandbox",
					"--disable-setuid-sandbox",
					"--disable-dev-shm-usage",
					"--disable-accelerated-2d-canvas",
					"--no-first-run",
					"--no-zygote",
					"--disable-gpu",
				],
				defaultViewport: chromium.defaultViewport,
				executablePath: await chromium.executablePath(),
				headless: chromium.headless,
				ignoreHTTPSErrors: true,
			};
			browser = await puppeteer.launch(browserOptions);
		} else {
			// Development - use regular puppeteer
			browser = await puppeteerRegular.launch({
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
		}

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

async function sendEmail({ email, letterFrom, letterTo, pdfBufferEmail }) {
	const transporter = nodemailer.createTransport({
		service: "gmail",
		auth: {
			user: process.env.EMAIL_USER,
			pass: process.env.EMAIL_PASS,
		},
	});

	const mailOptions = {
		from: process.env.EMAIL_USER,
		to: email,
		subject: `A letter from ${letterFrom}`,
		text: ` Dear ${letterTo}, \n\n  You've got a special letter! \nCheck the attached PDF. \n\n\n With love, \n${letterFrom}`,
		attachments: [
			{
				filename: "letter.pdf",
				content: pdfBufferEmail,
				contentType: "application/pdf",
			},
		],
	};

	await transporter.sendMail(mailOptions);
}

export async function POST(req) {
	try {
		const body = await req.json();
		const { letterTo, letterFrom, message, email } = body;

		const pdfBufferEmail = await generatePDF({
			letterTo,
			letterFrom,
			message,
		});

		const pdfBufferDownload = await generatePDF({
			letterTo,
			letterFrom,
			message,
		});

		if (!pdfBufferDownload || pdfBufferDownload.length === 0) {
			throw new Error("Generated PDF is empty");
		}

		await sendEmail({ email: email, letterFrom, letterTo, pdfBufferEmail });

		return new Response(pdfBufferDownload, {
			status: 200,
			headers: {
				"Content-Type": "application/pdf",
				"Content-Disposition": "attachment; filename=letter.pdf",
			},
		});
	} catch (error) {
		console.error(error);
		return new Response(
			JSON.stringify({ success: false, error: error.message }),
			{
				status: 500,
				headers: { "Content-Type": "application/json" },
			}
		);
	}
}
