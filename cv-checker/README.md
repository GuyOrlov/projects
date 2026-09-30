# ClearCV
Accessible CV checker at https://guyorlov.com/projects/cv-checker/.
Static GitHub Pages app. No backend, credentials or CV storage.

- PDF.js 4.10.38 extracts text PDFs; Mammoth 1.9.0 extracts DOCX text. TXT and paste supported. Scanned PDFs need pasted text; no OCR.
- Basic checks are explicitly labelled deterministic text-pattern checks. Job comparison is a limited keyword list, not a probability or requirements score.
- Optional WebLLM 0.2.79 runs Llama 3.2 1B locally with WebGPU. Explicit button initiates a large model download. Unsupported devices retain basic checks. No cloud AI fallback.
- AI reviews/rephrases one section (2,500 characters max). Output never modifies the CV automatically.
- Editor exports TXT and uses the browser print dialog for PDF. It does not export DOCX or preserve the original layout.
- No analytics or local CV persistence. Third-party CDNs/model hosts receive connection metadata, not CV content. Model files may be browser-cached.

Serve this directory over HTTPS or localhost. Verify uploads, keyboard use, text enlargement, clearing, print and AI on supported hardware before advertising a full production AI service. AI quality and full hardware inference need real-device validation.
