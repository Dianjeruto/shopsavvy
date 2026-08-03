# ShopSavvy

ShopSavvy is a responsive, modern e-commerce storefront built with React, TypeScript, Vite, Tailwind CSS, and Shadcn UI. The project is designed to feel like a complete online shopping experience, including product browsing, collection discovery, cart and wishlist flows, authentication, and checkout.

The codebase also includes a lightweight Express backend and resilient client-side fallback data so the storefront can keep working even when remote Supabase or payment endpoints are unavailable.

## Overview

This project was developed as a polished storefront demo for digital commerce, with a strong emphasis on:

- a clean shopping experience for customers
- responsive UI design for mobile and desktop
- a demo-ready catalog with collection-driven browsing
- resilient fallback behavior for local testing and walkthroughs
- Kenya-focused checkout messaging and KES pricing
- flexible payment choices with pay-on-delivery or pay-before-delivery
- stronger checkout validation for customer contact details and location
- animated homepage offer marquee for continuous promotions
- market-aware pricing range between KSh 750 and KSh 5,600

## Features

### Storefront experience
- responsive landing page with featured products and collections
- animated homepage promo strip that continuously scrolls
- products and collection browsing
- product detail view with variants and pricing
- cart management and quantity updates
- wishlist functionality
- checkout with shipping, contact details, location, and payment method selection
- pay-on-delivery or pay-before-delivery options
- order confirmation experience

### Demo resilience
- local demo auth stored in browser storage
- local demo catalog and collection fallback data
- graceful handling of remote Supabase query failures
- safe local-success checkout fallback when payment intent creation is unavailable

### Technical foundation
- React 18 frontend with TypeScript
- Vite development and build workflow
- Tailwind CSS for styling
- Shadcn UI component patterns
- Express API backend
- Supabase client integration
- Stripe checkout integrations

## Tech Stack

### Frontend
- React
- TypeScript
- Vite
- Tailwind CSS
- React Router
- Shadcn UI

### Backend and services
- Node.js
- Express.js
- Supabase JavaScript client
- Stripe JavaScript SDK

### Development tooling
- ESLint
- PostCSS
- concurrently

## Project Structure

```text
src/
├── components/
├── contexts/
├── hooks/
├── lib/
├── pages/
├── App.tsx
├── main.tsx
└── index.css

server.js
package.json
vite.config.ts
tailwind.config.ts
supabase/
└── migrations/
```

## Important source areas

- `src/lib/auth-demo.ts` handles local demo sign-up, sign-in, and session persistence
- `src/lib/demo-catalog.ts` contains the fallback product and collection dataset
- `src/lib/supabase.ts` defines the shared Supabase client connection
- `src/pages/Checkout.tsx` manages the checkout flow, shipping inputs, payment method selection, and fallback order behavior
- `src/pages/Home.tsx` powers the homepage experience, product highlights, and the animated offer marquee
- `src/pages/Products.tsx` contains the all-products view with the home return button and the updated price-range filter
- `src/pages/InfoPage.tsx` contains the About and company profile copy

## How to run the project

### 1. Install dependencies

```bash
npm install
```

### 2. Run both frontend and backend together

```bash
npm run dev:all
```

### 3. Run only the frontend

```bash
npm run dev
```

### 4. Run only the backend API

```bash
npm run server
```

### 5. Build for production

```bash
npm run build
```

### 6. Preview the production build

```bash
npm run preview
```

## Backend API notes

The Express server exposes common shopping endpoints such as:

- `GET /api/health`
- `GET /api/products`
- `GET /api/collections`
- `GET /api/auth/me`
- `POST /api/auth/signin`
- `POST /api/auth/signout`

## Demo fallback behavior

This application is designed to remain usable in demo mode when live backend resources are unavailable. When remote Supabase queries fail, the app falls back to a local demo catalog and collections dataset. This allows product browsing, cart updates, wishlist actions, and checkout walkthroughs to continue without a hard failure.

The storefront also adds a market-aware pricing layer and a product price range tuned for the local shopping context, with a visible minimum of KSh 750 and a maximum of KSh 5,600 during browsing and filtering.

## External services

The app is prepared to work with Supabase and Stripe-connected infrastructure. To enable full live data storage and payment processing, add the required environment variables for your own Supabase and checkout setup.

## Database migration

A Supabase migration for indexing support is included here:

```text
supabase/migrations/001_add_product_performance_indexes.sql
```

## Brand and commerce direction

The storefront is branded as ShopSavvy and uses Kenya-focused commerce behavior, including:

- KES pricing output
- Kenya as the default address/country flow
- contact phone fields in checkout
- local demo order success fallback for smoother walkthroughs

## Repository notes

This project is intended to be used as a learning, demo, and portfolio-ready storefront for Git-based version control and deployment.

## License

This project is provided for educational and demonstration use.
