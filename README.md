# ThriftyMobileApplication
Mobile application for Thrifty Store (React Native + Expo).

Version: v0.1.1

## Local setup
Prerequisites:
- Node.js 18+
- Expo CLI (`npm install -g expo` if needed)

Install dependencies:
```bash
npm install
```

Run the app:
```bash
npm run ios
npm run android
```

API base URL defaults to:
- iOS simulator: `http://localhost:8080`
- Android emulator: `http://10.0.2.2:8080`

If you are on a physical device, update the base URL in `App.tsx` to your machine IP.
