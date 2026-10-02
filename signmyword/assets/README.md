# SignMyWord alphabet assets

This directory is populated by the GitHub Actions workflow at `.github/workflows/signmyword-assets.yml`.

- `bsl/A.svg` through `bsl/Z.svg` are sourced from Wikimedia Commons filenames `BSL_letter_A.svg` etc.
- `asl/A.svg` through `asl/Z.svg` are sourced from Wikimedia Commons filenames `Sign_language_A.svg` etc.

The app loads these local copies first and falls back to Wikimedia Commons if a local file is unavailable.

Licensing must be checked on the individual Wikimedia file page. The BSL artwork used by this project has been documented as CC BY-SA 3.0; the checked ASL artwork has been documented as public-domain material. Keep source and licence information available in SignMyWord's Terms page.
