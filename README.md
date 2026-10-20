# Tutti Frutti — Studio Web Application

An informational and registration site for **Tutti Frutti**, a studio for children's development, learning, and storytelling.

New parents can explore the classes, register a child, and pay for a session. The studio owner has a private view of paid registrations.

---

## Features

### For parents

* **Russian and English:** Language toggle in the header.
* **Class pages:**
  * Живые буквы (Live Letters)
  * Расти (Grow)
  * Созвучие (Consonance)
  * Царство животных (Animal Kingdom)
  * Storytelling (Interactive storytelling)
* **Account:** Email and password sign-in. Google sign-in appears when Google keys are set.
* **Registration:** Before payment, the parent enters the name of the child who is coming (up to three children).
* **Account page:** After payment, the parent sees each child's name, then that child's classes, dates, and payments.

Parents cannot yet change or cancel a booking from the site.

### For the studio owner

* **Private dashboard:** Only the owner account can open it. The owner is the account whose email matches `OWNER_EMAIL`.
* **Counts:** People registered, paid registrations, and dates that have bookings.
* **By date:** Classes and how many registrations each date has.
* **Who registered:** The child's name, the parent's account when it differs, the class, and the date.

Class dates and prices are edited in Stripe, not in the owner dashboard. The dashboard shows a registration after the payment webhook has saved it and the owner opens the page again.

---

## Tech stack

* **App:** Next.js, React, TypeScript, Tailwind CSS
* **Accounts:** Better Auth (email and password, optional Google)
* **Database:** PostgreSQL, accessed with Drizzle
* **Payments:** Stripe pricing tables and webhooks

---

## Getting started

### Prerequisites

* Node.js 20 or newer
* pnpm
* Docker, for the local Postgres database
* A Stripe account, for products, prices, and API keys

### Environment variables

Copy `.env.example` to `.env.local` and fill it in:

```env
DATABASE_URL=postgresql://tutti:tutti@localhost:5433/tutti_frutti
OWNER_EMAIL=
OWNER_PASSWORD=
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
STRIPE_PUBLISHABLE_KEY=
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
STRIPE_PRICING_TABLE_LIVE_LETTERS=
STRIPE_PRICING_TABLE_GROW=
STRIPE_PRICING_TABLE_CONSONANCE=
STRIPE_PRICING_TABLE_ANIMAL_KINGDOM=
STRIPE_PRICING_TABLE_STORYTELLING=
```

`OWNER_EMAIL` is the studio owner. Every other account is a parent.

### Installation

1. Clone the repository and install dependencies:

   ```bash
   pnpm install
   ```

2. Start Postgres and create the tables, class dates, and owner login:

   ```bash
   pnpm db:up
   pnpm db:setup
   ```

3. Start the site:

   ```bash
   pnpm dev
   ```

4. Open `http://localhost:3000`.

For a hosted database, set `DATABASE_URL` to that database and run `pnpm db:setup` against it. Do not point the hosted site at the Docker database on your computer.

---

## Stripe

1. In the Stripe Dashboard, each class date is a product. Put the date in the product name, for example `Расти 21.10.2026`.
2. Add those products to a pricing table, one table per class, and put each table id in `.env.local`.
3. A parent opens a class, signs in, enters the child's name, and pays through the Stripe pricing table.
4. The webhook `checkout.session.completed` saves the paid registration under the child's name. The parent account and the owner dashboard show it on the next visit.

The pricing table confirmation page should return the parent to `/account`. For local webhook testing:

```bash
stripe listen --forward-to localhost:3000/api/stripe/webhook
```

---

## Later

- [ ] Let a parent change or cancel a booking
- [ ] Email reminders before a class
- [ ] Export the attendance list for the owner

Google sign-in is already in the sign-in page. Add `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` to turn it on.

---

## License

This project is proprietary and built for Tutti Frutti Studio.
