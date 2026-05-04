# Firebase + GitHub Deployment

## Files to Commit

Commit the site files:

- `index.html`
- `styles.css`
- `app.js`
- `assets/wolf47-logo.png`
- `firebase-config.js`
- `ai-config.js`
- `market-config.js`
- `firebase.json`
- `.firebaserc`
- `.gitignore`
- `README.md`

Keep `CREDENTIALS.md` private if the repository is public.

## Firebase Setup

1. Create a Firebase project.
2. Enable Cloud Firestore.
3. Create a Web App in Firebase settings.
4. Copy the Web App config into `firebase-config.js`.
5. Set `enabled: true` in `firebase-config.js`.
6. Replace `YOUR_FIREBASE_PROJECT_ID` in `.firebaserc`.

## Gemini Setup

1. Get a Gemini API key from Google AI Studio.
2. Put the key in `ai-config.js`.
3. Set `enabled: true`.

## Deploy

```bash
firebase login
firebase use YOUR_FIREBASE_PROJECT_ID
firebase deploy
```

The app is static and deploys from the repository root.
