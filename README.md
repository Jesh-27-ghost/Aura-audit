# 🛡️ ShieldProxy: The Ultimate LLM Prompt Injection Firewall

ShieldProxy is a high-end, production-ready frontend interface for an LLM Prompt Injection Firewall. It is designed to visualize, manage, and prevent various attacks on Large Language Models including Prompt Injection, Jailbreaking, System Prompt Leaks, and Social Engineering. 

Built as a futuristic, cyber-security-themed SaaS dashboard using React, Vite, and custom CSS, ShieldProxy features a highly interactive UI with custom cursors, real-time simulated data visualizations, and an immersive glassmorphic design.

## 📋 Implementation Plan

The development of ShieldProxy follows a structured implementation plan focusing on modular components and realistic simulation:

1. **Phase 1: Foundation & Theming**
   - Initialize React + Vite project.
   - Establish a global CSS variable system (`App.css`) for consistent dark mode, neon accents (purple, green, red), and glassmorphism.
   - Implement `CustomCursor` and animated background components for an immersive user experience.

2. **Phase 2: Core Dashboard Navigation**
   - Build a responsive `Sidebar` with collapsible state and `lucide-react` icons.
   - Set up React Router for navigation between Overview, Clients, Alerts, Analytics, and Simulator pages.

3. **Phase 3: Data Simulation Engine**
   - Create `mockData.js` to procedurally generate realistic threat feeds, latency metrics, volume timelines, and client behavior data.
   - Implement helper functions for randomizing attack distributions across global maps and categories.

4. **Phase 4: Dashboard Pages Construction**
   - **Overview (`Overview.jsx`)**: Integrate `recharts` for volume traffic and latency visualizations.
   - **Clients & Alerts (`Clients.jsx`, `Alerts.jsx`)**: Build interactive tables and real-time feeds displaying the procedural threat data.
   - **Analytics (`Analytics.jsx`)**: Implement deep-dive visualization charts comparing blocked/allowed traffic and geographic data.

5. **Phase 5: The Attack Simulator Lab**
   - Create an interactive lab environment (`Simulator.jsx`).
   - Implement split-pane UI: left for payload configuration, right for the simulated firewall JSON response.
   - Add features like pre-built exploits, toggle simulation (Firewall ON/OFF), and dynamic result badges (BLOCK/PASS).

## ✨ Features

- **Overview Dashboard**: High-level metrics, real-time threat maps, threat severity distributions, and latency metrics.
- **Client Management**: Track connected applications (clients), API keys, individual request volumes, and block rates.
- **Alerts Center**: Real-time mock threat feed and critical anomaly notifications.
- **Analytics Hub**: Detailed time-series charts mapping blocked vs. allowed traffic over time using interactive data visualizations.
- **Hands-on Attack Simulator**: An interactive lab environment where users can test prompt injection attacks! 

## 🚀 Tech Stack

- **Core**: HTML, CSS, JavaScript (React 19)
- **Framework**: Vite
- **Styling**: Modular Vanilla CSS with CSS Variables, Glassmorphism, and custom animations.
- **Icons**: Lucide-React
- **Data Visualization**: Recharts

## 🛠️ Local Development Setup

To run ShieldProxy locally:

1. Clone or download the repository.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
4. Open your browser and navigate to `http://localhost:5173/`

---
*Developed as a hackathon showcase UI reflecting modern, premium security applications.*
