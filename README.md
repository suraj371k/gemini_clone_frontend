# Gemini Frontend Clone 

A fully functional, responsive, and visually appealing **Gemini-style conversational AI chat application** built with **Next.js 15 (App Router)**, Zustand, React Hook Form, Zod, and Tailwind CSS.  

This project simulates **OTP login**, **chatroom management**, **AI-powered messaging UI**, **image uploads**, and includes various **modern UX/UI features**.

---

## 🌐 Live Demo
👉 [View Deployed App](https://your-vercel-link.vercel.app)  

---

## ✨ Features

### 🔑 Authentication
- OTP-based Login/Signup flow with **country codes**.
- Country dial codes fetched from **external API**.
- Simulated OTP send/validation using `setTimeout`.
- Form validation with **React Hook Form + Zod**.

### 📋 Dashboard
- List all user’s **chatrooms**.
- Create/Delete chatrooms with **toast confirmations**.
- **Search bar with debounce** for filtering chatrooms.

### 💬 Chatroom Interface
- User + simulated AI messages with **timestamps**.
- **Typing indicator**: "Gemini is typing…".
- Fake AI reply with throttled delay (`setTimeout`).
- Auto-scroll to the latest message.
- **Reverse infinite scroll** (load older dummy messages).
- **Client-side pagination** (20 per page).
- **Image upload** (base64/local preview).
- Copy-to-clipboard on message hover.

### 🌍 Global UX
- Mobile-first **responsive design**.
- **Dark mode toggle**.
- Save **auth & chat data in localStorage**.
- Loading **skeletons** for messages.
- Toast notifications for key actions (OTP sent, message sent, room deleted).
- **Keyboard accessibility** across interactions.

---

## 🛠️ Tech Stack

- **Framework:** Next.js 15 (App Router)  
- **State Management:** Zustand  
- **Form Validation:** React Hook Form + Zod  
- **Styling:** Tailwind CSS  
- **Deployment:** Vercel  
- **Image Upload:** Local preview (base64)  
- **AI Simulation:** `setTimeout` with throttling  

---

## 📂 Folder Structure

```bash
src/
  app/
    api/
    login/
    signup/       
    profile/   # Chatrooms listing
    chatroom/
    create-room/    
  components/    # Reusable UI components
  store/         # Zustand stores

