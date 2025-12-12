# Deploying to Render

The "Timed Out" error usually happens if your app crashes on startup or takes too long to connect to the database.

## 1. Prerequisites
- **MongoDB Atlas Account**: You need a cloud database. Render does not provide one for free.
    1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
    2. Create a free cluster.
    3. In "Network Access", allow IP Address `0.0.0.0/0` (Allow Access from Anywhere).
    4. Get your connection string (e.g., `mongodb+srv://user:pass@cluster.mongodb.net/powerview`).

## 2. Prepare Code
I have already updated your `backend/package.json` to include the start script:
```json
"start": "node server.js"
```

## 3. Render Configuration
1. **New Web Service**: Connect your GitHub repo.
2. **Root Directory**: `backend` (Important!)
3. **Build Command**: `npm install`
4. **Start Command**: `npm start` (or `node server.js`)
5. **Environment Variables** (Scroll down to "Advanced"):
   - `MONGO_URI`: Paste your MongoDB Atlas connection string.
   - `JWT_SECRET`: Any random secret string.
   - `FRONTEND_URL`: Your deployed frontend URL (e.g., `https://powerview-frontend.onrender.com`). Leave empty for now if not deployed.
   - `PORT`: `5001` (Render usually sets this automatically to 10000, but your code respects `process.env.PORT` so it's fine).

## 4. Troubleshooting "Timed Out"
If it still times out:
1. Go to the **Logs** tab in Render.
2. Look for "MongoDB Connection Error".
3. If you see it, check your `MONGO_URI`.
4. If you see "Server running on port...", but it still times out, Render might ideally expect port 10000. It sets `PORT` env var. Since our code uses `process.env.PORT`, it should work.

## 5. Frontend Deployment
1. **New Static Site**: Connect repo.
2. **Root Directory**: `frontend`
3. **Build Command**: `npm install && npm run build`
4. **Publish Directory**: `dist`
5. **Environment Variables**:
   - `VITE_API_URL`: The URL of your deployed Backend (e.g., `https://powerview-backend.onrender.com/api`).
