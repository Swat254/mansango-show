# CHING'ENDE Album Launch

Current source package for the AppDeploy project.

## Local development
npm install
npm run dev

## Production build
npm run build

## Payment
The browser calls the Supabase Paystack Edge Function:
https://zxforhokpsiqkceesalk.supabase.co/functions/v1/paystack

Do not put Paystack secret keys or Supabase service-role keys in this repository.
Keep secrets in Supabase Edge Function secrets.
