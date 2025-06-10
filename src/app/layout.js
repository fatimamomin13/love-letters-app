// These styles apply to every route in the application
import "./globals.css";

export const metadata = {
	title: "Letters & Quill",
	description: "The timeless art of handwritten thoughts",
};

export default function RootLayout({ children }) {
	return (
		<html lang="en">
			<body>{children}</body>
		</html>
	);
}
