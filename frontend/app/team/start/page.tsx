"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/src/lib/supabase";
import { motion } from "framer-motion";

interface Topic {
  id: string;
  title: string;
  description?: string | null;
}

function generateRoomCode(length = 4) {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let result = "";
  for (let i = 0; i < length; i++) {
    const idx = Math.floor(Math.random() * chars.length);
    result += chars[idx];
  }
  return result;
}

export default function TeamStartPage() {
  const router = useRouter();
  const [topics, setTopics] = useState<Topic[]>([]);
  const [selectedTopicId, setSelectedTopicId] = useState("");
  const [loadingTopics, setLoadingTopics] = useState(true);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadTopics() {
      const { data, error } = await supabase
        .from("topics")
        .select("id, title, description")
        .order("title", { ascending: true });

      if (error) {
        console.error(error);
        setError("Failed to load topics.");
      } else {
        setTopics(data || []);
      }
      setLoadingTopics(false);
    }

    loadTopics();
  }, []);

  async function handleCreateSession() {
    if (!selectedTopicId) {
      setError("Please select a topic first.");
      return;
    }

    setError("");
    setCreating(true);

    const code = generateRoomCode();

    const { error } = await supabase.from("team_sessions").insert({
      code,
      topic_id: selectedTopicId,
    });

    setCreating(false);

    if (error) {
      console.error(error);
      setError("Failed to create team session.");
      return;
    }

    router.push(`/team/host/${code}`);
  }

  return (
    <main className="min-h-screen px-6 py-12 flex items-center justify-center bg-gradient-to-br from-teal-50 to-sky-50">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-2xl bg-white rounded-3xl shadow-xl p-8 border border-teal-100"
      >
        <h1 className="text-3xl md:text-4xl font-black text-teal-700 tracking-tight text-center">
          Start Team Quiz
        </h1>
        <p className="text-gray-600 mt-3 text-center">
          Choose a topic and generate a room code for your teams to join.
        </p>

        <div className="mt-8">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select Topic
          </label>

          {loadingTopics ? (
            <p className="text-gray-500 text-sm">Loading topics...</p>
          ) : topics.length === 0 ? (
            <p className="text-red-500 text-sm">
              No topics found. Please add topics in Supabase.
            </p>
          ) : (
            <select
              value={selectedTopicId}
              onChange={(e) => setSelectedTopicId(e.target.value)}
              className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-gray-800 focus:ring-2 focus:ring-teal-400 focus:outline-none bg-gray-50"
            >
              <option value="">-- Choose a topic --</option>
              {topics.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.title}
                </option>
              ))}
            </select>
          )}
        </div>

        {error && (
          <p className="mt-4 text-sm text-red-500 text-center">{error}</p>
        )}

        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          disabled={!selectedTopicId || creating}
          onClick={handleCreateSession}
          className={`mt-8 w-full h-12 rounded-xl text-white font-semibold shadow-md transition
            ${
              !selectedTopicId || creating
                ? "bg-gray-300 cursor-not-allowed"
                : "bg-teal-600 hover:bg-teal-700"
            }`}
        >
          {creating ? "Creating session..." : "Start Team Quiz"}
        </motion.button>

        <p className="mt-4 text-xs text-gray-400 text-center">
          Host will get a room code and teams can join from the Team Join page.
        </p>
      </motion.div>
    </main>
  );
}
