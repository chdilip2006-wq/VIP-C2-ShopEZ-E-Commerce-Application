# ShopEZ: Commerce Application

ShopEZ: Commerce Application is a full-stack MERN e-commerce app with product browsing, cart management, checkout, order tracking, and an admin dashboard.

## Features

- User registration and login with JWT authentication
- Product listing, search, filters, sorting, and product details
- Redux cart with quantity and size selection
- Checkout with shipping details and demo payment flow
- Customer order history and order cancellation
- Admin dashboard for products, orders, users, banner, and categories
- Optional Stripe Payment Intent support

## Tech Stack

**Frontend:** React, Vite, Redux Toolkit, React Router, Axios, Tailwind CSS  
**Backend:** Node.js, Express.js, JWT, bcryptjs, Stripe  
**Database:** MongoDB, Mongoose

## Project Structure

```text
ShopEZ-Commerce-Application/
|-- client/   React frontend
|-- server/   Express API and MongoDB models
`-- README.md
```

## Getting Started

### Prerequisites

- Node.js 20+
- npm
- MongoDB local instance or MongoDB Atlas URI

### Backend Setup

```bash
cd server
npm install
```

Create `server/.env`:

```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/shopez
JWT_SECRET=replace-with-a-long-random-secret
CLIENT_URL=http://localhost:5173
STRIPE_SECRET_KEY=
STRIPE_LIVE_PAYMENTS=false
STRIPE_CURRENCY=inr
```

Seed demo data:

```bash
npm run seed
```

Start backend:

```bash
npm run dev
```

### Frontend Setup

```bash
cd client
npm install
```

Create `client/.env`:

```env
VITE_API_URL=http://localhost:5000/api
```

Start frontend:

```bash
npm run dev
```

Open:

```text
http://localhost:5173
```

## Demo Admin

After running the seed command:

```text
Email: admin@shopez.com
Password: Admin123!
```

## Scripts

### Client

```bash
npm run dev       # start Vite dev server
npm run build     # build frontend
npm run preview   # preview production build
npm run lint      # run ESLint
```

### Server

```bash
npm run dev       # start API with watch mode
npm start         # start API
npm run seed      # seed demo products and admin user
```

## API Overview

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/health` | API health check |
| POST | `/api/auth/register` | Register user |
| POST | `/api/auth/login` | Login user |
| GET | `/api/auth/profile` | Get logged-in profile |
| GET | `/api/products` | List products |
| GET | `/api/products/:id` | Get product details |
| POST | `/api/products` | Create product, admin only |
| PUT | `/api/products/:id` | Update product, admin only |
| DELETE | `/api/products/:id` | Delete product, admin only |
| POST | `/api/orders` | Create order |
| GET | `/api/orders/mine` | Get user orders |
| PATCH | `/api/orders/:id/cancel` | Cancel user order |
| GET | `/api/orders` | List all orders, admin only |
| PATCH | `/api/orders/:id/status` | Update order status, admin only |
| POST | `/api/payment/process` | Process demo/Stripe payment |
| GET | `/api/store` | Get store config |
| PUT | `/api/store` | Update store config, admin only |

Protected routes require:

```text
Authorization: Bearer <token>
```

## Notes

- Payments run in demo mode unless `STRIPE_SECRET_KEY` is configured.
- Product images currently use external URLs.
- Cart state is handled on the frontend with Redux.
- Automated tests are not configured yet.
