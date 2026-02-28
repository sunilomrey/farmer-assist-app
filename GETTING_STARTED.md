# Farmer Assist - React Native App

A modern React Native application built with Expo and TypeScript for agricultural management.

## 🚀 Features

- **Crop Management**: Track planting dates, growth stages, and harvest schedules
- **Irrigation Monitoring**: Optimize water usage with smart irrigation scheduling
- **Analytics & Reports**: View detailed insights and performance metrics
- **Team Collaboration**: Manage farm operations with team members
- **Livestock Tracking**: Monitor animal health and productivity
- **Offline Mode**: Continue working without internet connection
- **Modern UI**: Latest React Native components and latest layout patterns

## 🛠️ Tech Stack

- **Framework**: React Native
- **Build Tool**: Expo
- **Language**: TypeScript
- **Navigation**: Expo Router
- **Styling**: React Native StyleSheet
- **Theme Support**: Dark/Light mode

## 📋 Prerequisites

- Node.js (v18.13.0 or higher recommended)
- npm or yarn
- Expo CLI: `npm install -g expo-cli`

## 🔧 Installation

1. Navigate to the project directory:
```bash
cd farmer-assist
```

2. Install dependencies:
```bash
npm install
```

3. Install Expo CLI globally (if not already installed):
```bash
npm install -g expo-cli
```

## ▶️ Running the App

### Development Server
Start the Expo development server:
```bash
npm start
```

This will display a QR code in your terminal. You can then:

**iOS**:
- Press `i` to open in iOS Simulator (macOS only)
- Or scan the QR code with your iPhone using the Expo Go app

**Android**:
- Press `a` to open in Android Emulator
- Or scan the QR code with your Android device using the Expo Go app

**Web**:
- Press `w` to open in web browser

### Build for Production

#### iOS
```bash
npm run eas:build:ios
```

#### Android
```bash
npm run eas:build:android
```

## 📱 Project Structure

```
farmer-assist/
├── app/                      # App routes and screens
│   ├── (tabs)/              # Tab-based navigation
│   │   ├── index.tsx        # Home/Dashboard screen
│   │   ├── explore.tsx      # Explore screen
│   │   └── _layout.tsx      # Tab layout configuration
│   ├── _layout.tsx          # Root layout
│   └── modal.tsx            # Modal screen example
├── components/              # Reusable components
│   ├── hello-wave.tsx
│   ├── parallax-scroll-view.tsx
│   ├── themed-text.tsx
│   └── themed-view.tsx
├── hooks/                   # Custom React hooks
├── constants/               # App constants and colors
├── assets/                  # Images and static assets
├── package.json             # Project dependencies
└── tsconfig.json            # TypeScript configuration
```

## 🎨 Customization

### Adding New Screens

1. Create a new file in `app/` directory:
```tsx
// app/newscreen.tsx
import { ThemedView } from '@/components/themed-view';
import { ThemedText } from '@/components/themed-text';

export default function NewScreen() {
  return (
    <ThemedView>
      <ThemedText type="title">New Screen</ThemedText>
    </ThemedView>
  );
}
```

2. Navigate to it from another screen:
```tsx
import { useRouter } from 'expo-router';

const router = useRouter();
router.push('/newscreen');
```

### Theme Customization

Edit `constants/Colors.ts` to customize the color scheme:
```tsx
const tintColorLight = '#2d5016'; // Your brand color
const tintColorDark = '#1a3d0a';  // Dark mode color
```

### Adding Dependencies

```bash
npm install package-name
```

For Expo-specific packages:
```bash
npx expo install package-name
```

## 📚 Available Scripts

- `npm start` - Start Expo development server
- `npm run android` - Build and run on Android
- `npm run ios` - Build and run on iOS
- `npm run web` - Run web version
- `npm run reset-project` - Reset to fresh app structure

## 🐛 Debugging

### Using Expo DevTools

While running `npm start`, press:
- `j` - Open debugger
- `r` - Reload app
- `m` - Toggle menu

### Using React DevTools

Connect to your running app and use React DevTools to inspect component tree and state.

## 📖 Learn More

- [Expo Documentation](https://docs.expo.dev/)
- [React Native Documentation](https://reactnative.dev/)
- [TypeScript Documentation](https://www.typescriptlang.org/)
- [Expo Router Guide](https://docs.expo.dev/routing/introduction/)

## 🤝 Contributing

Feel free to modify and enhance this starter app for your needs.

## 📄 License

This project is open source and available under the MIT License.

## 🆘 Troubleshooting

### Build Issues
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Expo CLI Issues
```bash
# Update Expo CLI
npm install -g expo-cli@latest
```

### Port Already in Use
```bash
# Use a different port
npm start -- --port 19000
```

---

Happy farming! 🌾🚜
