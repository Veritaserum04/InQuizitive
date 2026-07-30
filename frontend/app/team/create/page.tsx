"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function CreateRoomPage() {
  const [hostName, setHostName] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function createRoom() {
    if (hostName.trim().length === 0) {
      alert("Enter a name");
      return;
    }

    setLoading(true);

    const res = await fetch("/api/team/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ hostName }),   // ✅ FIXED
    });

    setLoading(false);

    const data = await res.json();

    if (data.error) {
      alert(data.error);
      return;
    }

    // Redirect to lobby
    router.push(`/team/room/${data.room.code}`);
  }

  return (
    <main className="min-h-screen flex flex-col items-center py-20">
      <h1 className="text-3xl font-bold">Create Team Quiz Room</h1>

      <input
        type="text"
        placeholder="Enter your name"
        onChange={(e) => setHostName(e.target.value)}
        className="mt-6 p-3 border rounded-lg w-64"
      />

      <button
        onClick={createRoom}
        disabled={loading}
        className="mt-4 bg-teal-600 text-white px-6 py-2 rounded-lg"
      >
        {loading ? "Creating..." : "Create Room"}
      </button>
    </main>
  );
}
