# SignMyWord

SignMyWord is a lightweight, shareable fingerspelling web app based on the Figma concept created for this project.

## What it does

- Type a word or name
- Switch between 🇺🇸 ASL and 🇬🇧 BSL
- Render each letter as a fingerspelling card
- Keep the selected language and word in the URL
- Copy a shareable link
- Share to WhatsApp
- Use the device share menu
- Generate a QR code
- Work on desktop, tablet and mobile

Example URL:

```
?lang=asl&word=HELLO
```

## Project files

- `index.html` — page structure
- `style.css` — responsive layout based on the Figma design
- `app.js` — fingerspelling, URL state, sharing and QR logic

## Alphabet artwork

The app currently loads individual alphabet SVGs from Wikimedia Commons using each filename.

ASL pattern:

```
https://commons.wikimedia.org/wiki/Special:Redirect/file/Sign_language_A.svg
```

BSL pattern:

```
https://commons.wikimedia.org/wiki/Special:Redirect/file/BSL_letter_A.svg
```

Source categories:

- ASL: https://commons.wikimedia.org/wiki/Category:ASL_letters
- BSL: https://commons.wikimedia.org/wiki/Category:British_manual_alphabet

The checked ASL files include public-domain artwork. Checked BSL files use Creative Commons Attribution-ShareAlike 3.0. Always confirm the individual file page before changing or redistributing an asset, and preserve required attribution.

## Important product wording

SignMyWord is a **fingerspelling tool**. It is not a full English-to-sign-language translation service.

## Design source

Figma:
https://www.figma.com/design/Op1JXflSDiXc1FT907cPIa

## Next ideas

- Add more verified sign-language alphabets
- Save/share word collections
- Add printable classroom sheets
- Add branded organisation links
- Store approved alphabet assets locally instead of loading them remotely
- Add offline/PWA support
