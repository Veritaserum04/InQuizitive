"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/src/lib/supabase";
import { use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function RoomLobby({ params }: any) {
const { roomId } = use(
  params as Promise<{
    code: string;
    roomId: string;
  }>
);
  const router = useRouter();

  const [room, setRoom] = useState<any>(null);
  const [players, setPlayers] = useState<any[]>([]);
  const [topics, setTopics] = useState<any[]>([]);
  const [selectedTopic, setSelectedTopic] = useState("");

  useEffect(() => {
    async function load() {
      // Get room
      const { data: r } = await supabase
        .from("rooms")
        .select()
        .eq("id", roomId)
        .single();
      setRoom(r);

      // Get topics
      const { data: t } = await supabase.from("topics").select("id,title");
      setTopics(t || []);

      // Listen for new players (Realtime)
      supabase
        .channel(`room-${roomId}`)
        .on(
          "postgres_changes",
          { event: "*", schema: "public", table: "room_players", filter: `room_id=eq.${roomId}` },
          (payload) => {
            fetchPlayers();
          }
        )
        .subscribe();

      fetchPlayers();
    }

    load();
  }, []);

  async function fetchPlayers() {
    const { data: p } = await supabase
      .from("room_players")
      .select()
      .eq("room_id", roomId);
    setPlayers(p || []);
  }

  async function startQuiz() {
    if (!selectedTopic) {
      alert("Select a topic first!");
      return;
    }

    await supabase
      .from("rooms")
      .update({ topic_id: selectedTopic, is_active: true })
      .eq("id", roomId);

    router.push(`/team/play/${roomId}`);
  }

  return (
    <div className="max-w-xl mx-auto mt-10 text-center">

      <h1 className="text-3xl font-bold">Room Lobby</h1>

      <p className="text-gray-600 mt-3">
        Share this link with players to join:
      </p>

      <div className="bg-gray-200 p-3 rounded mt-3 font-mono break-all">
        {typeof window !== "undefined" && window.location.href}
      </div>

      <h2 className="mt-8 text-xl font-bold">Players</h2>
      <ul className="mt-3">
        {players.map((p) => (
          <li key={p.id} className="p-2 border-b">
            {p.name}
          </li>
        ))}
      </ul>

      <h2 className="text-xl font-bold mt-8">Select Topic</h2>

      <select
        className="mt-3 w-full p-3 rounded border"
        value={selectedTopic}
        onChange={(e) => setSelectedTopic(e.target.value)}
      >
        <option value="">Choose topic</option>
        {topics.map((t) => (
          <option key={t.id} value={t.id}>
            {t.title}
          </option>
        ))}
      </select>

      <button
        onClick={startQuiz}
        className="mt-6 w-full bg-teal-600 text-white py-3 rounded-xl"
      >
        Start Quiz
      </button>
    </div>
  );
}
