# SmartClass AI: Project Architecture & Tech Stack Guide

This document is designed to serve as your ultimate "Cheat Sheet" for your project presentation. It breaks down exactly how the project is organized, what every folder does, and precisely why each specific library/tool was chosen.

---

## 1. Project Folder Structure (How it's organized)

Your project follows a modern "Full-Stack + Edge AI" architecture. Here is where everything lives:

```text
smartclass-ai/
├── dataset/                     # 📸 Identity Database: Holds student photos for facial recognition (e.g., 2404138_Vishal.jpeg).
├── vision_ai.py                 # 🧠 Edge AI Node: The main Python script that runs the camera, detects faces, and analyzes behavior.
│
└── src/                         # 🌐 Web Application (Next.js)
    ├── app/                     # 📄 Pages & Routes
    │   ├── api/                 # ⚙️ Backend API: Acts as the receiver for your ESP32 hardware data (e.g., /api/sensors).
    │   ├── dashboard/           # 📊 Frontend Page: The main dashboard showing live hardware metrics.
    │   └── attendance/          # 🙋 Frontend Page: The page showing the Live Attendance Register.
    │
    ├── components/              # 🧩 UI Building Blocks
    │   ├── DigitalTwinMap.tsx   # 🗺️ The 3x3 grid map showing where students are sitting.
    │   └── ui/                  # 🎨 Reusable buttons, cards, and badges (Tailwind).
    │
    └── contexts/                # 🧠 Global State & Memory
        └── SimulationContext.tsx# 🔄 The "Brain" of the website. It fetches data from the ESP32 and Python script every second and saves attendance to LocalStorage.
```

---

## 2. The Tech Stack (What tools were used & why)

If your professor asks, *"Why did you use Library X?"*, use these explanations.

### 🧠 Computer Vision & Edge AI (Python)

*   **OpenCV (`cv2`)**: 
    *   *What it is:* The industry-standard computer vision library.
    *   *How it's used here:* It connects to your laptop's webcam, captures the live video frame-by-frame, and converts the image colors (BGR to RGB) so the AI models can process them.
*   **MediaPipe (`mediapipe`)**: 
    *   *What it is:* An ultra-fast, lightweight machine learning framework built by Google. 
    *   *How it's used here:* We used MediaPipe's `FaceLandmarker` instead of heavier models like YOLO. Why? Because MediaPipe is optimized for "Edge Devices" (like running on a laptop CPU). It tracks 478 3D points on the face in real-time to determine head orientation (calculating if a student is "Engaged" or "Distracted").
    *   *(Note for Professor: If asked about YOLO, explain that you intentionally chose MediaPipe over YOLO because YOLO is too heavy for real-time face landmarking on a standard CPU without a dedicated GPU).*
*   **Face Recognition (`face_recognition` & `dlib`)**: 
    *   *What it is:* A state-of-the-art facial recognition library built on a deep learning framework (dlib) written in C++.
    *   *How it's used here:* It computes a 128-dimensional mathematical map of a face. It compares the live webcam face against the photos in your `dataset/` folder. If the mathematical "distance" is close enough, it marks the student as Present and calculates the Confidence %.
*   **Flask**: 
    *   *What it is:* A lightweight micro-web framework for Python.
    *   *How it's used here:* It turns your Python script into a local server (`localhost:5000/api/classroom-state`). This allows the Python AI to easily share its live data with the Next.js website in real-time.

### 🌐 The Web Dashboard

*   **Next.js 14 & React**: 
    *   *What it is:* A modern, high-performance web framework.
    *   *How it's used here:* Next.js acts as both the Frontend (the UI you see) and the Backend (the API routes that the ESP32 hardware talks to). It updates the UI instantly without ever needing to refresh the page.
*   **Tailwind CSS**: 
    *   *What it is:* A utility-first CSS framework.
    *   *How it's used here:* It is used to style the entire dashboard (colors, grids, layouts) directly inside the HTML/React code. It prevents the need for massive, messy `.css` files.
*   **TypeScript**: 
    *   *What it is:* JavaScript with strict data typing.
    *   *How it's used here:* It ensures that the data structure sent by the ESP32 exactly matches what the dashboard expects (e.g., ensuring `temperature` is always a number). This prevents the website from crashing during a live demo.

### 🔌 IoT & Hardware

*   **ESP32 Microcontroller**: 
    *   *What it is:* A low-cost, low-power system on a chip with integrated Wi-Fi.
    *   *How it's used here:* It acts as the IoT Gateway. It reads physical inputs from the DHT11 (Temp/Humidity), MQ135/MQ2 (Air Quality/Smoke), and PIR (Motion) sensors, and securely transmits that data over Wi-Fi (via HTTP POST) directly to the Next.js API.

---

## 3. The 3-Sentence Project Summary (Memorize This)

*"SmartClass AI is a decentralized Edge-IoT platform. The hardware layer uses an **ESP32** to transmit environmental sensor data over Wi-Fi, while the Edge AI layer uses **OpenCV and MediaPipe** to perform real-time facial recognition and engagement tracking on local hardware. Both data streams are fused together into a responsive **Next.js** dashboard, creating a complete Digital Twin of the classroom without relying on expensive cloud servers."*
