"use client";
import { generateLetterHTML } from "./api/send-letter/letterTemplate";
import { useEffect, useState } from "react";

export default function Home() {
	const [letterTo, setLetterTo] = useState("");
	const [letterFrom, setLetterFrom] = useState("");
	const [message, setMessage] = useState("");
	const [email, setEmail] = useState("");
	const [lastData, setLastData] = useState({});
	const [blob, setBlob] = useState(null);
	const [showPreview, setShowPreview] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const [isDownloadingFromPreview, setIsDownloadingFromPreview] =
		useState(false);
	const [backgroundLoaded, setBackgroundLoaded] = useState(false);

	const MAX_CHARS = 700;
	const MIN_CHARS = 200;

	useEffect(() => {
		const img = new Image();
		img.onload = () => setBackgroundLoaded(true);
		img.src =
			"https://i.postimg.cc/D7QFVcbF/Brown-Floral-Background-A4-Document.png";
	}, []);

	const handleSubmit = async (e) => {
		e.preventDefault();
		setIsLoading(true);
		setLastData({ letterTo, letterFrom, message, email });
		try {
			const res = await fetch("api/send-letter", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ letterTo, letterFrom, message, email }),
			});

			const contentType = res.headers.get("Content-Type");

			if (!res.ok) {
				const errorJson = await res.json();
				console.error("Error from API:", errorJson.error);
				alert("Error sending letter. Please try again.");
				return;
			}

			if (contentType === "application/pdf") {
				const blobData = await res.blob();
				if (blobData.size > 0) {
					setBlob(blobData);
					alert("Letter sent successfully!");
				} else {
					console.error("Received empty PDF blob");
				}
			} else {
				console.error("Unexpected content type", contentType);
			}
		} catch (error) {
			console.log(error);
			alert("Error sending letter. Please try again.");
		} finally {
			setIsLoading(false);
		}
	};

	// Download function for preview (without email)
	const handleDownloadFromPreview = async () => {
		if (!letterTo || !letterFrom || !message) {
			alert("Please fill in all fields before downloading");
			return;
		}

		setIsDownloadingFromPreview(true);

		try {
			const res = await fetch("api/generate-pdf", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ letterTo, letterFrom, message }),
			});

			const contentType = res.headers.get("Content-Type");

			if (!res.ok) {
				const errorJson = await res.json();
				console.error("Error from API:", errorJson.error);
				alert("Error generating PDF. Please try again.");
				return;
			}

			if (contentType === "application/pdf") {
				const blobData = await res.blob();
				if (blobData.size > 0) {
					// Download the PDF
					const url = window.URL.createObjectURL(blobData);
					const a = document.createElement("a");
					a.href = url;
					a.download = "letter.pdf";
					document.body.appendChild(a);
					a.click();
					a.remove();
					window.URL.revokeObjectURL(url);
				} else {
					console.error("Received empty PDF blob");
					alert("Error: Received empty PDF. Please try again.");
				}
			} else {
				console.error("Unexpected content type", contentType);
				alert(
					"Error: Unexpected response from server. Please try again."
				);
			}
		} catch (error) {
			console.error("Download error:", error);
			alert(
				"Error downloading PDF. Please check your connection and try again."
			);
		} finally {
			setIsDownloadingFromPreview(false);
		}
	};

	const handlePreview = () => {
		// Only show preview if we have the required fields
		if (letterTo && letterFrom && message) {
			setShowPreview(true);
		} else {
			alert("Please fill in all fields before preview");
		}
	};

	const closePreview = () => {
		setShowPreview(false);
	};

	const generatePreviewHTML = () => {
		return generateLetterHTML({ letterTo, letterFrom, message });
	};

	const previewHTML = showPreview ? generatePreviewHTML() : "";

	const handleMessageChange = (e) => {
		const value = e.target.value;
		if (value.length <= MAX_CHARS) {
			setMessage(value);
		}
	};

	const getCharacterCountColor = () => {
		const remaining = MAX_CHARS - message.length;
		if (remaining < 50) return "text-red-600";
		if (remaining < 150) return "text-amber-600";
		return "text-stone-500";
	};

	// Calculate responsive scaling
	const getIframeScale = () => {
		if (typeof window === "undefined") return 0.6;

		const screenWidth = window.innerWidth;
		const screenHeight = window.innerHeight;

		// A4 dimensions in pixels (210mm x 297mm at 96 DPI)
		const a4Width = 794;
		const a4Height = 1123;

		// Available space (minus padding and close button)
		const availableWidth = screenWidth - 40; // 20px padding on each side
		const availableHeight = screenHeight - 140; // Space for close button, download button and padding

		// Calculate scale to fit both width and height
		const scaleX = availableWidth / a4Width;
		const scaleY = availableHeight / a4Height;

		// Use the smaller scale to ensure it fits completely
		const scale = Math.min(scaleX, scaleY, 1); // Don't scale up beyond 100%

		return Math.max(scale, 0.2); // Minimum scale of 0.2
	};

	const [iframeScale, setIframeScale] = useState(0.6);

	useEffect(() => {
		const updateScale = () => {
			setIframeScale(getIframeScale());
		};

		updateScale();
		window.addEventListener("resize", updateScale);

		return () => window.removeEventListener("resize", updateScale);
	}, []);

	return (
		<div className="min-h-screen w-full relative">
			{/* Background Layer - Fixed for mobile compatibility */}
			<div
				className={`fixed inset-0 bg-cover bg-center bg-no-repeat transition-opacity duration-500 ${
					backgroundLoaded ? "opacity-100" : "opacity-0"
				}`}
				style={{
					backgroundImage: backgroundLoaded
						? `url("https://i.postimg.cc/D7QFVcbF/Brown-Floral-Background-A4-Document.png")`
						: "none",
					// Removed backgroundAttachment: "fixed" to prevent mobile issues
					minHeight: "100vh",
					width: "100%",
				}}
			/>

			{/* Fallback background while loading */}
			{!backgroundLoaded && (
				<div className="fixed inset-0 bg-gradient-to-br from-amber-50 to-orange-100" />
			)}

			{/* Overlay for better readability */}
			<div className="fixed inset-0 bg-white/20 backdrop-blur-[1px]" />

			{/* Main Content */}
			<div className="relative z-10 min-h-screen w-full py-8 px-4 sm:px-6 lg:px-8">
				<div className="max-w-2xl mx-auto">
					{/* Header */}
					<div className="text-center mb-8">
						<h1 className="text-4xl md:text-5xl font-serif text-stone-800 mb-2 drop-shadow-sm">
							Love Letters
						</h1>
						<p className="text-stone-700 text-lg font-light drop-shadow-sm">
							Pour your heart onto paper
						</p>
					</div>

					{/* Form Container */}
					<div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/50 p-8 mb-8">
						<div className="space-y-6">
							{/* To Field */}
							<div className="space-y-2">
								<label className="block text-stone-800 font-semibold text-sm tracking-wide">
									To
								</label>
								<input
									type="text"
									name="To"
									id="to"
									placeholder="Send Letter To"
									value={letterTo}
									onChange={(e) =>
										setLetterTo(e.target.value)
									}
									className="w-full px-4 py-3 bg-white/90 border border-stone-300/60 rounded-xl 
                    focus:ring-2 focus:ring-amber-300 focus:border-amber-400 
                    transition-all duration-200 placeholder-stone-400 text-stone-800
                    font-light tracking-wide shadow-sm"
								/>
							</div>

							{/* From Field */}
							<div className="space-y-2">
								<label className="block text-stone-800 font-semibold text-sm tracking-wide">
									From
								</label>
								<input
									type="text"
									name="From"
									id="letterFrom"
									placeholder="Send Letter From"
									value={letterFrom}
									onChange={(e) =>
										setLetterFrom(e.target.value)
									}
									className="w-full px-4 py-3 bg-white/90 border border-stone-300/60 rounded-xl 
                    focus:ring-2 focus:ring-amber-300 focus:border-amber-400 
                    transition-all duration-200 placeholder-stone-400 text-stone-800
                    font-light tracking-wide shadow-sm"
								/>
							</div>

							{/* Email Field */}
							<div className="space-y-2">
								<label className="block text-stone-800 font-semibold text-sm tracking-wide">
									Email
								</label>
								<input
									type="email"
									name="Email"
									id="toemail"
									placeholder="Receiver's Email"
									value={email}
									onChange={(e) => setEmail(e.target.value)}
									className="w-full px-4 py-3 bg-white/90 border border-stone-300/60 rounded-xl 
                    focus:ring-2 focus:ring-amber-300 focus:border-amber-400 
                    transition-all duration-200 placeholder-stone-400 text-stone-800
                    font-light tracking-wide shadow-sm"
								/>
							</div>

							{/* Message Field */}
							<div className="space-y-2">
								<label className="block text-stone-800 font-semibold text-sm tracking-wide">
									Your Letter
								</label>
								<textarea
									name="Letter"
									id="message"
									rows={8}
									placeholder="Pour your heart out here... Share specific memories, what you love about them, how they make you feel..."
									value={message}
									onChange={handleMessageChange}
									className="w-full px-4 py-3 bg-white/90 border border-stone-300/60 rounded-xl 
                    focus:ring-2 focus:ring-amber-300 focus:border-amber-400 
                    transition-all duration-200 placeholder-stone-400 text-stone-800
                    font-light tracking-wide resize-none shadow-sm"
								/>

								{/* Character Count */}
								<div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 text-sm">
									<span
										className={`${getCharacterCountColor()} font-medium`}
									>
										{message.length}/{MAX_CHARS} characters
									</span>
									{message.length < MIN_CHARS && (
										<span className="text-amber-600 font-light">
											Minimum {MIN_CHARS} characters
											recommended
										</span>
									)}
								</div>

								{/* Progress Bar */}
								<div className="w-full bg-stone-200/60 rounded-full h-2 overflow-hidden">
									<div
										className="h-full bg-gradient-to-r from-amber-300 to-amber-500 transition-all duration-300 ease-out rounded-full"
										style={{
											width: `${Math.min(
												(message.length / MAX_CHARS) *
													100,
												100
											)}%`,
										}}
									/>
								</div>
							</div>

							{/* Submit Button - Updated to match brown floral theme */}
							<button
								type="submit"
								onClick={handleSubmit}
								disabled={isLoading}
								className="w-full py-4 bg-customBrown hover:bg-customBrown/90 
                  disabled:bg-gray-500 disabled:hover:bg-gray-500
                  text-white font-semibold tracking-wide rounded-xl 
                  shadow-xl hover:shadow-2xl transition-all duration-300 
                  transform hover:scale-[1.02] active:scale-[0.98]
                  border border-customBrown/70 disabled:cursor-not-allowed
                  flex items-center justify-center gap-2"
							>
								{isLoading ? (
									<>
										<div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
										Sending...
									</>
								) : (
									<>Send Letter ✉️</>
								)}
							</button>
						</div>
					</div>

					{/* Action Buttons - Updated to match brown floral theme */}
					<div className="grid grid-cols-1 sm:grid-cols-1 gap-4 max-w-lg mx-auto">
						<button
							onClick={handlePreview}
							type="button"
							className="group relative overflow-hidden py-4 px-6 
                bg-customBrown hover:bg-customBrown/90 
                text-white font-semibold tracking-wide rounded-xl 
                border border-customBrown/80
                shadow-lg hover:shadow-xl transition-all duration-300 
                transform hover:scale-[1.02] active:scale-[0.98]
                flex items-center justify-center gap-2"
						>
							<div
								className="absolute inset-0 bg-customBrown/30 
                opacity-0 group-hover:opacity-100 transition-opacity duration-300"
							></div>
							<span className="relative">👁️ Preview Letter</span>
						</button>
					</div>
				</div>
			</div>
			{showPreview && (
				<div
					style={{
						position: "fixed",
						top: 0,
						left: 0,
						width: "100%",
						height: "100%",
						backgroundColor: "rgba(0,0,0,0.9)",
						zIndex: 1000,
						display: "flex",
						justifyContent: "center",
						alignItems: "center",
						padding: "20px",
						overflow: "hidden", // Prevent scrolling
					}}
				>
					{/* Top controls bar */}
					<div
						style={{
							position: "absolute",
							top: "20px",
							left: "20px",
							right: "20px",
							display: "flex",
							justifyContent: "space-between",
							alignItems: "center",
							zIndex: 1001,
						}}
					>
						{/* Download button in preview */}
						<button
							onClick={handleDownloadFromPreview}
							disabled={isDownloadingFromPreview}
							style={{
								padding: "12px 20px",
								backgroundColor: "#86705f",
								color: "white",
								border: "none",
								borderRadius: "8px",
								cursor: isDownloadingFromPreview
									? "not-allowed"
									: "pointer",
								fontSize: "14px",
								fontWeight: "bold",
								display: "flex",
								alignItems: "center",
								justifyContent: "center",
								gap: "8px",
								boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
								opacity: isDownloadingFromPreview ? 0.7 : 1,
							}}
							onMouseEnter={(e) => {
								if (!isDownloadingFromPreview) {
									e.target.style.backgroundColor = "#75624f";
								}
							}}
							onMouseLeave={(e) => {
								if (!isDownloadingFromPreview) {
									e.target.style.backgroundColor = "#86705f";
								}
							}}
						>
							{isDownloadingFromPreview ? (
								<>
									<div
										style={{
											width: "16px",
											height: "16px",
											border: "2px solid white",
											borderTop: "2px solid transparent",
											borderRadius: "50%",
											animation:
												"spin 1s linear infinite",
										}}
									></div>
									Downloading...
								</>
							) : (
								<>📄 Download PDF</>
							)}
						</button>

						{/* Close button */}
						<button
							onClick={closePreview}
							style={{
								padding: "12px 16px",
								backgroundColor: "#86705f",
								color: "white",
								border: "none",
								borderRadius: "8px",
								cursor: "pointer",
								fontSize: "14px",
								fontWeight: "bold",
								minWidth: "44px",
								minHeight: "44px",
								display: "flex",
								alignItems: "center",
								justifyContent: "center",
								boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
							}}
							onMouseEnter={(e) => {
								e.target.style.backgroundColor = "#75624f";
							}}
							onMouseLeave={(e) => {
								e.target.style.backgroundColor = "#86705f";
							}}
						>
							✕
						</button>
					</div>

					<div
						style={{
							position: "relative",
							display: "flex",
							flexDirection: "column",
							alignItems: "center",
						}}
					>
						{/* Iframe with dynamic scaling */}
						<div
							style={{
								transform: `scale(${iframeScale})`,
								transformOrigin: "center center",
								border: "2px solid #ddd",
								borderRadius: "8px",
								overflow: "hidden",
								boxShadow: "0 4px 20px rgba(0,0,0,0.3)",
								flexShrink: 0,
								width: "210mm",
								height: "297mm",
								minWidth: "210mm",
								minHeight: "297mm",
							}}
						>
							<iframe
								srcDoc={previewHTML}
								style={{
									width: "210mm",
									height: "297mm",
									border: "none",
									display: "block",
								}}
								title="Letter Preview"
							/>
						</div>
					</div>

					{/* Add CSS animation for spinner */}
					<style jsx>{`
						@keyframes spin {
							0% {
								transform: rotate(0deg);
							}
							100% {
								transform: rotate(360deg);
							}
						}
					`}</style>
				</div>
			)}
		</div>
	);
}
