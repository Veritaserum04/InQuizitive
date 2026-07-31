"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/src/lib/supabase";

export default function RevisePage() {
type Topic = {
  id: string;
  title: string;
  description: string;
};

const [topics, setTopics] = useState<Topic[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadTopics() {
      const { data, error } = await supabase
        .from("topics")
        .select("id, title, description")
        .order("title", { ascending: true });

      if (!error) setTopics(data || []);
      setLoading(false);
    }
    loadTopics();
  }, []);

  return (
    <main className="min-h-screen px-6 py-12">
      <h1 className="text-4xl font-bold text-center text-teal-700">Revise Flashcards</h1>
      <p className="text-center text-gray-600 mt-2">
        Select a topic to start revising flashcards.
      </p>

      {loading && <p className="text-center mt-10">Loading topics...</p>}

      {!loading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-10 max-w-6xl mx-auto">
          {topics.map((topic: any) => (
            <div
              key={topic.id}
              className="p-6 bg-white shadow rounded-xl border hover:-translate-y-1 transition"
            >
              <h2 className="text-xl font-bold text-teal-700">{topic.title}</h2>
              <p className="text-gray-600 mt-1">{topic.description}</p>

              <Link
                href={`/flashcards/${topic.id}`}
                className="
                  block mt-4 text-center 
                  bg-teal-500 text-white py-2 rounded-lg 
                  hover:bg-teal-600 transition font-semibold
                "
              >
                Revise Flashcards
              </Link>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
