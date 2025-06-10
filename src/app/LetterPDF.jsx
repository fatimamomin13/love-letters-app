import React from "react";

const LetterComponent = ({
	letterTo = "Someone",
	letterFrom = "Fatima",
	message = "Your words dance in my heart like fireflies in the evening twilight, bringing warmth to even the coldest of days...",
}) => {
	return (
		<div className="letter-page">
			<style jsx>{`
				@import url("https://fonts.googleapis.com/css2?family=Dancing+Script:wght@400;700&family=Playfair+Display:ital,wght@0,400;0,600;1,400&display=swap");

				.letter-page {
					width: 210mm;
					height: 297mm;
					margin: 0 auto;
					padding: 50px;
					background: linear-gradient(
						135deg,
						#fef7f0 0%,
						#fdf2e9 100%
					);
					position: relative;
					font-family: "Playfair Display", serif;
					color: #4a4a4a;
					box-sizing: border-box;
				}

				.paper-background {
					position: absolute;
					top: 15px;
					left: 15px;
					right: 15px;
					bottom: 15px;
					background: rgba(254, 252, 248, 0.9);
					border-radius: 10px;
					box-shadow: inset 0 0 20px rgba(139, 69, 19, 0.1);
				}

				.decorative-corner {
					position: absolute;
					top: 30px;
					right: 30px;
					width: 60px;
					height: 60px;
					opacity: 0.4;
				}

				.greeting {
					position: absolute;
					top: 60px;
					left: 60px;
					font-size: 24px;
					font-family: "Dancing Script", cursive;
					color: #8b4513;
					font-weight: 600;
					display: flex;
					align-items: center;
					gap: 12px;
				}

				.rose {
					width: 32px;
					height: 32px;
					background: radial-gradient(
						circle,
						#e74c3c 40%,
						#c0392b 70%
					);
					border-radius: 50%;
					position: relative;
					display: inline-block;
				}

				.rose::before {
					content: "";
					position: absolute;
					top: 50%;
					left: 50%;
					width: 16px;
					height: 16px;
					background: #a93226;
					border-radius: 50%;
					transform: translate(-50%, -50%);
				}

				.rose::after {
					content: "";
					position: absolute;
					bottom: -10px;
					left: 50%;
					width: 2px;
					height: 15px;
					background: #27ae60;
					transform: translateX(-50%);
				}

				.message-wrapper {
					position: absolute;
					top: 150px;
					left: 60px;
					right: 60px;
					bottom: 200px;
					display: flex;
					align-items: center;
					justify-content: center;
				}

				.message {
					font-size: 20px;
					line-height: 1.8;
					color: #5d4e75;
					text-align: center;
					font-family: "Playfair Display", serif;
					max-width: 100%;
				}

				.footer {
					position: absolute;
					bottom: 80px;
					right: 60px;
					display: flex;
					align-items: center;
					gap: 15px;
					font-size: 18px;
				}

				.footer-text {
					color: #8b4513;
					font-family: "Dancing Script", cursive;
				}

				.with-love {
					font-size: 20px;
					margin-bottom: 5px;
				}

				.sender-row {
					display: flex;
					align-items: center;
					gap: 10px;
					margin-top: 5px;
				}

				.sender-name {
					font-size: 24px;
					font-weight: 700;
					font-family: "Dancing Script", cursive;
				}

				.feather {
					width: 20px;
					height: 20px;
					background: linear-gradient(45deg, #8b4513, #a0522d);
					clip-path: polygon(50% 0%, 0% 100%, 100% 100%);
					transform: rotate(15deg);
				}

				.page-end {
					position: absolute;
					bottom: 30px;
					left: 0;
					right: 0;
					display: flex;
					justify-content: center;
					align-items: center;
					gap: 8px;
					font-size: 14px;
					color: #d63031;
				}

				.heart {
					width: 12px;
					height: 12px;
					background: #d63031;
					position: relative;
					transform: rotate(-45deg);
				}

				.heart::before,
				.heart::after {
					content: "";
					width: 12px;
					height: 12px;
					position: absolute;
					background: #d63031;
					border-radius: 50%;
				}

				.heart::before {
					top: -6px;
					left: 0;
				}

				.heart::after {
					left: 6px;
					top: 0;
				}

				.decorative-corner svg {
					width: 100%;
					height: 100%;
				}

				@media print {
					.letter-page {
						margin: 0;
						box-shadow: none;
					}
				}
			`}</style>

			{/* Paper background */}
			<div className="paper-background"></div>

			{/* Decorative corner */}
			<div className="decorative-corner">
				<svg
					viewBox="0 0 100 100"
					fill="none"
					stroke="#dda0dd"
					strokeWidth="2"
				>
					<path d="M10 10 Q30 10 50 30 Q70 50 90 70 Q70 70 50 50 Q30 30 10 10" />
					<circle cx="25" cy="25" r="2" fill="#dda0dd" />
					<circle cx="50" cy="50" r="2" fill="#dda0dd" />
					<circle cx="75" cy="75" r="2" fill="#dda0dd" />
					<path d="M20 10 Q25 15 30 10" strokeWidth="1" />
					<path d="M10 20 Q15 25 10 30" strokeWidth="1" />
				</svg>
			</div>

			{/* Greeting */}
			<div className="greeting">
				<span>My Dearest {letterTo},</span>
				<div className="rose"></div>
			</div>

			{/* Message */}
			<div className="message-wrapper">
				<div className="message">{message}</div>
			</div>

			{/* Footer */}
			<div className="footer">
				<div className="footer-text">
					<div className="with-love">With Love,</div>
					<div className="sender-row">
						<span className="sender-name">{letterFrom}</span>
						<div className="feather"></div>
					</div>
				</div>
			</div>

			{/* Bottom hearts */}
			<div className="page-end">
				<span>✦</span>
				<div className="heart"></div>
				<div className="heart"></div>
				<div className="heart"></div>
				<span>✦</span>
			</div>
		</div>
	);
};

export default LetterComponent;
