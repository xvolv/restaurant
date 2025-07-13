# Restaurant Management System

A comprehensive restaurant management system built with modern web technologies, supporting both English and Amharic languages.

## Features

### Core Features
- **Point of Sale (POS) System**: 
  - Real-time order management
  - Table management with status tracking
  - Multiple payment methods support
  - Order history and analytics

- **Table Management**:
  - Table layout configuration
  - Table status tracking (Available, Occupied, Reserved, Cleaning)
  - Capacity management
  - Reservation system

- **Inventory Management**:
  - Stock tracking
  - Supply management
  - Expiry date tracking
  - Reorder notifications

- **User Management**:
  - Role-based access control
  - User authentication
  - User permissions management

### Technical Features
- Fully responsive design
- Dark/Light theme support
- Multi-language support (English and Amharic)
- Real-time notifications
- Data export capabilities

## Tech Stack

- **Frontend**:
  - React 18+
  - TypeScript
  - Tailwind CSS
  - Vite
  - React-i18next (for internationalization)

- **State Management**:
  - Custom Context API for authentication
  - Custom Context API for theme management
  - Custom Context API for language management

## Getting Started

### Prerequisites
- Node.js 16+
- npm or pnpm

### Installation

1. Clone the repository
```bash
git clone <repository-url>
```

2. Install dependencies
```bash
pnpm install
```

3. Start the development server
```bash
pnpm run dev
```

4. Build for production
```bash
pnpm run build
```

## Project Structure

```
src/
├── components/          # React components
│   ├── layout/          # Layout components (Header, Sidebar)
│   └── pages/           # Page components
├── contexts/           # React Contexts
│   ├── AuthContext     # Authentication context
│   ├── ThemeContext    # Theme context
│   └── LanguageContext # Language context
├── i18n/               # Internationalization
│   └── locales/        # Translation files
└── App.tsx            # Main application component
```

## Internationalization

The application supports multiple languages:
- English (default)
- Amharic

Translations are managed in `src/i18n/locales/` directory.

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support, please contact the project maintainers or open an issue in the repository.

## Acknowledgments

- Thanks to all contributors and users of this project
- Special thanks to the open-source community for their valuable contributions
