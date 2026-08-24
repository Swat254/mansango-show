# CHING'ENDE Album Launch — GitHub Pages

This package is a static GitHub Pages deployment of the current website.

## Deploy
1. Upload all files to the root of a GitHub repository.
2. In GitHub: Settings → Pages.
3. Select **Deploy from a branch**.
4. Select your branch (usually `main`) and `/ (root)`.
5. Save and wait for GitHub Pages to publish.

## Important
The browser entry point is `index.html` and loads normal JavaScript from `assets/app.js`. It does **not** load `src/main.ts`, so the previous GitHub Pages MIME-type error is avoided.

Payments are sent to the existing Supabase Edge Function:
`https://zxforhokpsiqkceesalk.supabase.co/functions/v1/paystack`

The Paystack secret key must remain inside the Supabase Edge Function secrets and must never be placed in this repository.
