"use client";

import { use, useEffect, useState } from "react";
import { supabase } from "@/src/lib/supabase";

export default function TeamRoom({ params }: any) {
  // ✅ Correct Next.js 16 params handling
  const { roomId } = use(params);

  const [room, setRoom] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchRoom() {
      const { data, error } = await supabase
        .from("team_rooms")
        .select("*")
        .eq("code", roomId)
        .single();

      if (!error) setRoom(data);
      setLoading(false);
    }

    fetchRoom();
  }, [roomId]);

  if (loading)
    return <p className="text-center mt-10 text-gray-500">Loading room...</p>;

  if (!room)
    return (
      <p className="text-center mt-10 text-red-500">
        Room not found. Invalid code.
      </p>
    );

  return (
    <main className="max-w-3xl mx-auto px-6 py-12">
      <h1 className="text-3xl font-bold text-center">Room Code: {room.code}</h1>

      <p className="text-center text-gray-700 mt-2">
        Host: {room.host_name}
      </p>

      <p className="text-center text-teal-600 font-bold mt-4">
        Status: {room.status}
      </p>

      <div className="mt-10 flex flex-col items-center gap-4">
        <button className="bg-teal-600 text-white px-6 py-3 rounded-lg shadow">
          Start Quiz
        </button>

        <button
          className="bg-gray-200 text-gray-700 px-6 py-3 rounded-lg shadow"
          onClick={() =>
            navigator.clipboard.writeText(
              `${window.location.origin}/team/room/${roomId}`
            )
          }
        >
          Copy Room Link
        </button>
      </div>
    </main>
  );
}
