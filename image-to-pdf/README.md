# Photo to PDF

A lightweight, mobile-friendly website for converting one or more photos into a downloadable PDF. Created for repeated personal use.

## Use the app

**Website:** https://guyorlov.com/projects/image-to-pdf/

1. Tap **Choose photos** (or drag pictures into the upload area).
2. Use the arrow buttons to change their page order, or remove pictures.
3. Choose A4, A5, US Letter, or 4 × 6 in; set orientation, margin, placement and image quality.
4. Tap **Download PDF**. On iPhone, use **View PDF / share on iPhone** if you want to open the PDF in the sharing sheet.
5. Bookmark the link or use Safari **Share → Add to Home Screen** to launch it again.

## Privacy

The site runs client-side. Images are processed in the visitor's browser using canvas and jsPDF, and are never uploaded to the repository or an application server. The PDF is generated locally and downloaded to the visitor's device. This app does not persist photos, PDFs or a history of conversions.

The jsPDF 3.0.3 library is loaded from cdnjs, so the first load needs an internet connection. Browsers must support the image format being selected; JPEG, PNG and WebP are common, HEIC varies by browser.

## Technical details

- Vanilla HTML, CSS, JavaScript; no build step or API keys
- Mobile responsive; labelled controls and reorder actions
- Automatic orientation per photo
- JPEG encoding at selectable quality and maximum dimensions to reduce output file size
- Maximum 80 photos per batch to reduce memory exhaustion

## Deployment

Source: `image-to-pdf/index.html` in the `GuyOrlov/projects` repo, served by the repository's existing GitHub Pages configuration.
