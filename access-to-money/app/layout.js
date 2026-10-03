import './globals.css';

export const metadata = {
  metadataBase: new URL('https://accesstomoney.co.uk'),
  title: {
    default: 'AccessToMoney — Accessible UK money guidance',
    template: '%s | AccessToMoney'
  },
  description: 'Accessible UK money information for Deaf and disabled people, with benefits guidance, savings and pension tools, evidence and plain-English resources.',
  alternates: { canonical: '/' },
  openGraph: {
    title: 'AccessToMoney — Make your money work for you',
    description: 'Clear, accessible UK money guidance, tools and evidence for Deaf and disabled people.',
    url: 'https://accesstomoney.co.uk/',
    siteName: 'AccessToMoney',
    locale: 'en_GB',
    type: 'website'
  },
  robots: { index: true, follow: true }
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#075c47'
};

export default function RootLayout({ children }) {
  return (
    <html lang="en-GB">
      <body>{children}</body>
    </html>
  );
}
