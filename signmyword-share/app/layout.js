export const metadata = {
  title: 'SignMyWord Share',
  description: 'Share BSL and ASL fingerspelling results from SignMyWord.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body style={{ margin: 0, fontFamily: 'Arial, sans-serif' }}>{children}</body>
    </html>
  );
}
