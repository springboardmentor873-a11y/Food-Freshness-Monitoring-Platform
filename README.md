# FreshTrack - AI Powered Food Freshness Monitoring Platform

FreshTrack is an AI-powered food freshness monitoring platform that helps identify whether a fruit is **Fresh** or **Rotten** using deep learning. The platform provides an intuitive web interface where users can upload an image and receive an instant prediction with confidence score and freshness analysis.

---

## 🚀 Features

- AI-based Fresh/Rotten Fruit Detection
- Image Upload and Preview
- Real-time Prediction
- Freshness Score
- Confidence Score
- Shelf Life Estimation
- Spoilage Probability
- Modern Responsive UI
- FastAPI Backend
- TensorFlow Deep Learning Model

---

## 🛠 Tech Stack

### Frontend

- React
- TypeScript
- Vite
- Tailwind CSS
- TanStack Router
- Lucide Icons

### Backend

- FastAPI
- Python
- TensorFlow
- OpenCV
- Pillow
- NumPy

---

## 📂 Project Structure

```
FreshTrack
│
├── backend
│   ├── app.py
│   ├── predict.py
│   └── requirements.txt
│
├── src
│   ├── components
│   ├── routes
│   ├── assets
│   └── styles
│
├── public
├── package.json
└── README.md
```

---

## ⚙️ Installation

### Clone Repository

```bash
git clone https://github.com/springboardmentor873-a11y/Food-Freshness-Monitoring-Platform.git

cd Food-Freshness-Monitoring-Platform
```

Switch to the project branch:

```bash
git checkout harshit-hoonka
```

---

## 💻 Frontend Setup

Navigate to the frontend directory:

```bash
cd frontend
```

Install the required dependencies:

```bash
npm install
```

Run the development server:

```bash
npm run dev
```

Frontend will be available at:

```
http://localhost:8080
```

---

## 🖥️ Backend Setup

Navigate to the backend directory:

```bash
cd backend
```

Create a virtual environment:

```bash
python -m venv venv
```

Activate the virtual environment:

**Windows:**

```bash
venv\Scripts\activate
```

**Linux/Mac:**

```bash
source venv/bin/activate
```

Install backend dependencies:

```bash
pip install -r requirements.txt
```

Start the backend server:

```bash
uvicorn app:app --reload
```

Backend API will be available at:

```
http://127.0.0.1:8000
```

---

## 🔗 API Documentation

The backend API can be accessed at:

```
http://127.0.0.1:8000
```

---

## 🤖 AI Model

The deep learning model classifies fruit images into:

- Fresh
- Rotten

The backend returns:

- Fruit Name
- Freshness Status
- Confidence Score

---

## 📄 License

This project is developed for educational and internship purposes.
