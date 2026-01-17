# ThriftyMobileApplication
Mobile application for Thrifty Store (React Native bare).

Version: v0.1.1

## Local setup
Prerequisites:
- Node.js 20+
- Xcode + iOS Simulator (for iOS)
- CocoaPods (`sudo gem install cocoapods` if needed)
- Android Studio + Android SDK (for Android)

Install dependencies:
```bash
npm install
```

Install iOS pods:
```bash
cd ios
pod install
cd ..
```

If you prefer Bundler, run `bundle install` and `bundle exec pod install` instead.

Run the app:
```bash
npm run ios
npm run android
```

API base URL defaults to:
- iOS simulator: `http://localhost:8080`
- Android emulator: `http://10.0.2.2:8080`

If you are on a physical device, update the base URL in `App.tsx` to your machine IP.
