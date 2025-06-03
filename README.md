
# 📧 Email Reply Assistant 🤖

An AI-powered assistant that helps generate context-aware email replies with customizable tone options. Built with a **React + Vite** frontend, **Spring Boot** backend, and a **browser extension** for seamless usage across Gmail.com.

---

## 🚀 Features

- ✍️ AI-generated replies from given email content
- 🎨 Choose from different tones (Professional, Friendly, Casual)
- ⚡ Fast and responsive frontend with Vite
- 🧠 Backend powered by Java + Spring Boot
- 🌐 Browser extension for Gmail-like integration
- 📋 One-click copy to clipboard

---

## 🗂️ Project Structure

```
email-assistant                                  → Spring Boot backend
email-assistant-ext                              → Chrome Extension
images                                           → UI screenshots & assets
email-assistant-react/public/src                 → React + Vite frontend
```

---

## 📦 Tech Stack

| Frontend        | Backend           | Extension                   | Other        |
|-----------------|-------------------|-----------------------------|--------------|
| React + Vite    | Spring Boot (Java)| Manifest V3                 | MUI (v5)     |
| Axios           | REST API          | JavaScript, MutationObserver| Vite         |

---

## 📂 Directory Overview

### 🔧 Backend - `email-assistant`
Java Spring Boot project with:
- `EmailGeneratorController` – API endpoint
- `EmailGeneratorService` – Business logic
- `EmailRequest` – Request DTO

Run it:
```bash
./mvnw spring-boot:run
```

API available at:
```
POST http://localhost:8080/api/email/generate
```

---

### ⚛️ Frontend - `src/` (React + Vite)
Modern UI built with Material UI (MUI) and React.

Start development server:
```bash
npm install
npm run dev
```
## 📸 Screenshots

| WebPage | Response |
|--------|----------|
| ![App Screenshot](images/react-vite-webpage.png) | ![App Screenshot Response](images/reactPage-response.png) |


### 🧩 Browser Extension (Reply with AI) - `email-assistant-ext/`
Chrome extension to autofill email replies directly from the inbox.

Steps:
1. Go to `chrome://extensions`
2. Enable "Developer Mode"
3. Click **Load unpacked**
4. Select `email-assistant-ext` folder

---

## 📸 Screenshots

| Compose Area | Tone Selection | Final Reply Output |
|--------------|----------------|---------------------|
| ![Compose Area](images/composeArea.png) | ![Tone](images/tone.png) | ![Final](images/final.png) |

---

## 🔑 API Key Setup (Google Gemini)

To use this project, you must set up the **Google Gemini API key and endpoint** before running the backend.

#### Steps:

1. **Get your API key** from [Google AI Studio](https://makersuite.google.com/app/apikey).
2. In your IDE (e.g., IntelliJ), go to:Run > Edit Configurations > Environment Variables
3. Add the following environment variables:

```env
GEMINI_API_KEY=your_api_key_here
GEMINI_API_URL=https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent
```
4. These are automatically picked up by the application using:
```
gemini.api.key=${GEMINI_API_KEY}
gemini.api.url=${GEMINI_API_URL}
```

---

## 🤝 Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you'd like to change.

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
