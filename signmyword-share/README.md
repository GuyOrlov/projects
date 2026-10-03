# SignMyWord Share

A tiny Vercel/Next.js service that creates rich link previews for SignMyWord.

## What it does

A share URL such as:

```
/s?lang=asl&word=SPENCER%20COLLINS
```

returns a lightweight HTML page containing Open Graph and Twitter metadata. WhatsApp, Facebook, Telegram, Slack and other services can use that metadata to render a rich preview card.

A human who opens the same URL is immediately sent to the real SignMyWord result:

```
https://guyorlov.com/projects/signmyword/?lang=asl&word=SPENCER%20COLLINS
```

The preview artwork is generated dynamically by:

```
/api/og?lang=asl&word=SPENCER%20COLLINS
```

## Deploy on Vercel

1. In Vercel choose **Add New → Project**.
2. Import the GitHub repository **GuyOrlov/projects**.
3. Set **Root Directory** to:
   ```
   signmyword-share
   ```
4. Vercel should detect **Next.js** automatically.
5. Deploy.
6. Open:
   ```
   https://YOUR-VERCEL-DOMAIN.vercel.app/s?lang=asl&word=SPENCER%20COLLINS
   ```
7. Optional: add the custom domain:
   ```
   share.signmyword.com
   ```

## Connect the main SignMyWord site

After the Vercel domain is live, change the main site's `shareLink()` function to:

```js
function shareLink() {
  const url = new URL('https://share.signmyword.com/s');
  url.searchParams.set('lang', state.lang);
  url.searchParams.set('word', state.word);
  return url.toString();
}
```

Keep the current JPG download/export logic in the main SignMyWord site. The OG endpoint is only the cached social-preview image used by messaging/social platforms.

## Files

```
signmyword-share/
├── app/
│   ├── api/
│   │   └── og/
│   │       └── route.jsx
│   ├── s/
│   │   └── route.js
│   ├── layout.js
│   └── page.js
├── lib/
│   └── share.js
├── next.config.mjs
├── package.json
└── README.md
```
