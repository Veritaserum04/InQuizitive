"use client";

import { useState } from "react";

export default function JoinTeam({ params }) {
  const { roomCode } = params;

  const [username, setUsername] = useState("");
  const [teamName, setTeamName] = useState("");
  const [loading, setLoading] = useState(false);

  async function joinRoom() {
    setLoading(true);

    const res = await fetch("/api/team/room/join", {
      method: "POST",
      body: JSON.stringify({
        room_code: roomCode,
        user_name: username,
        team_name: teamName,
      }),
    });

    const data = await res.json();
    setLoading(false);

    if (data.error) {
      alert(data.error);
      return;
    }

    // Redirect to the team dashboard
    window.location.href = `/team/room/${roomCode}/team?team=${data.team_id}`;
  }

  return (
    <div className="p-10 max-w-lg mx-auto">
      <h1 className="text-3xl font-bold mb-4">
        Join Room {roomCode}
      </h1>

      <input
        placeholder="Your Name"
        className="border p-3 w-full mb-4"
        onChange={(e) => setUsername(e.target.value)}
      />

      <input
        placeholder="Team Name"
        className="border p-3 w-full mb-4"
        onChange={(e) => setTeamName(e.target.value)}
      />

      <button
        onClick={joinRoom}
        disabled={loading}
        className="bg-green-600 text-white px-6 py-3 rounded-md"
      >
        {loading ? "Joining..." : "Join"}
      </button>
    </div>
  );
}
