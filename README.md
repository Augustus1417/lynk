# Lynk - College Chat App

A React Native chat application specifically designed for college students, built with Expo and TypeScript.

## Features

### Core Features
- **Direct Messaging**: Students can send direct messages to each other
- **Group Chats**: Class section-based group chats for collaboration
- **Find Students**: Browse and filter students by college program
- **Real-time Status**: See online/offline status of other students
- **Modern UI**: Red and white theme with clean, intuitive design

### Technical Features
- **Modular Architecture**: Easy to replace mock data with real backend
- **TypeScript**: Full type safety throughout the application
- **Responsive Design**: Works on iOS, Android, and web
- **Dark/Light Mode**: Automatic theme switching based on system preferences
- **Navigation**: Tab-based navigation with Expo Router

## Project Structure

```
/workspace/
├── app/                    # App screens and navigation
│   ├── (tabs)/            # Tab navigation screens
│   │   ├── index.tsx      # Main chat list
│   │   ├── explore.tsx    # Find students
│   │   └── profile.tsx    # User profile
│   ├── chat/[id].tsx      # Direct chat screen
│   └── group-chat/[id].tsx # Group chat screen
├── components/            # Reusable UI components
├── constants/             # Theme and styling constants
├── data/                  # Mock data and types
├── services/              # Data service layer
└── hooks/                 # Custom React hooks
```

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Expo CLI
- iOS Simulator (for iOS development) or Android Studio (for Android development)

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm start
   ```

4. Run on your preferred platform:
   - iOS: Press `i` in the terminal or scan QR code with Expo Go
   - Android: Press `a` in the terminal or scan QR code with Expo Go
   - Web: Press `w` in the terminal

## Mock Data

The app currently uses mock data defined in `/data/mockData.ts`. This includes:

- **Students**: Name, program, year, section, online status
- **Messages**: Content, timestamp, sender, read status
- **Chats**: Direct and group chat information

## Data Service Layer

The `/services/dataService.ts` provides a modular interface for data operations. This makes it easy to replace mock data with real API calls:

```typescript
// Example usage
import { dataService } from '@/services/dataService';

// Get all students
const students = await dataService.getStudents();

// Send a message
const message = await dataService.sendMessage(chatId, 'Hello!');

// Search students
const results = await dataService.searchStudents('john', 'Computer Science');
```

## Customization

### Theme
The app uses a red and white color scheme defined in `/constants/theme.ts`. You can easily modify colors, spacing, and typography.

### Adding New Features
1. Add new screens in the `/app` directory
2. Create reusable components in `/components`
3. Update the data service for new data operations
4. Add new types in `/data/mockData.ts`

## Backend Integration

To integrate with a real backend:

1. Replace mock data calls in `dataService.ts` with actual API calls
2. Add authentication logic
3. Implement real-time messaging with WebSockets
4. Add push notifications
5. Implement file upload for images and documents

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For questions or support, please open an issue in the repository.