"use client";

import { use, useEffect, useState } from "react";
import { supabase } from "@/src/lib/supabase";

type PageProps = {
  params: Promise<{
    code: string;
  }>;
};

export default function LeaderboardPage({ params }: PageProps) {
  const { code: roomCode } = use(params);

  const [room, setRoom] = useState<any>(null);
  const [scores, setScores] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
  async function loadData() {
    // Load room
    const { data: roomData, error: roomError } = await supabase
      .from("rooms")
      .select("*")
      .eq("code", roomCode)
      .single();

    if (roomError || !roomData) {
      console.error(roomError);
      setLoading(false);
      return;
    }

    setRoom(roomData);

    // Load teams
    const { data: teamList } = await supabase
      .from("teams")
      .select("id, name")
      .eq("room_id", roomData.id);

    // Load answers
    const { data: answers } = await supabase
      .from("team_answers")
      .select("team_id, is_correct")
      .eq("room_id", roomData.id);

    const scoreMap: Record<string, number> = {};

    (answers ?? []).forEach((a: any) => {
      scoreMap[a.team_id] = (scoreMap[a.team_id] ?? 0) + (a.is_correct ? 1 : 0);
    });

    const teamScores = (teamList ?? []).map((t: any) => ({
      ...t,
      score: scoreMap[t.id] ?? 0,
    }));

    teamScores.sort((a: any, b: any) => b.score - a.score);

    setScores(teamScores);
    setLoading(false);
  }

  loadData();
}, [roomCode]);

  if (loading) {
    return <p className="text-center mt-20 text-lg">Loading leaderboard...</p>;
  }

  return (
    <div className="max-w-3xl mx-auto mt-16 text-center p-6">
      <h1 className="text-4xl font-bold mb-6">🏆 Final Leaderboard</h1>

      <h2 className="text-xl text-gray-600 mb-10">
        Room: <span className="font-semibold">{roomCode}</span>
      </h2>

      <div className="space-y-6">
        {scores.map((team: any, index: number) => (
          <div
            key={team.id}
            className={`p-5 rounded-xl shadow border 
              ${
                index === 0
                  ? "bg-yellow-200 border-yellow-500"
                  : index === 1
                  ? "bg-gray-200 border-gray-500"
                  : index === 2
                  ? "bg-orange-200 border-orange-500"
                  : "bg-white"
              }`}
          >
            <h3 className="text-2xl font-bold">{index + 1}. {team.name}</h3>
            <p className="text-lg mt-2">Score: {team.score}</p>
          </div>
        ))}
      </div>

      {/* Celebrate Winner */}
      <div className="mt-10">
        <button
          onClick={() => confettiCelebration()}
          className="px-6 py-3 bg-teal-600 text-white rounded-lg shadow"
        >
          🎉 Celebrate Winner
        </button>
      </div>
    </div>
  );
}

// Confetti
function confettiCelebration() {
  import("canvas-confetti").then((mod) => {
    const confetti = mod.default;
    confetti({
      particleCount: 200,
      spread: 100,
      origin: { y: 0.6 },
    });
  });
}
