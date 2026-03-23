# 🎁 Balkan Giveaway Tracker

Balkan Giveaway Tracker is a multi-platform application designed to help users find and track giveaways across Serbia, Croatia, and Bosnia. It features a mobile app, a web interface, and a robust backend powered by automated scrapers.

## 🚀 Project Overview

This repository is a monorepo containing all components of the Balkan Giveaway Tracker system:

- **Mobile App**: Built with Flutter, offering a smooth user experience with local notifications and offline support.
- **Web Frontend**: A modern Nuxt.js (Vue 3) application.
- **Backend API**: A Node.js/TypeScript server using Express and Drizzle ORM.
- **Scrapers**: Python-based tools that automatically collect giveaway data from various sources.

---

## 🛠 Tech Stack

### Mobile (Flutter)
- **State Management**: Riverpod
- **Navigation**: GoRouter
- **Persistence**: SQLite (via `sqflite`)
- **Networking**: `http`
- **UI**: Material Design 3, custom SVG icons, cached network images.

### Backend (Node.js)
- **Language**: TypeScript
- **Framework**: Express.js
- **ORM**: Drizzle ORM
- **Database**: PostgreSQL
- **Validation**: Zod
- **Logging**: Pino

### Frontend (Nuxt.js)
- **Framework**: Nuxt 3 (Vue 3)
- **Styling**: Vanilla CSS (Modern design)

### Scrapers (Python)
- **Libraries**: BeautifulSoup, Requests, etc.
- **Sources**: Google, Instagram, and various web portals.

---

## 📁 Project Structure

```text
.
├── android/             # Android specific Flutter files
├── ios/                 # iOS specific Flutter files
├── lib/                 # Flutter application source code
├── backend/             # Node.js API & Database migrations
├── frontend-nuxt/       # Nuxt.js web application
├── scrapers/            # Python scraping scripts
├── assets/              # Shared assets (images, icons, data)
└── pubspec.yaml         # Flutter configuration
```

---

## 🏁 Getting Started

### Prerequisites
- [Flutter SDK](https://docs.flutter.dev/get-started/install)
- [Node.js](https://nodejs.org/) (v18+)
- [Python 3](https://www.python.org/)
- [Docker](https://www.docker.com/) (Optional, for easy backend setup)

### 1. Backend Setup
```bash
cd backend
npm install
# Setup .env file with your database credentials
npm run dev
```
*Alternatively, use Docker:* `docker-compose up`

### 2. Frontend Setup
```bash
cd frontend-nuxt
npm install
npm run dev
```

### 3. Mobile App Setup
```bash
# In the root directory
flutter pub get
flutter run
```

### 4. Running Scrapers
```bash
cd scrapers
pip install -r requirements.txt
python main.py
```

---

## 📱 Features

- **Real-time Feed**: See the latest giveaways from across the Balkan region.
- **Filtering**: Filter by country (RS, HR, BA), category, and platform.
- **Favorites**: Save giveaways to your local device to track them easily.
- **Notifications**: Get notified about new giveaways and upcoming deadlines.
- **Automated Updates**: Data is regularly refreshed via automated scraping scripts.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the ISC License - see the [backend/package.json](backend/package.json) for details.
