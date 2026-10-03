# Access to Money

Accessible UK money information for Deaf and disabled people.

## Stack

- Static HTML5
- CSS (responsive, dark mode, large-text control)
- Vanilla JavaScript
- JSON content files
- Decap CMS at `/admin/`
- GitHub as content repository
- Netlify-compatible deployment and GitHub OAuth for Decap

## Why this stack

The site has no framework runtime and no database. The public page reads editable JSON content. Decap CMS commits content changes back to GitHub.

## Decap CMS

`admin/config.yml` is configured for:

- backend: `github`
- repo: `GuyOrlov/accesstomoney`
- branch: `main`
- site: `accesstomoney.co.uk`

GitHub authentication requires an OAuth server. Decap documents Netlify's GitHub authentication as one supported route. Git Gateway is intentionally not used because Netlify marks it deprecated for new setups.

## Local preview

```bash
python -m http.server 8080
```

Open `http://localhost:8080/`.

For local Decap editing, run a Decap proxy server separately and open `/admin/`.

## Launch checklist

1. Create the GitHub repository `GuyOrlov/accesstomoney` and push these files.
2. Connect that repository to Netlify (or another static host).
3. Configure GitHub OAuth authentication for Decap CMS.
4. Point the Namecheap DNS for `accesstomoney.co.uk` to the hosting provider.
5. Confirm HTTPS, then test `/admin/` login.
6. Replace commercial placeholder links only after affiliate/sponsor agreements are approved.
7. Add cookie/analytics consent before enabling non-essential tracking.
8. Complete a WCAG 2.2 AA accessibility audit.

## Content sources currently linked

- Office for National Statistics: disability pay gap
- Department for Work and Pensions: disability employment gap; PIP/DLA statistics
- Scope: Disability Price Tag
- RNID: deafness and hearing-loss prevalence
- GOV.UK: benefits calculators
- MoneyHelper
