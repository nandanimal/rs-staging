export const metadata = {
  title: "Studio | RS Website",
};

export default function StudioLayout({ children }) {
  return (
    <html lang="en">
      <body style={{ margin: 0 }}>{children}</body>
    </html>
  );
}
