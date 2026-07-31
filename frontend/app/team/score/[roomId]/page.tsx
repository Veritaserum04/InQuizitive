"use client";

import { use, useEffect, useState } from "react";
import { supabase } from "@/src/lib/supabase";

type PageProps = {
  params: Promise<{
    roomId: string;
  }>;
};

type Player = {
  id: string;
  name: string;
  score: number;
};

export default function TeamScorePage({ params }: PageProps) {
  const { roomId } = use(params);

  const [players, setPlayers] = useState<Player[]>([]);

  useEffect(() => {
    async function load() {
      const { data } = await supabase
        .from("team_players")
        .select("*")
        .eq("room_id", roomId)
        .order("score", { ascending: false });

      setPlayers(data ?? []);
    }

    load();

    const channel = supabase
      .channel(`score-${roomId}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "team_players",
        },
        load
      )
      .subscribe();

    return () => {
      void supabase.removeChannel(channel);
    };
  }, [roomId]);

  return (
    <main className="p-10 max-w-xl mx-auto text-center">
      <h1 className="text-3xl font-bold text-teal-600">
        Final Scores
      </h1>

      <ul className="mt-8 space-y-3">
        {players.map((p, i) => (
          <li
            key={p.id}
            className="px-4 py-3 bg-gray-100 rounded-xl flex justify-between shadow"
          >
            <span>
              {i + 1}. {p.name}
            </span>
            <span className="font-bold">{p.score}</span>
          </li>
        ))}
      </ul>
    </main>
  );
}