# 🌍 World Explorer — Interactive Global Atlas & Country Intelligence

[![GitHub Repo](https://img.shields.io/badge/GitHub-bashirahmed--Developer-181717?style=for-the-badge&logo=github)](https://github.com/bashirahmed-Developer)
[![Tech Stack](https://img.shields.io/badge/Stack-HTML5%20%7C%20CSS3%20%7C%20Vanilla%20JS%20(ES6%2B)-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)](https://github.com/bashirahmed-Developer)
[![Maps](https://img.shields.io/badge/Maps-Leaflet.js-199900?style=for-the-badge&logo=leaflet&logoColor=white)](https://leafletjs.com)
[![API](https://img.shields.io/badge/Data-REST%20Countries%20v3.1-blue?style=for-the-badge)](https://restcountries.com)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)

> An ultra-modern, high-performance web application to search, visualize, compare, and learn about every nation on Earth with interactive maps, quiz trivia, and verified offline capabilities.

---

## ✨ Features

- **🌐 250+ Countries & Territories**: Real-time integration with REST Countries API v3.1 with comprehensive demographic, geographical, and economic data.
- **🛡️ Built-in Offline Fallback Cache**: Seamlessly switches to local offline data if the API is unreachable or rate-limited.
- **🗺️ Interactive World Map (Leaflet.js)**: View all countries pinned across the globe on an interactive tile map with instant preview cards.
- **🔍 Instant Search & Multi-Filter**:
  - Search by country name, official title, capital city, or currency code.
  - Filter by Region (Africa, Americas, Asia, Europe, Oceania, Antarctic) & Subregions.
  - Sort by Population (High to Low, Low to High), Land Area, or Alphabetical (A-Z, Z-A).
- **📋 Deep Dive Country Details Modal**:
  - National Flag & Coat of Arms preview.
  - Key indicators: Capital, Population, Area (km²), Currencies, Official Languages, Timezones.
  - **Interactive Neighboring Border Countries**: Click on any neighbor border chip to immediately jump to and inspect that nation.
  - Quick links to Google Maps and Wikipedia.
- **⚖️ Side-by-Side Country Comparison Tool**: Compare any two countries simultaneously with visual percentage progress bars for population and landmass.
- **🎮 World Geography Quiz**: Test your geography skills with randomized flag-guessing trivia featuring instant scoring and streak tracking.
- **❤️ Favorites System**: Bookmark countries to your personal list stored persistently in `localStorage`.
- **🌓 Seamless Theme Engine**: Fluid dark mode and light mode with persistent user preference storage.
- **📱 100% Responsive & Accessible**: Optimized for mobile, tablet, and desktop viewports with glassmorphism aesthetic and fluid animations.

---

## 🚀 Live Demo & Preview

To run the application locally:
1. Simply double-click `index.html` in your file explorer to open it in any modern web browser.
2. Or use VS Code **Live Server** extension: Right-click `index.html` and click **"Open with Live Server"**.

---

## 📁 Project Structure

```text
world-explorer/
├── index.html           # Main semantic HTML5 markup & accessible modal containers
├── style.css            # Custom CSS3 design system, themes, and responsive layout
├── app.js               # Modular ES6+ state management, Leaflet map, quiz, & API logic
├── countries-data.js    # Built-in offline fallback data cache
└── README.md            # Comprehensive project documentation
```

---

## 🛠️ Step-by-Step GitHub Setup Guide

Follow these commands to push this project to your GitHub profile:

```bash
# 1. Initialize git repository
git init

# 2. Add all project files
git add .

# 3. Create initial commit
git commit -m "feat: initial commit of World Explorer project"

# 4. Rename default branch to main
git branch -M main

# 5. Link to your GitHub repository (replace with your repo URL)
git remote add origin https://github.com/bashirahmed-Developer/world-explorer.git

# 6. Push to GitHub
git push -u origin main
```

---

## ⚡ Deployment to Vercel

1. Go to [vercel.com](https://vercel.com) and log in with your GitHub account.
2. Click **"Add New..."** > **"Project"**.
3. Select your `world-explorer` repository.
4. Keep the default settings (Framework Preset: **Other**) and click **Deploy**.
5. Your project will be live with an SSL certificate and fast global CDN within seconds!

---

## 👨‍💻 Author

**Bashir Ahmed**
- GitHub: [@bashirahmed-Developer](https://github.com/bashirahmed-Developer)
- Role: Frontend & Full-Stack Web Developer

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).
