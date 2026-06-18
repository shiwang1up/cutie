export const metadata = {
  title: "for you 💌",
  description: "a tiny thing made with love",
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({ children }) {
  const cursorUrl = process.env.NEXT_PUBLIC_CURSOR_URL || "/cursor.png";
  return (
    <html lang="en" style={{ "--cursor-url": `url('${cursorUrl}')` }}>
      <body>{children}</body>
    </html>
  );
}
