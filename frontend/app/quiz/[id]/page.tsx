"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { supabase } from "@/src/lib/supabase";

interface Question {
  id: number;
  topic_id: string;
  question: string;
  option_a: string;
  option_b: string;
  option_c: string;
  option_d: string;
  // can be "A" | "B" | "C" | "D" or the actual option text
  answer: string;
}

export default function QuizPage() {
  // ✅ This is the correct way for a client component
  const params = useParams<{ id: string }>();
  const topicId = params?.id as string;

  const [loading, setLoading] = useState(true);
  const [topic, setTopic] = useState<any>(null);
  const [questions, setQuestions] = useState<Question[]>([]);

  // quiz state
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState<string | null>(null); // "A" | "B" | "C" | "D"
  const [showAnswer, setShowAnswer] = useState(false);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);

  useEffect(() => {
    if (!topicId) return;

    async function loadQuiz() {
      setLoading(true);

      // load topic
      const { data: topicData, error: topicError } = await supabase
        .from("topics")
        .select("*")
        .eq("id", topicId)
        .single();

      if (!topicError) setTopic(topicData);

      // load questions
      const { data: questionData, error: questionError } = await supabase
        .from("questions")
        .select("*")
        .eq("topic_id", topicId)
        .order("id", { ascending: true });

      if (!questionError) setQuestions((questionData || []) as Question[]);

      setLoading(false);
    }

    loadQuiz();
  }, [topicId]);

  if (loading) {
    return (
      <main className="max-w-3xl mx-auto py-12 text-center text-gray-500">
        Loading quiz…
      </main>
    );
  }

  if (!questions.length) {
    return (
      <main className="max-w-3xl mx-auto py-12 text-center text-gray-500">
        No questions found for this topic.
      </main>
    );
  }

  const q = questions[current];

  const options = [
    { key: "A", text: q.option_a },
    { key: "B", text: q.option_b },
    { key: "C", text: q.option_c },
    { key: "D", text: q.option_d },
  ];

  // handle both styles of "answer": letter ("A") or full text ("2 + 2 = 4")
  const correctKey =
    q.answer.length === 1 && "ABCD".includes(q.answer)
      ? q.answer
      : (["A", "B", "C", "D"][
          [q.option_a, q.option_b, q.option_c, q.option_d].indexOf(q.answer)
        ] ?? "A");

  function handleSubmit() {
    if (!selected) return;
    setShowAnswer(true);
    if (selected === correctKey) {
      setScore((prev) => prev + 1);
    }
  }

  function handleNext() {
    if (current + 1 >= questions.length) {
      setFinished(true);
      return;
    }
    setCurrent((prev) => prev + 1);
    setSelected(null);
    setShowAnswer(false);
  }

  return (
    <main className="max-w-3xl mx-auto py-12">
      {/* Title */}
      <h1 className="text-3xl font-bold text-center mb-8">
        {topic?.title ?? "Quiz"}
      </h1>

      {/* Finished state */}
      {finished ? (
        <div className="bg-white rounded-xl shadow-md border p-8 text-center">
          <h2 className="text-2xl font-bold mb-4">Quiz Completed!</h2>
          <p className="text-xl mb-2">
            Your score:{" "}
            <span className="text-teal-600 font-bold">
              {score}/{questions.length}
            </span>
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-md border p-6">
          {/* Progress */}
          <p className="text-sm text-gray-500 mb-4">
            Question {current + 1} of {questions.length}
          </p>

          {/* Question */}
          <p className="text-lg font-semibold mb-6">{q.question}</p>

          {/* Options */}
          <div className="space-y-3">
            {options.map((opt) => {
              const isCorrect = showAnswer && opt.key === correctKey;
              const isWrongSelection =
                showAnswer && selected === opt.key && opt.key !== correctKey;

              return (
                <button
                  key={opt.key}
                  onClick={() => !showAnswer && setSelected(opt.key)}
                  className={`
                    w-full text-left px-4 py-3 rounded-lg border transition
                    ${
                      selected === opt.key && !showAnswer
                        ? "border-teal-500 bg-teal-50"
                        : "border-gray-200 bg-gray-50"
                    }
                    ${isCorrect ? "border-green-500 bg-green-100" : ""}
                    ${isWrongSelection ? "border-red-500 bg-red-100" : ""}
                    hover:bg-gray-100
                  `}
                >
                  <span className="font-bold mr-1">{opt.key}.</span>
                  {opt.text}
                </button>
              );
            })}
          </div>

          {/* Submit / Next buttons */}
          {!showAnswer ? (
            <button
              onClick={handleSubmit}
              disabled={!selected}
              className="mt-6 w-full bg-teal-600 text-white py-3 rounded-lg font-semibold hover:bg-teal-700 disabled:bg-gray-300"
            >
              Submit Answer
            </button>
          ) : (
            <button
              onClick={handleNext}
              className="mt-6 w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700"
            >
              {current + 1 >= questions.length ? "Finish Quiz" : "Next Question"}
            </button>
          )}
        </div>
      )}
    </main>
  );
}
