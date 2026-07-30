"use client";

import { useState } from "react";

export default function RandomTest() {
  const [questions, setQuestions] = useState<any[]>([]);
  const [started, setStarted] = useState(false);
  const [count, setCount] = useState(10);

  async function startTest() {
    const res = await fetch("/api/random-quiz", {
      method: "POST",
      body: JSON.stringify({ count }),
    });

    const data = await res.json();
    setQuestions(data.questions);
    setStarted(true);
  }

  return (
    <main className="min-h-screen px-6 py-12">
      <h1 className="text-4xl font-bold text-center">Random Test</h1>

      {!started && (
        <div className="max-w-md mx-auto mt-12 bg-white p-6 rounded-xl shadow">
          <label className="font-semibold">Select Question Count:</label>
          <select
            className="w-full p-2 border rounded mt-2"
            onChange={(e) => setCount(Number(e.target.value))}
          >
            <option value="10">10 Questions</option>
            <option value="20">20 Questions</option>
            <option value="50">50 Questions</option>
          </select>

          <button
            onClick={startTest}
            className="w-full mt-6 bg-primary text-white p-3 rounded-lg"
          >
            Start Test
          </button>
        </div>
      )}

      {started && questions.length > 0 && (
        <div className="max-w-3xl mx-auto mt-10">
          {questions.map((q, i) => (
            <div key={i} className="p-5 bg-white border rounded-lg mb-4 shadow">
              <p className="font-semibold">
                {i + 1}. {q.question}
              </p>

              <ul className="mt-2 space-y-1">
                <li>A. {q.option_a}</li>
                <li>B. {q.option_b}</li>
                <li>C. {q.option_c}</li>
                <li>D. {q.option_d}</li>
              </ul>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
