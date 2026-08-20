// Keep your existing deployed SmartPay provider code here.
// Normalize provider errors with:
// const smartError = smartData.error || smartData.message || "STK Push failed";
// Return LIMIT_REACHED as a user-safe error.
// GET status must return pending/completed/cancelled/failed.
// Keep all real secrets in Supabase Secrets, never GitHub.