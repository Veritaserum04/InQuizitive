"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/src/lib/supabase";

export default function FlashcardsHome() {
type Topic = {
  id: string;
  title: string;
};

const [topics, setTopics] = useState<Topic[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadTopics() {
      const { data, error } = await supabase
        .from("topics")
        .select("id, title");

      if (!error) setTopics(data || []);
      setLoading(false);
    }
    loadTopics();
  }, []);

  return (
    <main>
      <h1 className="text-4xl font-bold mb-6">Revise Topics</h1>

      {loading && <p>Loading...</p>}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {topics.map((t: any) => (
          <Link
            key={t.id}
            href={`/flashcards/${t.id}`}
            className="block p-6 bg-white rounded-xl shadow hover:shadow-lg hover:-translate-y-1 transition"
          >
            <h2 className="text-xl font-semibold">{t.title}</h2>
            <p className="text-gray-500">Start revision →</p>
          </Link>
        ))}
      </div>
    </main>
  );
}
