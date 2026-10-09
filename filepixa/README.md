# FilePixa — Photo Studio

**FilePixa** is an independent, free, browser-first photo editor by Guy Orlov.

> This is a **separate project** at \`/filepixa\`. It does not share files with, modify, or link into the existing \`image-to-pdf\` application.

## Features

- Upload a JPEG, PNG, WebP and, where supported, AVIF or GIF.
- **AI background removal** (foreground segmentation), triggered only when requested.
- Brightness, contrast, saturation, and edge sharpening.
- Quick presets for auto-enhancement and sharpening of mildly soft photos.
- Centred crop presets: original, 1:1, 4:5, 16:9 and 9:16.
- Rotate and flip.
- Transparent, white, pale teal, navy or custom-colour background.
- Before/after image comparison.
- Download as PNG, JPEG or WebP.
- 1×, 2× and 4× resize on export (ordinary resampling, **not AI super-resolution**).
- Responsive interface, keyboard controls, accessible labels and visible processing feedback.
- No sign-up, backend, server image storage, or analytics in this project.

## Important limitations

**Blur repair:** The sharpening operation boosts edge contrast. It cannot restore missing pixels or fully fix severe motion blur/out-of-focus photos.

**Background removal:** Downloads JavaScript and AI model files at first use and runs inference locally using [IMG.LY background-removal](https://github.com/imgly/background-removal-js) pinned to version 1.7.0. The model uses device memory and may fail on low-memory browsers, restrictive networks or unusually large photos. Downloading the code/model contacts the external CDN, but FilePixa does not upload your input photo for processing. Source: https://www.npmjs.com/package/@imgly/background-removal.

**Licensing:** IMG.LY's background-removal package is offered under **AGPL-3.0**; review the obligations for any redistribution, derivative/combined work, and public hosting. For commercial/proprietary deployment, consult the package vendor.

**Privacy:** Editing and exporting use browser canvas. Photos stay local to the browser. Background removal uses externally hosted code/model assets and has no photo-upload API. No stored edits after page reload.

**Resizing:** Larger exported image dimensions are created by browser interpolation, not inferred new detail. Export is capped to avoid consuming excessive memory (longest side 6,000 px, maximum 16 megapixels). Colour conversion may differ by browser.

**Crop:** Crops are centred; a freehand/draggable crop is not part of this release.

## Hosting

This is a plain static website with \`index.html\`, \`styles.css\`, \`app.js\`, \`icon.svg\`, and \`manifest.webmanifest\`. It can be copied **as-is into its own GitHub Pages repository** or deployed from its existing directory.

- No build step required.
- Serve over HTTPS for best mobile compatibility.
- Ensure access to \`esm.sh\` and IMG.LY's default model CDN for AI background removal.
- Dependencies are downloaded on demand; the rest uses standard browser APIs.

## Project location

Code: https://github.com/GuyOrlov/projects/tree/main/filepixa

FilePixa is **not** integrated into the PDF Toolkit and does not depend on that project.

Created October 2026.
