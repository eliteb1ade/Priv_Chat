# ⚠️ Firebase Hosting Only (Frontend Only)

**Note**: Firebase Functions don't work well with Socket.IO for real-time chat. Use this only for hosting the frontend, then use Render/Railway for the full-stack app.

## Firebase Hosting (Frontend Only)

### 1. Install Firebase CLI
```bash
npm install -g firebase-tools
```

### 2. Login to Firebase
```bash
firebase login
```

### 3. Create Firebase Project
1. Go to [Firebase Console](https://console.firebase.google.com)
2. Click "Create a project"
3. Enter project name: `quick-chat-app`
4. Disable Google Analytics
5. Click "Create project"

### 4. Initialize Firebase Hosting
```bash
firebase init hosting
```

**Select these options:**
- Use existing project: Select your `quick-chat-app`
- Public directory: `dist`
- Single-page app: Yes
- Automatic builds: No

### 5. Deploy Frontend Only
```bash
# Build the app
npm run build

# Deploy to Firebase Hosting
firebase deploy --only hosting
```

## ⚠️ Important Limitation
This only hosts the frontend. You'll need to:
1. Deploy the backend to Render/Railway
2. Update the `VITE_SERVER_URL` in `.env.production` to point to your backend

## Better Alternative: Use Render
For a complete solution with both frontend and backend, use Render instead:
1. Go to [render.com](https://render.com)
2. Connect your GitHub repo
3. Deploy as a "Web Service"
4. Everything works automatically!