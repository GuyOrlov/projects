import {
  cleanLang,
  cleanWord,
  destinationUrl,
  escapeHtml,
  languageConfig,
  shareDescription,
  shareTitle,
} from '../../lib/share';

export const dynamic = 'force-dynamic';

export async function GET(request) {
  const requestUrl = new URL(request.url);
  const lang = cleanLang(requestUrl.searchParams.get('lang') || 'bsl');
  const word = cleanWord(requestUrl.searchParams.get('word') || 'HELLO');
  const config = languageConfig(lang);

  const destination = destinationUrl(lang, word);
  const ogImage = new URL('/api/og', requestUrl.origin);
  ogImage.searchParams.set('lang', lang);
  ogImage.searchParams.set('word', word);

  const title = shareTitle(lang, word);
  const description = shareDescription(lang);

  const safeTitle = escapeHtml(title);
  const safeDescription = escapeHtml(description);
  const safeDestination = escapeHtml(destination);
  const safeOgImage = escapeHtml(ogImage.toString());
  const safeShareUrl = escapeHtml(requestUrl.toString());
  const safeSiteName = escapeHtml(`SignMyWord · ${config.label}`);

  const html = `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <meta name="robots" content="noindex,follow">

  <title>${safeTitle}</title>
  <meta name="description" content="${safeDescription}">

  <meta property="og:type" content="website">
  <meta property="og:site_name" content="${safeSiteName}">
  <meta property="og:title" content="${safeTitle}">
  <meta property="og:description" content="${safeDescription}">
  <meta property="og:url" content="${safeShareUrl}">
  <meta property="og:image" content="${safeOgImage}">
  <meta property="og:image:width" content="1200">
  <meta property="og:image:height" content="630">
  <meta property="og:image:alt" content="${safeTitle}">

  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${safeTitle}">
  <meta name="twitter:description" content="${safeDescription}">
  <meta name="twitter:image" content="${safeOgImage}">

  <link rel="canonical" href="${safeDestination}">
  <meta http-equiv="refresh" content="0.8;url=${safeDestination}">

  <style>
    html,body{margin:0;min-height:100%;font-family:Arial,sans-serif;background:#f7faff;color:#102a56}
    main{min-height:100vh;display:grid;place-items:center;padding:24px;text-align:center}
    a{display:inline-block;margin-top:12px;padding:13px 20px;border-radius:12px;background:#1479f8;color:white;font-weight:700;text-decoration:none}
  </style>

  <script>
    window.setTimeout(function () {
      window.location.replace(${JSON.stringify(destination)});
    }, 120);
  </script>
</head>
<body>
  <main>
    <div>
      <strong>SignMyWord</strong>
      <p>Opening ${escapeHtml(word)} in ${escapeHtml(config.label)}…</p>
      <a href="${safeDestination}">Open result</a>
    </div>
  </main>
</body>
</html>`;

  return new Response(html, {
    status: 200,
    headers: {
      'content-type': 'text/html; charset=utf-8',
      'cache-control': 'public, s-maxage=300, stale-while-revalidate=86400',
    },
  });
}
