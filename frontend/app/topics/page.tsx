"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/src/lib/supabase";

export default function TopicsPage() {
  const [topics, setTopics] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [dbError, setDbError] = useState("");

  async function loadTopics() {
  console.log("loadTopics() started");

  const result = await supabase
    .from("topics")
    .select("id, title, description")
    .order("created_at", { ascending: false });

  console.log("FULL RESULT:", result);

  const { data, error } = result;

  if (error) {
    console.error("ERROR:", error);
    setDbError(error.message ?? "Unknown error");
    setLoading(false);
    return;
  }

  console.log("SETTING TOPICS:", data);
  setTopics(data || []);
  setLoading(false);
  console.log("DONE");
}

  useEffect(() => {
    loadTopics();
  }, []);

  return (
    <main className="min-h-screen px-6 py-12">
      <h1 className="text-4xl font-bold text-center">Browse Topics</h1>

      {/* Show DB error */}
      {dbError && (
        <p className="text-center text-red-500 mt-6 text-lg">
          Database Error: {dbError}
        </p>
      )}

      {/* Loading */}
      {loading && (
        <p className="text-center text-gray-500 mt-10">Loading topics...</p>
      )}
      
      {/* Topics List */}
      {!loading && !dbError && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-10 max-w-6xl mx-auto">
          {topics.map((topic) => (
            <div
              key={topic.id}
              className="p-6 bg-white shadow rounded-xl border hover:-translate-y-1 transition"
            >
              <h2 className="text-xl font-bold">{topic.title}</h2>
              <p className="text-gray-500 mt-1">{topic.description}</p>
            <Link href={`/flashcards/${topic.id}`}
  className="block mt-2 text-center bg-teal-500 text-white py-2 rounded-lg"
>
  Flashcards
</Link>

              <Link
                href={`/quiz/${topic.id}`}
                className="block mt-4 text-center bg-primary text-white py-2 rounded-lg"
              >
                Start Quiz
              </Link>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
