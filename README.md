# SwapHub 🔄

SwapHub is a complete full-stack MERN (MongoDB, Express, React, Node.js) item exchange web application. Users can list items they own, browse items available in the community, search and filter them, and send and manage swap request offers.

---

## 🛠️ Tech Stack
* **Frontend**: React (Vite) + React Router + Axios + Tailwind CSS + Lucide React
* **Backend**: Node.js + Express
* **Database**: MongoDB with Mongoose
* **Authentication**: JWT + Bcrypt

---

## 📁 Repository Layout
This repository is configured as a monorepo:
* `/client`: React Vite frontend client
* `/server`: Node.js Express backend API server

---

## 🚀 Scaffolding Setup Instructions

### Prerequisites
* **Node.js**: Node 18+ is required.
* **MongoDB**: A running MongoDB instance locally or a MongoDB Atlas connection string.

### 1. Backend Setup
1. Navigate to the server folder:
   ```bash
   cd server
   ```
2. Set up environment variables. Copy `.env.example` to `.env` and fill in your connection string and credentials:
   ```bash
   cp .env.example .env
   ```
   *Note: If no MONGO_URI is set, the server defaults to connecting to a local MongoDB instance at `mongodb://localhost:27017/swaphub`.*
3. Install dependencies:
   ```bash
   npm install
   ```
4. Start the server in development mode:
   ```bash
   npm run dev
   ```
   The backend server runs at `http://localhost:5000`.

### 2. Frontend Setup
1. Navigate to the client folder:
   ```bash
   cd client
   ```
2. Configure environmental settings. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Run the frontend development server:
   ```bash
   npm run dev
   ```
   The client runs on port `3000` at `http://localhost:3000`. Proxying from Vite to the Express backend is pre-configured.

---

## 🔌 API Route Catalog

### Authentication Endpoints
* `POST /api/auth/register` — Registers a new user. Returns user details & token. (Public)
* `POST /api/auth/login` — Authenticates user credentials. Returns user details & token. (Public)
* `GET /api/auth/profile` — Retrieves the authenticated user's profile details. (Private)

### Item Endpoints
* `GET /api/items` — Fetches listed items. Filter by title search query (`?search=`) and category (`?category=`). (Public)
* `POST /api/items` — Creates a new item listing. (Private)
* `GET /api/items/:id` — Fetches detailed information for a single item. (Public)
* `PUT /api/items/:id` — Updates item specifications. Only the owner is authorized. (Private)
* `DELETE /api/items/:id` — Removes an item listing. Only the owner is authorized. (Private)

### Exchange Request Flow Endpoints
* `POST /api/requests` — Creates a swap request for a listed item. (Private)
* `GET /api/requests` — Fetches all swap requests (incoming & outgoing) involving the current user. (Private)
* `PUT /api/requests/:id/accept` — Accept proposal (Receiver only). swaps item ownerships, marks items status as `Swapped`, and declines conflicting requests. (Private)
* `PUT /api/requests/:id/reject` — Declines swap proposal (Receiver only). (Private)
* `PUT /api/requests/:id/cancel` — Cancels sent swap proposal (Requester only). (Private)

---

## 🔒 Security Configuration
* JWT authentication tokens are signed and returned upon registration/login.
* Requests to private routes are verified using a JWT middleware (`protect` function in `/server/middleware/authMiddleware.js`).
* Mutating database handlers check resource ownership matching (e.g. updating an item compares `item.owner` with `req.user._id`).

---

## 🌐 Production Deployment

### Backend (Render Web Service)
1. Log in to [Render](https://render.com) and click **New > Blueprint**.
2. Connect your GitHub repository.
3. Render will automatically parse the `render.yaml` file and configure the `swaphub-api-server` service.
4. Set the following environment variables in the Render dashboard:
   - `MONGO_URI` (Your MongoDB Atlas connection string)
   - `JWT_SECRET` (A strong random secret string for JWT signing)
5. Click **Deploy**. The backend service will compile and deploy automatically.

### Frontend (Vercel Host)
1. Log in to [Vercel](https://vercel.com) and click **Add New > Project**.
2. Select your GitHub repository.
3. Configure the Project settings:
   - **Framework Preset**: `Vite`
   - **Root Directory**: `client` (Very Important!)
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
4. Add the Environment Variable in Vercel settings:
   - `VITE_API_URL`: Set this to your deployed Render API base URL (e.g. `https://swaphub-api-server.onrender.com/api`).
5. Click **Deploy**. Vercel will build the frontend client and handle React Router SPA path refreshes automatically using `client/vercel.json`.

---

## 🚀 CI/CD Automation
A GitHub Actions workflow is active under `.github/workflows/ci.yml`. On every push to the `main` branch, it automatically:
1. Installs backend dependencies and checks syntax compilation.
2. Installs client dependencies and builds production assets to verify there are no compilation or bundling errors before deployment.
3. Pushes cleanly to production: Once the CI checks pass, Vercel and Render pick up the changes on `main` and trigger auto-deployments directly.

