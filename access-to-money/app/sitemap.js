export default function sitemap() {
  const base = 'https://accesstomoney.co.uk';
  return [
    { url: `${base}/`, changeFrequency: 'weekly', priority: 1 },
    { url: `${base}/accessibility.html`, changeFrequency: 'yearly', priority: 0.4 },
    { url: `${base}/privacy.html`, changeFrequency: 'yearly', priority: 0.4 },
    { url: `${base}/affiliate-disclosure.html`, changeFrequency: 'yearly', priority: 0.4 }
  ];
}
