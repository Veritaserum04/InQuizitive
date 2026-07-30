# InQuizitive

InQuizitive is a modern full-stack quiz platform designed to make learning interactive and engaging. It allows users to practice quizzes, revise topics with flashcards, generate quizzes from PDFs, and compete with friends in real-time team quiz sessions.

##  Features

-  User Authentication
- Topic-wise Quiz Selection
-  Timed Multiple Choice Quizzes
-  Flashcards for Revision
-  Practice Mode
-  AI/PDF Quiz Generation
-  Real-time Team Quiz Mode
-  Live Leaderboard
-  Score Tracking & Dashboard
-  Responsive UI

---

##  Tech Stack

### Frontend
- Next.js (App Router)
- React
- JavaScript / TypeScript
- CSS

### Backend
- Next.js API Routes
- Supabase

### Database
- Supabase PostgreSQL

### Authentication
- Supabase Auth

---

## 📂 Project Structure

```
frontend/
│
├── app/
│   ├── dashboard/
│   ├── login/
│   ├── signup/
│   ├── topics/
│   ├── quiz/
│   ├── flashcards/
│   ├── practice/
│   ├── revise/
│   ├── generate/
│   └── team/
│
├── src/
├── public/
└── package.json
```

---

## 🚀 Getting Started

### Clone the repository

```bash
git clone https://github.com/Veritaserum04/InQuizitive.git
cd InQuizitive/frontend
```

### Install dependencies

```bash
npm install
```

### Configure environment variables

Create a `.env.local` file inside `frontend`.

Example:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### Run the development server

```bash
npm run dev
```

Open:

```
http://localhost:3000
```

---

## 📸 Screenshots

Add screenshots of:

- Login
- Dashboard
- Topics
- Quiz
- Flashcards
- Team Mode
- Leaderboard

---

## 🔮 Future Improvements

- AI-powered personalized quizzes
- Performance analytics
- Difficulty levels
- Streaks and achievements
- Mobile application
- Dark mode

---

## 👩‍💻 Author

**Amrutha V**

- GitHub: https://github.com/Veritaserum04
- LinkedIn: https://www.linkedin.com/in/amrutha-v-04a830351

---

## 📄 License

This project is licensed under the MIT License.
