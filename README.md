# AI Studio Project

*A Node.js application for interactive AI personas, built with TypeScript, Prisma, and PostgreSQL.*

<p align="center">
  <img src="https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript">
  <img src="https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white" alt="Node.js">
  <img src="https://img.shields.io/badge/Prisma-2D3748?style=for-the-badge&logo=prisma&logoColor=white" alt="Prisma">
  <img src="https://img.shields.io/badge/PostgreSQL-4169E1?style=for-the-badge&logo=postgresql&logoColor=white" alt="PostgreSQL">
  <img src="https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge" alt="License: MIT">
</p>

---

## 🚀 Getting Started

Follow these instructions to get a copy of the project up and running on your local machine for development and testing purposes.

### ✅ Prerequisites

> Before you begin, ensure you have the following installed on your system:

*   **Node.js**: Version 20.x or later is recommended. ([Download here](https://nodejs.org/)).
*   **npm**: The Node Package Manager, which comes included with your Node.js installation.
*   **PostgreSQL**: A running instance of a PostgreSQL database.
*   **Git**: For cloning the repository.

### ⚙️ Installation and Setup

**1. Clone the Repository**

First, clone this repository to your local machine using Git.

```bash
git clone https://github.com/your-username/your-repository-name.git
cd your-repository-name
```

**2. Install Dependencies**

Install all the necessary npm packages defined in `package.json`.

```bash
npm install
```

**3. Set Up Environment Variables**

> ℹ️ The application uses a `.env` file to manage environment-specific variables like database credentials. This file is not committed to version control for security reasons.

*   Create a copy of the example environment file, **`.env.example`**, and name it **`.env`**.

    ```bash
    # On macOS/Linux
    cp .env.example .env

    # On Windows
    copy .env.example .env
    ```

*   Open the newly created **`.env`** file and add your PostgreSQL database connection URL.

    ```dotenv
    # .env
    DATABASE_URL="postgresql://YOUR_USER:YOUR_PASSWORD@localhost:5432/ai_db"
    ```
    *Make sure to replace `YOUR_USER`, `YOUR_PASSWORD`, and the database name (`ai_db`) with your actual PostgreSQL credentials.*

**4. Run the Database Migration & Seeding**

> 💡 This is a critical step that prepares your database. The `prisma migrate dev` command will create the schema and **automatically** run the seed script to populate it with initial data.

```bash
npx prisma migrate dev
```

---

## ▶️ Running the Application

Once the setup is complete, you can start the application using the following command:

```bash
npm run ai
```

You should see any startup logs in your console. The application is now running!

---

## 🛠️ Useful Development Commands

*   **Run the seed script manually:**
    If you want to reset your data or have made changes to `prisma/seed.ts`, you can run the seed script again without migrating.
    ```bash
    npx prisma db seed
    ```

*   **Open Prisma Studio:**
    Prisma Studio is a visual editor for your database that runs in the browser. It's a great way to view and manage your data.
    ```bash
    npx prisma studio
    ```