"use client";

import { useState } from "react";
import { supabase } from "@/src/lib/supabase";
import { useRouter } from "next/navigation";

export default function JoinRoom() {
  const [roomCode, setRoomCode] = useState("");
  const [playerName, setPlayerName] = useState("");
  const [team, setTeam] = useState("A");
  const router = useRouter();

  async function join() {
    await supabase.from("team_players").insert({
      room_code: roomCode,
      name: playerName,
      team
    });

    router.push(`/team/room/${roomCode}`);
  }

  return (
    <div className="mt-20 max-w-xl mx-auto text-center">
      <h1 className="text-3xl font-bold">Join a Room</h1>

      <input
        className="mt-6 w-full p-3 border rounded-lg"
        placeholder="Room Code"
        onChange={(e) => setRoomCode(e.target.value)}
      />

      <input
        className="mt-4 w-full p-3 border rounded-lg"
        placeholder="Your Name"
        onChange={(e) => setPlayerName(e.target.value)}
      />

      <select
        className="mt-4 w-full p-3 border rounded-lg"
        onChange={(e) => setTeam(e.target.value)}
      >
        <option value="A">Team A</option>
        <option value="B">Team B</option>
      </select>

      <button
        onClick={join}
        className="mt-6 px-6 py-3 bg-teal-600 text-white rounded-xl shadow hover:bg-teal-700"
      >
        Join Room
      </button>
    </div>
  );
}
