# ApexFit - AI-Powered Fitness & Nutrition OS

ApexFit is a full-stack MERN-like web application designed to serve as a personal digital fitness coach and training companion. Featuring a dark-themed, glassmorphic UI, the platform integrates an interactive conversational fitness chatbot, a guided exercise library, and a persistent nutrition logging center.

---

## 🚀 Key Features

*   **💬 AI Fitness Coach Chatbot:** 
    *   Interactive chat interface with tailored responses covering workout routines, fat loss, muscle gain, supplement guidelines, hydration, recovery, and more.
    *   Option to restore previous chat history or start fresh, powered by MongoDB persistence.
    *   Quick-reply suggestions to jumpstart fitness queries.
*   **🏋️ Exercise Library & Guide:**
    *   Search and filter exercises by target muscle groups (*Chest, Back, Legs, Shoulders, Arms, Core*).
    *   Detailed execution tips and difficulty levels for each exercise.
    *   "Add to Session" feature that dynamically updates daily workout calories.
*   **🍎 Nutrition Command Center:**
    *   Log daily meals (*Breakfast, Lunch, Dinner, Snack*) with calorie and protein values.
    *   Interactive, real-time progress indicators comparing logged values against target daily macros.
    *   Manage and delete meal records with immediate DB sync.
*   **📊 Dynamic Fitness Calculators:**
    *   In-app BMI Calculator categorizing body weight range.
    *   Water hydration tracker (glasses count) relative to target goals.
    *   Interactive step counter and exercise activity logger.
*   **🔒 Secure Authentication:**
    *   JWT-based user signup and sign-in flows using `bcryptjs` for secure password hashing.
    *   Automatic session restoration from local storage.

---

## 🛠️ Tech Stack

### Frontend
*   **React 19** & **Vite** — Fast, modern component-based UI development.
*   **Tailwind CSS v4** — High-performance utility-first styling.
*   **React Icons** — Clean icon library.
*   **Axios** — Robust HTTP client for API interactions.

### Backend
*   **Node.js** & **Express** — Scalable API architecture.
*   **MongoDB & Mongoose** — Document-oriented data models for users, chatbot history, and meal logs.
*   **JSON Web Tokens (JWT)** & **BcryptJS** — Secure user authentication middleware.
*   **Dotenv** & **Nodemon** — Seamless environment variable management and hot-reloading development server.

---

## 📂 Project Structure

```text
Apexfit/
├── backend/
│   ├── controllers/      # Route controllers (Auth, Chatbot, Nutrition)
│   ├── middleware/       # Authentication guards (JWT protect)
│   ├── models/           # Mongoose schemas (User, Bot history, Nutrition logs)
│   ├── routes/           # Express API endpoints
│   ├── index.js          # Main Express server configuration
│   └── .env              # Environment configurations (Port & MongoDB URL)
└── frontend/
    ├── public/           # Static assets
    ├── src/
    │   ├── component/    # React pages/components (Auth.jsx, Bot.jsx)
    │   ├── App.jsx       # Route/session gating component
    │   ├── index.css     # Tailwind styling directives
    │   └── main.jsx      # Vite React root mounting script
    └── vite.config.js    # Bundler configurations
```

---

## 💻 Installation & Setup

### Prerequisites
*   [Node.js](https://nodejs.org/) (v16+ recommended)
*   [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) or a local MongoDB instance.

### 1. Clone & Set Up Backend
1. Open a terminal in the `backend/` directory:
    ```bash
    cd backend
    ```
2. Install dependencies:
    ```bash
    npm install
    ```
3. Create a `.env` file in the root of the `backend/` directory and configure the environment variables:
    ```env
    PORT=4002
    MONGO_URL="your-mongodb-connection-string"
    JWT_SECRET="your-jwt-secret-key"
    ```
4. Run the development server:
    ```bash
    npm start
    ```
    *The server will start running on [http://localhost:4002](http://localhost:4002).*

### 2. Set Up Frontend
1. Open a terminal in the `frontend/` directory:
    ```bash
    cd ../frontend
    ```
2. Install dependencies:
    ```bash
    npm install
    ```
3. Run the development build:
    ```bash
    npm run dev
    ```
    *Access the application at [http://localhost:5173](http://localhost:5173) in your browser.*

---

