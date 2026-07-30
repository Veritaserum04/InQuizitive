"use client";

import Link from "next/link";

export default function TeamHome() {
  return (
    <main className="p-10 text-center">
      <h1 className="text-4xl font-bold text-teal-600">Team Mode</h1>
      <p className="mt-3 text-gray-600">
        Play quizzes together — in real-time, with teams!
      </p>

      <div className="mt-10 flex justify-center gap-6">
        <Link
          href="/team/create"
          className="px-6 py-3 bg-teal-500 hover:bg-teal-600 text-white rounded-xl shadow transition"
        >
          ➕ Create Room
        </Link>

        <Link
          href="/team/join"
          className="px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-xl shadow transition"
        >
          🔗 Join Room
        </Link>
      </div>
    </main>
  );
}
