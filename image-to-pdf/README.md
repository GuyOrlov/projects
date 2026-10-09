# PDF Toolkit — by Guy Orlov

Live application: **https://guyorlov.com/projects/image-to-pdf/**

A free, accessible, mobile-first suite of PDF and photo utilities hosted on GitHub Pages. The PDF and photo tools run entirely in the visitor's own browser using open-source JavaScript packages. No account is needed for local processing.

## 18 tools

| Tool | Function |
| --- | --- |
| Photo to PDF | Make a PDF from several images. Select A4, A5, US Letter or 4×6, margins, quality and portrait/landscape. |
| Scan document | Take photos of paperwork, improve them and export as a PDF. |
| Crop and rotate | Centre-crop, rotate, brighten and export photos. |
| Enhance photos | Brightness/contrast, grayscale and high-contrast presets. |
| Multiple photos per page | Put 2, 4 or 6 images on a page. |
| PDF to JPG / PNG | Render individual/all PDF pages and download an image or ZIP. |
| Merge PDFs | Combine PDF files in order, retaining content where possible. |
| Split PDFs | Extract a page range or a ZIP of individual page PDFs. |
| Compress PDF | Re-render pages using JPEG images. **Flattens selectable text and forms** and can occasionally increase size. |
| Add page numbers | Stamp text-based PDF page numbers. |
| Add signature | Draw a signature and place the image on one or all pages. **Not a certified cryptographic signature.** |
| Password-protect PDF | Rebuild pages and add a password. **Uses jsPDF's weak legacy RC4-40 encryption; do NOT rely on it for sensitive documents.** |
| Watermark PDF | Add translucent text watermarks. |
| Recognise text (OCR) | Run Tesseract OCR locally, download plain text or create a searchable scan with invisible text layer. OCR and non-Latin text may not be perfectly accurate. |
| Translate document | Extract text (plus OCR for scanned pages) and translate it via the external MyMemory API with an explicit button/notice. Sends extracted text to a third-party; do not use confidential material. Limits apply; layout is not preserved. |
| Save to Google Drive | Native device share sheet, or direct Drive upload with a Google Cloud Web OAuth Client ID configured for this site's origin. Requires explicit Google sign-in. |
| Install as app | PWA with manifest, icon and a service worker. Site shell caches for offline and the browser may cache previously used processing libraries. |
| Recent documents | Opt-in PDFs stored in browser IndexedDB. Download or delete them later. No server/cloud sync. |

## Privacy and external dependencies

- Files are processed locally and are not sent to this website's GitHub Pages server.
- Libraries are loaded from cdnjs and jsDelivr: jsPDF, pdf-lib, PDF.js, JSZip and Tesseract.js. The first visit requires internet access. Cached offline use may vary by browser.
- OCR uses Tesseract.js; its recognition model may need downloading the first time the selected language is used.
- **Translate** calls the MyMemory translation service and sends extracted document text over HTTPS. Do not submit private, medical or business documents.
- **Google Drive** upload transmits the selected PDF to the user's own Drive only after they explicitly sign in/approve. Direct upload requires a Google Cloud project, the Drive API and an OAuth Client ID with the correct JavaScript origin.
- **Recent documents** are stored locally only when the user ticks the save checkbox. Browser cache/data clearing may delete them.
- Some tools rasterise PDFs and lose text searchability, selectable text, hyperlinks or form fields. The UI warns where this happens.
- **Password-protect PDF is basic compatibility encryption, not robust security**. For sensitive documents use a modern AES-256 PDF encryption tool instead.

## How to add the website to iPhone

Open the live link in Safari, tap Share, then Add to Home Screen. Tap the PDF Toolkit icon to reopen the site.

## Tech

Static HTML/CSS/JavaScript, no server/API keys for local conversions; GitHub Pages; PWA Service Worker; in-browser APIs for File, Blob, canvas, IndexedDB and device sharing. Main files: `index.html`, `styles.css`, `app.js`, `sw.js`, `manifest.webmanifest` and `icon.svg`.

## Caveats

- Very large PDFs/photos may exceed memory available on smartphones.
- Browser support for HEIC/HEIF varies; convert unsupported images to JPEG/PNG first.
- Encrypted source PDFs are not currently supported in editing tools.
- PDFs created with a visual signature are not digital certificate-signed.
- For Google OAuth you must create your own OAuth Web Client ID and configure authorised JavaScript origins (e.g. `https://guyorlov.com`).
