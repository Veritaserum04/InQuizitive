"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/src/lib/supabase";
import { useParams } from "next/navigation";

export default function TeamRoom() {
  const { roomCode } = useParams();
  const [players, setPlayers] = useState([]);
  const [questionNumber, setQuestionNumber] = useState(1);
  const [question, setQuestion] = useState(null);
  const [selected, setSelected] = useState("");
  const [submitted, setSubmitted] = useState(false);

  // Load players real-time
  useEffect(() => {
    supabase
      .channel("players-" + roomCode)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "team_players", filter: `room_code=eq.${roomCode}` },
        () => fetchPlayers()
      )
      .subscribe();

    fetchPlayers();
  }, []);

  async function fetchPlayers() {
    const { data } = await supabase
      .from("team_players")
      .select("*")
      .eq("room_code", roomCode);

    setPlayers(data || []);
  }

  // Dummy question generator (hook up your actual questions later)
  const sampleQuestion = {
    q: "Which planet is known as the Red Planet?",
    a: ["Earth", "Mars", "Jupiter", "Saturn"],
    correct: "Mars",
  };

  useEffect(() => {
    setQuestion(sampleQuestion);
  }, [questionNumber]);

  async function submitAnswer() {
    if (!selected) return;

    await supabase.from("team_answers").insert({
      room_code: roomCode,
      player_id: "anonymous", // Replace with real user ID if auth added
      question_number: questionNumber,
      answer: selected,
      is_correct: selected === question.correct,
    });

    setSubmitted(true);
  }

  function nextQuestion() {
    setSubmitted(false);
    setSelected("");
    setQuestionNumber((prev) => prev + 1);
  }

  return (
    <div className="max-w-3xl mx-auto mt-12">
      <h1 className="text-3xl font-bold text-center">Room: {roomCode}</h1>

      <p className="mt-4 text-xl text-center">Waiting for players…</p>

      {/* Players List */}
      <div className="mt-6 bg-white p-4 rounded-xl shadow">
        <h2 className="text-lg font-bold mb-2">Players</h2>

        {players.map((p: any) => (
          <div key={p.id} className="flex justify-between p-2 border-b">
            <span>{p.name}</span>
            <span className="font-semibold text-teal-600">Team {p.team}</span>
          </div>
        ))}
      </div>

      {/* QUIZ */}
      {question && (
        <div className="mt-10 bg-white p-6 shadow rounded-xl">
          <h2 className="text-2xl font-bold">{question.q}</h2>

          <div className="mt-6 grid gap-4">
            {question.a.map((opt) => (
              <button
                key={opt}
                disabled={submitted}
                onClick={() => setSelected(opt)}
                className={`
                  p-3 rounded-lg border text-left 
                  ${selected === opt ? "bg-teal-600 text-white" : "bg-gray-100"}
                `}
              >
                {opt}
              </button>
            ))}
          </div>

          {!submitted ? (
            <button
              onClick={submitAnswer}
              className="mt-6 px-6 py-3 bg-teal-600 text-white rounded-xl shadow w-full"
            >
              Submit Answer
            </button>
          ) : (
            <button
              onClick={nextQuestion}
              className="mt-6 px-6 py-3 bg-purple-600 text-white rounded-xl shadow w-full"
            >
              Next Question
            </button>
          )}
        </div>
      )}

      {/* SCOREBOARD */}
      <div className="mt-10 bg-white p-6 rounded-xl shadow">
        <h2 className="text-xl font-bold mb-4">Live Scoreboard</h2>

        {players.map((p: any) => (
          <div key={p.id} className="flex justify-between p-2 border-b">
            <span>{p.name}</span>
            <span className="text-teal-700 font-bold">{p.score}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
