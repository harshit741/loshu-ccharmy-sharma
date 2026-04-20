# Ccharmy Sharma

Marketing and booking site for numerology consultations, built with Next.js 14, Supabase, and Razorpay.

The current codebase includes:

- a Lo Shu calculator that returns results immediately and saves lead details in the background
- a Contact and Support form that responds quickly, then saves and processes the enquiry in the background
- package booking with Razorpay Orders, Razorpay Checkout, server-side verification, and webhook sync
- a success page that confirms payment status and generates a client receipt PDF

## Tech Stack

- Next.js 14
- React 18
- TypeScript
- Tailwind CSS
- Framer Motion
- Supabase
- Razorpay
- Nodemailer
- React Hook Form + Zod
- jsPDF + jspdf-autotable

## Project Structure

```text
src/
  app/
    api/
      enquiry/
      loshu-calculator/
      payments/
    consultation/
    privacy-policy/
    success/
    terms-and-conditions/
    globals.css
    layout.tsx
    page.tsx
  components/
    layout/
    sections/
    ui/
  lib/
    booking.ts
    checkout.ts
    enquiry.ts
    loshuCalculator.ts
    packages.ts
    razorpay.ts
    supabase-admin.ts
    supabase.ts
    theme.ts
  types/
  utils/
supabase-schema.sql
```

## Main Features

### Homepage

- `src/app/page.tsx` renders the one-page marketing experience
- `src/components/sections/LoshuSection.tsx` handles the Lo Shu form and instant result flow
- `src/components/sections/AnalysisSection.tsx` renders the expanded numerology analysis
- `src/components/sections/ServicesSection.tsx` handles package booking and Razorpay Checkout
- `src/components/sections/OtherSections.tsx` contains About, Testimonials, FAQ, and Contact and Support

### Lo Shu Calculator Flow

1. The user submits name, date of birth, and mobile number.
2. `src/app/api/loshu-calculator/route.ts` validates the request and returns the Lo Shu result immediately.
3. The client shows the result right away.
4. The client then calls `src/app/api/loshu-calculator/save/route.ts` in the background.
5. The submission is stored in the Supabase table `LoshuCalculator`.

### Contact and Support Flow

1. The form posts to `src/app/api/enquiry/route.ts` for fast validation and acknowledgement.
2. The UI shows success immediately after validation passes.
3. The client sends a background request to `src/app/api/enquiry/process/route.ts`.
4. The background route saves the enquiry and sends email notifications.

### Payment Flow

This project now uses Razorpay Orders + Checkout + webhook verification. The old hosted payment-link flow is no longer the active payment path.

Current flow:

1. The booking form submits to `src/app/api/payments/create-order/route.ts`.
2. The server creates a local `orders` row in Supabase with status `created`.
3. The server creates a Razorpay order and stores `razorpay_order_id`.
4. The client opens Razorpay Checkout through `src/lib/checkout.ts`.
5. On successful checkout, the client calls `src/app/api/payments/verify/route.ts`.
6. Razorpay webhook events hit `src/app/api/payments/webhook/route.ts`.
7. The success page at `src/app/success/page.tsx` reads the verified order by `order_id`.
8. Once the order is confirmed as `paid`, the client can download a receipt PDF from `src/utils/generateReceipt.ts`.

## Database Setup

Run `supabase-schema.sql` in the Supabase SQL Editor.

Tables used by the current app:

| Table | Purpose |
|---|---|
| `orders` | Stores booking details and Razorpay payment state |
| `enquiries` | Stores contact form submissions |
| `LoshuCalculator` | Stores Lo Shu calculator submissions |

Current `orders.status` lifecycle:

- `created`
- `authorized`
- `paid`
- `failed`
- `refunded`

If you already have older data with `status = 'initiated'`, migrate it before applying the latest constraint:

```sql
update public.orders
set status = 'created'
where status = 'initiated';
```

If your existing Supabase project already has the `orders_updated_at` trigger, recreate it safely instead of creating it twice:

```sql
drop trigger if exists orders_updated_at on public.orders;

create trigger orders_updated_at
before update on public.orders
for each row execute function update_updated_at_column();
```

## Environment Variables

Create `.env.local` in the project root and add:

```env
NEXT_PUBLIC_APP_URL=http://localhost:3000

NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

NEXT_PUBLIC_RAZORPAY_KEY_ID=
RAZORPAY_KEY_SECRET=
RAZORPAY_WEBHOOK_SECRET=

SMTP_HOST=
SMTP_PORT=
SMTP_USER=
SMTP_PASS=
```


Those hosted-link variables are not used by the active payment flow anymore.

## Local Development

Install dependencies and start the app:

```bash
npm install
npm run dev
```

Then open:

```text
http://localhost:3000
```

## Razorpay Dashboard Setup

For local testing:

1. Switch Razorpay to Test Mode.
2. Generate Test Mode API keys.
3. Set `NEXT_PUBLIC_RAZORPAY_KEY_ID` and `RAZORPAY_KEY_SECRET` in `.env.local`.
4. Choose your own value for `RAZORPAY_WEBHOOK_SECRET`.
5. Add a Razorpay webhook pointing to:

```text
https://your-public-url/api/payments/webhook
```

6. Use the same value in Razorpay Dashboard and `RAZORPAY_WEBHOOK_SECRET`.
7. Subscribe to these events:
   - `payment.authorized`
   - `payment.captured`
   - `payment.failed`
   - `refund.processed`

## Local Webhook Testing With ngrok

Razorpay cannot call `http://localhost:3000` directly, so webhooks need a public URL.

Start your app:

```bash
npm run dev
```

Start ngrok in another terminal:

```bash
ngrok http 3000
```

Use the HTTPS forwarding URL from ngrok as:

```env
NEXT_PUBLIC_APP_URL=https://your-ngrok-url
```

And set the Razorpay webhook URL to:

```text
https://your-ngrok-url/api/payments/webhook
```

Useful local checks:

- booking form creates an `orders` row
- Razorpay Checkout opens
- successful payments redirect to `/success?order_id=...`
- `orders.status` moves to `paid`
- `razorpay_order_id` and `razorpay_payment_id` are stored
- the receipt PDF downloads from the success page

## Scripts

```bash
npm run dev
npm run build
npm run start
npm run lint
```

## Notes

- `SUPABASE_SERVICE_ROLE_KEY`, `RAZORPAY_KEY_SECRET`, and `RAZORPAY_WEBHOOK_SECRET` must stay server-only.
- `.env.local` should never be committed.
- The production build currently succeeds.
- There is one existing lint warning in `src/components/sections/HeroSection.tsx` about using `<img>` instead of Next.js `Image`.
