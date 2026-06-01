<div align="center">
  <img src="public/logo.svg" width="100" alt="VocalVista Logo" />
  <h1>🎙️ VocalVista — AI-Native Voice-to-Voice Coach</h1>
  
  <p align="center">
    <img src="https://img.shields.io/badge/Next.js-15-000000?style=for-the-badge&logo=next.js&logoColor=white&labelColor=0F172A" alt="Next.js" />
    <img src="https://img.shields.io/badge/Convex-Backend-8B5CF6?style=for-the-badge&logo=convex&logoColor=white&labelColor=312E81" alt="Convex" />
    <img src="https://img.shields.io/badge/Deepgram-V2V_Agent-000000?style=for-the-badge&logo=deepgram&logoColor=white&labelColor=312E81" alt="Deepgram V2V" />
    <img src="https://img.shields.io/badge/Gemini-3.1_Flash--Lite-8E75FF?style=for-the-badge&logo=google-gemini&logoColor=white&labelColor=312E81" alt="Gemini" />
    <img src="https://img.shields.io/badge/Tailwind-CSS-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white&labelColor=0C4A6E" alt="Tailwind" />
    <img src="https://img.shields.io/badge/Stack_Auth-Identity-F43F5E?style=for-the-badge&logo=auth0&logoColor=white&labelColor=881337" alt="Auth" />
  </p>
</div>

### Real-Time Conversational Coaching & Speech Mastery

VocalVista is an AI-native voice-coaching workspace designed to sharpen public speaking, interview delivery, storytelling, and language fluency. Powered by a unified WebSocket voice-to-voice stream, VocalVista matches you with specialized AI expert personas to simulate low-latency interactive scenarios, analyze verbal habits, and generate comprehensive progress diagnostics.

---


## The Engine: Unified Temporal Architecture

VocalVista operates on a bi-directional WebSocket interface communicating with Deepgram's Voice Agent client.

### Interactive Data Flow

```mermaid
graph TD
    %% Styling Nodes
    classDef client fill:#0f172a,stroke:#475569,stroke-width:2px,color:#f8fafc;
    classDef convex fill:#1e1b4b,stroke:#9C00FF,stroke-width:2px,color:#e0e7ff;
    classDef dg fill:#1e1b4b,stroke:#00C7B7,stroke-width:2px,color:#e0e7ff;
    
    %% User Actions
    User([User speaks into microphone]) -->|1. Real-time Audio Stream| Client[Spatial Mic Processor]
    
    %% Web Socket Stream
    Client -->|2. Direct 24kHz Linear16 WebSockets| Agent[Deepgram Voice Agent API]
    
    %% AI Generation & Synthesis
    Agent -->|3. Audio stream back to browser queue| Speaker[Browser Speaker Queue]
    Agent -->|4. Live ConversationText packet| Transcripts[ChatBox Transcript Canvas]
    
    %% Credit Billing and Session Save
    Transcripts -->|5. Real-time Credit Billing| DB[(Convex Database)]
    DB -->|6. Save conversation history on disconnect| FeedbackBoard[Gemini 3.1 Flash-Lite Summary]
    
    class User,Client,Speaker client;
    class DB,FeedbackBoard convex;
    class Agent,Transcripts dg;
```

---

## Core Features

-   **Unified Voice-to-Voice**: Sub-second, full-duplex conversational voice training powered directly by Deepgram's Voice Agent API.
-   **Interactive Coaching Modes**: Toggle specialized modes including Mock Interviews, Presentation Prep, Debate Practice, Language Learning, and Mindfulness Meditation.
-   **Expert Coach Cast**: Train with dedicated personas including Sofia (Warm & Encouraging), Ethan (Professional & Structured), or Justin (Dynamic & Energetic).
-   **Detailed Feedback Diagnostics**: Receive comprehensive post-session analysis, structured coaching notes, and action plans powered by Gemini 3.1 Flash-Lite.
-   **Dynamic Call Transcripts**: Track your conversation visually with real-time speech-bubble logs that stream alongside the live voice session.
-   **Real-time Credit Protection**: Dynamic character-billing safely auto-suspends your call if credit balances hit zero, preventing unexpected costs.

---

## Screenshots

<div align="center">
  <img width="2560" height="1158" alt="Dashboard Preview" src="https://github.com/user-attachments/assets/3760aea3-0095-4744-9358-b9972a91ed89" />
  <img width="2560" height="1173" alt="Active Session Preview" src="https://github.com/user-attachments/assets/274aab1a-c873-461f-97a8-b3b9e80669dd" />
  <img width="2560" height="1140" alt="Session Summary Preview" src="https://github.com/user-attachments/assets/477f190c-5b7e-4cb6-a688-f380b9f667fd" />
  <img width="2560" height="1185" alt="Analytics Preview" src="https://github.com/user-attachments/assets/41f89817-7072-44b4-bfb2-f0775e58d91e" />
  <img width="2560" height="1140" alt="Profile Settings" src="https://github.com/user-attachments/assets/b5197572-5632-47b6-9465-8acf24d31190" />
</div>

---

## Voice Agent Capabilities

VocalVista runs on a highly customizable instruction layout. It supports a comprehensive range of direct voice mechanics:

| Coaching Dimension | Custom Instructions | Core Model | Target Outcome |
| :--- | :--- | :--- | :--- |
| **Mock Interview** | Interrogate on specific roles, provide constructive tips, keep short. | `gpt-4o` | Realistic HR panel simulations and professional posture. |
| **Debate Lab** | Direct logical rebuttals, critique arguments. | `gpt-4o` | Rapid reasoning, cognitive clarity, and articulation skills. |
| **Mindful Meditation** | Slow soothing speech, pacing, breathing instructions. | `gpt-4o` | Stress relief, pacing control, and clear voice breathing. |
| **Language Practice** | Vocabulary guidance, syntax review, pronunciation guides. | `gpt-4o` | Pronunciation fluency, syntax corrections, and active speaking. |

---

## Tech Stack

-   **Frontend**: Next.js 15 (Turbopack), Tailwind CSS, Framer Motion, Radix UI.
-   **Backend**: Convex (Real-time Database, Serverless Mutations & Queries).
-   **Authentication**: Stack Auth (Cloud-native identity management).
-   **V2V Engine**: Deepgram Voice Agent API (WebSocket duplex stream).
-   **Diagnostics**: Google Gemini 3.1 Flash-Lite.

---

## Getting Started

### 1. Environment Configuration
Create a `.env.local` file in your root folder:
```env
# 🏢 Convex Backend Deployment Configuration
CONVEX_DEPLOYMENT=your_convex_deployment_name
NEXT_PUBLIC_CONVEX_URL=your_convex_url

# 🎤 Voice Processing API (Deepgram)
DEEPGRAM_API_KEY=your_deepgram_api_key
NEXT_PUBLIC_DEEPGRAM_API_KEY=your_deepgram_api_key

# 🔐 Authentication (Stackframe)
NEXT_PUBLIC_STACK_PROJECT_ID=your_stack_project_id
NEXT_PUBLIC_STACK_PUBLISHABLE_CLIENT_KEY=your_publishable_client_key
STACK_SECRET_SERVER_KEY=your_secret_server_key

# 🧠 Diagnostics (Google Gemini)
GEMINI_API_KEY=your_gemini_api_key
```

### 2. Install & Run
```bash
# Install package dependencies
npm install

# Start local server
npm run dev
```

---
*Built for real-time speech mastery.*
