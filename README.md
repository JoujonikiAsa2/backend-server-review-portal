# 🌟 Product Review Portal

A **full-stack web application** for sharing and managing product reviews with **user interactions**, **premium content access**, and **admin moderation**. Built using **modern web technologies** for **scalability** and **performance**.

---

## 🚀 Features

### 👤 **User Features**

- 🔐 **Secure JWT authentication** (email/password)
- 📝 **Create/edit/delete reviews** with **ratings** (1–5), **categories**, and **optional media**
- 👍 **Vote** & 💬 **comment** on both **free** and **premium** reviews
- 🔍 **Search & filter** reviews by **category**, **rating**, or **keywords**
- 💰 **Premium content access** via **one-time payment** (Stripe)

### 🛠️ **Admin Features**

- 🧹 **Review moderation dashboard** (approve/unpublish)
- 💎 **Create premium reviews** with **dynamic pricing**
- 📊 **Payment analytics** (earnings, popular content)
- 🚫 **Moderate & delete comments**

### 💳 **Payment Flow**

- 🔒 Preview **locked premium content** with **clear CTA** to unlock
- 🧾 **Instant access** post-payment via secure gateway
- 📘 **User payment history** tracking

---

## 🧰 **Tech Stack**

### 🖼️ **Frontend**

- ⚛️ **Next.js** (SSR/SSG)
- 🎨 **Tailwind CSS & ShandcnUi**

### 🔙 **Backend**

- 🟩 **Node.js** with **Express.js**
- 🔧 **Prisma ORM**

### 🗄️ **Database**

- 🐘 **PostgreSQL**

---

## ⚙️ **Installation**

### 1️⃣ **Backend Setup**

```bash
cd backend
npm install
npx prisma migrate dev
npm run dev
```

## Frontend setup

```bash
cd frontend
npm install
npm run dev
```

## 📡 **API Endpoints**

> 🔗 **Base URL**: `http://localhost:5000/api`

---

### 👥 **Auth Routes**

| Method | Endpoint         | Description                 |
| ------ | ---------------- | --------------------------- |
| POST   | `/auth/register` | Register a new user         |
| POST   | `/auth/login`    | Login and receive JWT token |
| GET    | `/auth/profile`  | Get current user's profile  |

---

### 📝 **Review Routes**

| Method | Endpoint       | Description         |
| ------ | -------------- | ------------------- |
| GET    | `/reviews`     | Get all reviews     |
| GET    | `/reviews/:id` | Get review by ID    |
| POST   | `/reviews`     | Create a new review |
| PUT    | `/reviews/:id` | Update a review     |
| DELETE | `/reviews/:id` | Delete a review     |

---

### ⭐ **Rating & Voting**

| Method | Endpoint             | Description                 |
| ------ | -------------------- | --------------------------- |
| POST   | `/reviews/:id/vote`  | Upvote or downvote a review |
| GET    | `/reviews/:id/votes` | Get vote count for a review |

---

### 💬 **Comments**

| Method | Endpoint                | Description                  |
| ------ | ----------------------- | ---------------------------- |
| GET    | `/reviews/:id/comments` | Get all comments on a review |
| POST   | `/reviews/:id/comments` | Add a comment to a review    |
| DELETE | `/comments/:commentId`  | Delete a comment             |

---

### 🛍️ **Premium Content**

| Method | Endpoint               | Description                                 |
| ------ | ---------------------- | ------------------------------------------- |
| GET    | `/reviews/premium`     | Get all premium reviews                     |
| GET    | `/reviews/premium/:id` | Get a specific premium review (if unlocked) |
| POST   | `/payments/initiate`   | Start payment via SSLCommerz/ShurjoPay      |
| POST   | `/payments/verify`     | Verify and unlock premium review            |
| GET    | `/payments/history`    | Get user's payment history                  |

---

### 🛠️ **Admin Panel**

| Method | Endpoint              | Description                       |
| ------ | --------------------- | --------------------------------- |
| GET    | `/admin/reviews`      | List all reviews (for moderation) |
| PUT    | `/admin/reviews/:id`  | Approve/unpublish a review        |
| DELETE | `/admin/reviews/:id`  | Delete a review                   |
| GET    | `/admin/payments`     | View all payments                 |
| GET    | `/admin/comments`     | View all comments                 |
| DELETE | `/admin/comments/:id` | Delete or moderate a comment      |

---

### 🗂️ **Categories & Filters**

| Method | Endpoint                   | Description                |
| ------ | -------------------------- | -------------------------- |
| GET    | `/categories`              | Get all review categories  |
| GET    | `/reviews?category=tech`   | Filter reviews by category |
| GET    | `/reviews?rating=5`        | Filter reviews by rating   |
| GET    | `/reviews?search=keyboard` | Search reviews by keyword  |

### 📊 **Admin Analytics**

| Method | Endpoint                           | Description                                                                               |
| ------ | ---------------------------------- | ----------------------------------------------------------------------------------------- |
| GET    | `/admin/analytics/`                | Get total earnings, revenue breakdown by review type (premium vs free), and monthly stats |
| GET    | `/admin/analytics/popular-content` | Get top-rated and most viewed reviews (both free and premium)                             |

---
