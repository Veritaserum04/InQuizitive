"use client";

import Link from "next/link";

export default function PracticePage() {
  return (
    <main className="min-h-screen px-6 py-12">
      <h1 className="text-4xl font-bold text-center">Exam Preparation</h1>
      <p className="text-center text-gray-600 mt-2">
        Choose a mode to start practicing.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12 max-w-5xl mx-auto">
        
        {/* 1. Topic Practice */}
        <Link
          href="/topics"
          className="p-8 rounded-xl shadow bg-white hover:-translate-y-1 transition border"
        >
          <h2 className="text-2xl font-bold">Practice by Topic</h2>
          <p className="text-gray-600 mt-2">
            Attempt questions from your chosen subject or chapter.
          </p>
        </Link>

        {/* 2. Upload Material */}
        <Link
          href="/generate"
          className="p-8 rounded-xl shadow bg-white hover:-translate-y-1 transition border"
        >
          <h2 className="text-2xl font-bold">Quiz from Study Notes</h2>
          <p className="text-gray-600 mt-2">
            Upload PDF/DOCX/TXT to generate an instant quiz.
          </p>
        </Link>

        {/* 3. Random Test */}
        <Link
          href="/practice/random"
          className="p-8 rounded-xl shadow bg-white hover:-translate-y-1 transition border"
        >
          <h2 className="text-2xl font-bold">Random Test</h2>
          <p className="text-gray-600 mt-2">
            Take a quick test using mixed questions from all topics.
          </p>
        </Link>

      </div>
    </main>
  );
}
