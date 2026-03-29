# 🛡️ ShieldProxy: The Ultimate LLM Prompt Injection Firewall

ShieldProxy is a high-end, production-ready frontend interface for an LLM Prompt Injection Firewall. It is designed to visualize, manage, and prevent various attacks on Large Language Models including Prompt Injection, Jailbreaking, System Prompt Leaks, and Social Engineering. 

Built as a futuristic, cyber-security-themed SaaS dashboard using React, Vite, and custom CSS, ShieldProxy features a highly interactive UI with custom cursors, real-time simulated data visualizations, and an immersive glassmorphic design.

## ✨ Features

- **Overview Dashboard**: High-level metrics, real-time threat maps, threat severity distributions, and latency metrics.
- **Client Management**: Track connected applications (clients), API keys, individual request volumes, and block rates.
- **Alerts Center**: Real-time mock threat feed and critical anomaly notifications.
- **Analytics Hub**: Detailed time-series charts mapping blocked vs. allowed traffic over time using interactive data visualizations.
- **Hands-on Attack Simulator**: An interactive lab environment where users can test prompt injection attacks! Features a payload configuration panel, pre-built exploits, flow-state visualizer, and simulated server-side JSON response. 

## 🚀 Tech Stack

- **Core**: HTML, CSS, JavaScript (React 19)
- **Framework**: Vite
- **Styling**: Modular Vanilla CSS with CSS Variables, Glassmorphism, and custom animations.
- **Icons**: Lucide-React
- **Data Visualization**: Recharts

## 🛠️ Local Development Setup

To run ShieldProxy locally:

1. Clone or download the repository.
2. Navigate to the `ShieldProxy` directory:
   ```bash
   cd ShieldProxy
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```
5. Open your browser and navigate to `http://localhost:5173/`

## 🧠 The Attack Simulator Component

The crown jewel of the ShieldProxy UI is the interactive **Attack Simulator**. Navigate to `/simulator` to test the capabilities of the firewall against mock attacks.

- **Pre-Built Exploits**: Quickly load known attack vectors like DAN or "Ignore all previous instructions".
- **Real-Time Evaluation Simulation**: Demonstrates latency, network flow, and generates a realistic confidence score and JSON metadata.
- **Comparison Toggle**: Disable the firewall to see how raw payload responses differ from the shielded protection responses.


---
*Developed as a hackathon showcase UI reflecting modern, premium security applications.*
