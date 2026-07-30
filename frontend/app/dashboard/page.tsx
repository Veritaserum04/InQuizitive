"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { supabase } from "@/src/lib/supabase";

export default function Dashboard() {
  const [recentQuizzes, setRecentQuizzes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  async function loadRecent() {
    const { data, error } = await supabase
  .from("scores")
  .select("*")
  .order("joined_at", { ascending: false })
  .limit(5);

    if (!error) setRecentQuizzes(data || []);
    setLoading(false);
  }

  useEffect(() => {
    loadRecent();
  }, []);

  return (
    <main className="min-h-screen font-display px-6 py-12">

      {/* HEADER */}
      <div className="max-w-6xl mx-auto flex flex-col gap-2 mb-10">
        <h1 className="text-4xl font-black tracking-tight">
          Welcome Back 👋
        </h1>
        <p className="text-text-secondary-light dark:text-text-secondary-dark text-lg">
          Here's what's happening with your learning progress.
        </p>
      </div>

      {/* STATS CARDS */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        
        {/* Total Quizzes */}
        <div className="glass p-6 rounded-xl border shadow-sm">
          <p className="text-sm text-gray-500">Quizzes Taken</p>
          <h2 className="text-3xl font-bold mt-2">12</h2>
        </div>

        {/* Average Score */}
        <div className="glass p-6 rounded-xl border shadow-sm">
          <p className="text-sm text-gray-500">Average Score</p>
          <h2 className="text-3xl font-bold mt-2">82%</h2>
        </div>

        {/* Docs Uploaded */}
        <div className="glass p-6 rounded-xl border shadow-sm">
          <p className="text-sm text-gray-500">Documents Uploaded</p>
          <h2 className="text-3xl font-bold mt-2">5</h2>
        </div>

      </div>

      {/* QUICK ACTIONS */}
      <div className="max-w-6xl mx-auto mb-12">
        <h2 className="text-2xl font-bold mb-4">Quick Actions</h2>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">

          {/* Create Quiz */}
          <Link href="/generate">
            <div className="group cursor-pointer p-6 rounded-xl border shadow-sm glass hover:-translate-y-1 transition-all">
              <div className="text-primary text-4xl mb-4">📘</div>
              <h3 className="text-lg font-bold">Create New Quiz</h3>
              <p className="text-sm text-gray-500 mt-1">
                Generate a quiz from documents instantly.
              </p>
            </div>
          </Link>

          {/* Browse Topics */}
          <Link href="/topics">
            <div className="group cursor-pointer p-6 rounded-xl border shadow-sm glass hover:-translate-y-1 transition-all">
              <div className="text-teal-500 text-4xl mb-4">📚</div>
              <h3 className="text-lg font-bold">Browse Topics</h3>
              <p className="text-sm text-gray-500 mt-1">
                Explore quizzes by category.
              </p>
            </div>
          </Link>

          {/* Upload Document */}
          <Link href="/generate">
            <div className="group cursor-pointer p-6 rounded-xl border shadow-sm glass hover:-translate-y-1 transition-all">
              <div className="text-indigo-500 text-4xl mb-4">⬆️</div>
              <h3 className="text-lg font-bold">Upload Notes</h3>
              <p className="text-sm text-gray-500 mt-1">
                Turn your PDFs & documents into quizzes.
              </p>
            </div>
          </Link>

        </div>
      </div>

      {/* RECENT ACTIVITY */}
      <div className="max-w-6xl mx-auto">
        <h2 className="text-2xl font-bold mb-4">Recent Quiz Activity</h2>

        <div className="flex flex-col gap-3">

          {loading && (
            <p className="text-gray-500 text-sm">Loading...</p>
          )}

          {!loading && recentQuizzes.length === 0 && (
            <p className="text-gray-500 text-sm">
              No quizzes attempted yet. Try one now!
            </p>
          )}

          {!loading &&
            recentQuizzes.map((q) => (
              <div
                key={q.id}
                className="p-4 rounded-lg border glass shadow-sm flex justify-between items-center"
              >
                <div>
                  <p className="font-medium">{q.quiz_title}</p>
                  <p className="text-sm text-gray-500">
                    {new Date(q.created_at).toLocaleDateString()}
                  </p>
                </div>

                <p className="text-teal-600 font-bold">{q.score}%</p>
              </div>
            ))}

        </div>
      </div>
    </main>
  );
}
