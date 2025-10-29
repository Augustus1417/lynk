# Lynk Chat App (In Development)

Lynk is a React Native chat application built with **Firebase** (Firestore) for real-time messaging. This project is under active development and intended for internal use by developers.

## Project Structure

```
app
├── components          # Reusable UI components (ChatBubble, InputBox, UserListItem)
├── contexts            # Context providers (AuthContext)
├── navigation          # React Navigation stack
├── screens             # All app screens
│   ├── Auth
│   ├── Chats
│   ├── Profile
│   ├── Search
│   └── Splash
├── services            # Firebase services (authService, chatService, userService)
└── types               # TypeScript type definitions
```

## Getting Started

1. Clone the repository:

```bash
git clone https://github.com/Augustus1417/lynk.git
```

2. Install dependencies:

```bash
npm install
```

3. Run the app:

```bash
npx expo start
```

## Notes for Developers

* Configure .env first before testing
* Messages store **senderId**; display names are fetched from Firestore.
* Navigation is typed with TypeScript; update `RootStackParamList` when adding new screens.
* Keyboard and SafeArea are handled with `KeyboardAvoidingView` and `SafeAreaView`.
* This app is **not production-ready**; features are still under development.