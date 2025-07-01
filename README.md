# ซอร์สโค้ดนี้ ใช้สำหรับเป็นตัวอย่างเท่านั้น ถ้านำไปใช้งานจริง ผู้ใช้ต้องจัดการเรื่องความปลอดภัย และ ประสิทธิภาพด้วยตัวเอง

# Golden Fry - Thai POS System

A modern, web-based Point of Sale (POS) system designed for a Thai fried chicken restaurant. Built with Next.js, TypeScript, and Tailwind CSS, this application provides a user-friendly interface for managing orders, menu items, and payments.

## ✨ Features

*   **Menu Management:** Easily add, edit, and manage menu items.
*   **Order Processing:** A simple and intuitive interface for creating and managing customer orders.
*   **Payment Tracking:** Record payments and track order statuses.
*   **Responsive Design:** A clean and responsive UI that works on desktops, tablets, and mobile devices.

## 🚀 Tech Stack

*   **Framework:** [Next.js](https://nextjs.org/)
*   **Language:** [TypeScript](https://www.typescriptlang.org/)
*   **Styling:** [Tailwind CSS](https://tailwindcss.com/)
*   **UI Components:** [shadcn/ui](https://ui.shadcn.com/)
*   **Database:** [Better-SQLite3](https://github.com/WiseLibs/better-sqlite3)
*   **Form Management:** [React Hook Form](https://react-hook-form.com/)
*   **Schema Validation:** [Zod](https://zod.dev/)

## 🗄️ Database Schema

The application uses a SQLite database (`thai-pos-system.db`) with the following tables:

*   `menu_items`: Stores information about each menu item.
*   `orders`: Records all customer orders.
*   `order_items`: A junction table linking orders and menu items.
*   `payments`: Stores payment details for each order.

The database is initialized with a predefined set of menu items from the `scripts/init-database.sql` file.

## 🏁 Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites

*   Node.js (v18 or later)
*   pnpm (or npm/yarn)

### Installation

1.  **Clone the repository:**

    ```bash
    git clone https://github.com/warathepj/nextjs-thai-pos.git
    cd nextjs-thai-pos
    ```

2.  **Install dependencies:**
    ```bash
    pnpm install
    ```

3.  **Initialize the database:**
    This will create the `thai-pos-system.db` file and populate it with initial data.
    ```bash
    pnpm db:init
    ```

4.  **Run the development server:**
    ```bash
    pnpm dev
    ```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 📜 Available Scripts

In the project directory, you can run:

*   `pnpm dev`: Runs the app in development mode.
*   `pnpm build`: Builds the app for production.
*   `pnpm start`: Starts a production server.
*   `pnpm lint`: Lints the codebase using Next.js's built-in ESLint configuration.

##  API Endpoints

The application exposes the following API endpoints:

*   `GET /api/menu-items`: Fetches all menu items.
*   `GET /api/orders`: Fetches all orders.
*   `POST /api/orders`: Creates a new order.
*   `GET /api/order-items`: Fetches all order items for a given order.
*   `GET /api/payments`: Fetches all payments.

## 📂 Project Structure

```
/
├── app/                # Next.js App Router pages and API routes
├── components/         # Shared UI components
├── hooks/              # Custom React hooks
├── lib/                # Utility functions and database connection
├── public/             # Static assets (images, etc.)
├── scripts/            # Database initialization script
└── ...                 # Configuration files
```

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.
