"use client";

import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { supabase } from "@/src/lib/supabase";
import { motion, AnimatePresence } from "framer-motion";

interface Question {
  id: number;
  question: string;
  option_a: string;
  option_b: string;
  option_c: string;
  option_d: string;
  answer: string;
}

export default function TeamPlayPage() {
  const params = useParams<{ code: string }>();
  const search = useSearchParams();

  const roomCode = (params.code as string) || "";
  const teamName = decodeURIComponent(search.get("team") || "Team");

  const [questions, setQuestions] = useState<Question[]>([]);
  const [topicTitle, setTopicTitle] = useState("");
  const [questionIndex, setQuestionIndex] = useState(0);
  const [channel, setChannel] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [locked, setLocked] = useState(false);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [finished, setFinished] = useState(false);

  // Load session + all questions for the topic
  useEffect(() => {
    async function loadSessionAndQuestions() {
      const { data: session, error: sessionError } = await supabase
        .from("team_sessions")
        .select("topic_id, topics ( title )")
        .eq("code", roomCode)
        .single();

      if (sessionError || !session) {
        console.error(sessionError);
        setLoading(false);
        return;
      }

      if (session.topics?.title) {
        setTopicTitle(session.topics.title);
      }

      const { data: qs, error: qError } = await supabase
        .from("questions")
        .select("*")
        .eq("topic_id", session.topic_id)
        .order("id", { ascending: true });

      if (qError) {
        console.error(qError);
        setLoading(false);
        return;
      }

      setQuestions(qs || []);
      setLoading(false);
    }

    if (roomCode) loadSessionAndQuestions();
  }, [roomCode]);

  // Setup realtime channel to receive NEXT_QUESTION & QUIZ_FINISHED
  useEffect(() => {
    if (!roomCode) return;

    const ch = supabase.channel(`team-room-${roomCode}`);

    ch.on("broadcast", { event: "NEXT_QUESTION" }, (payload) => {
      const nextIndex = payload.payload.index as number;
      setQuestionIndex(nextIndex);
      setLocked(false);
      setSelectedOption(null);
      setFeedback(null);
    });

    ch.on("broadcast", { event: "QUIZ_FINISHED" }, () => {
      setFinished(true);
    });

    ch.subscribe((status) => {
      if (status === "SUBSCRIBED") {
        console.log("Team subscribed to realtime channel");
      }
    });

    setChannel(ch);

    return () => {
      ch.unsubscribe();
    };
  }, [roomCode]);

  async function handleAnswer(letter: "A" | "B" | "C" | "D") {
    if (locked || finished) return;
    const q = questions[questionIndex];
    if (!q) return;

    setLocked(true);
    setSelectedOption(letter);

    const chosen =
      letter === "A"
        ? q.option_a
        : letter === "B"
        ? q.option_b
        : letter === "C"
        ? q.option_c
        : q.option_d;

    const isCorrect = chosen === q.answer;
    setFeedback(isCorrect ? "Correct!" : "Incorrect");

    // Update score in Supabase (simple approach)
    const { data: existing, error: existingError } = await supabase
      .from("team_scores")
      .select("id, score")
      .eq("session_code", roomCode)
      .eq("team_name", teamName)
      .maybeSingle();

    if (existingError) {
      console.error(existingError);
    } else {
      if (!existing) {
        // new team row (should already exist but just in case)
        await supabase.from("team_scores").insert({
          session_code: roomCode,
          team_name: teamName,
          score: isCorrect ? 1 : 0,
        });
      } else if (isCorrect) {
        await supabase
          .from("team_scores")
          .update({ score: (existing.score || 0) + 1 })
          .eq("id", existing.id);
      }
    }

    // Notify host to reload scoreboard
    if (channel) {
      channel.send({
        type: "broadcast",
        event: "SCORE_UPDATE",
        payload: {},
      });
    }
  }

  const q = questions[questionIndex];

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 text-white px-6 py-10 flex justify-center">
      <div className="w-full max-w-3xl">
        <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-8">
          <div>
            <h1 className="text-2xl md:text-3xl font-black tracking-tight">
              Team Mode
            </h1>
            <p className="text-slate-300 text-sm mt-1">
              Room:{" "}
              <span className="font-mono text-teal-300">{roomCode}</span> • Team:{" "}
              <span className="font-semibold text-teal-200">{teamName}</span>
              {topicTitle && (
                <>
                  {" "}
                  • Topic:{" "}
                  <span className="font-semibold text-sky-200">
                    {topicTitle}
                  </span>
                </>
              )}
            </p>
          </div>
        </header>

        {loading ? (
          <p className="text-slate-300 mt-10">Loading session…</p>
        ) : finished ? (
          <div className="mt-16 text-center">
            <h2 className="text-3xl font-bold mb-3">Quiz Finished 🎉</h2>
            <p className="text-slate-300">
              Check the host screen to see the final leaderboard.
            </p>
          </div>
        ) : !q ? (
          <div className="mt-16 text-center">
            <p className="text-slate-300">
              Waiting for the host to start the quiz...
            </p>
          </div>
        ) : (
          <AnimatePresence mode="wait">
            <motion.div
              key={questionIndex}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.25 }}
              className="bg-slate-900/80 border border-slate-700 rounded-3xl p-7 shadow-2xl relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(56,189,248,0.32),_transparent_55%)] pointer-events-none" />
              <div className="relative">
                <p className="text-xs text-slate-400 mb-2">
                  Question {questionIndex + 1} of {questions.length}
                </p>
                <h2 className="text-xl md:text-2xl font-bold mb-6">
                  {q.question}
                </h2>

                <div className="space-y-3">
                  {(["A", "B", "C", "D"] as const).map((letter) => {
                    const text =
                      letter === "A"
                        ? q.option_a
                        : letter === "B"
                        ? q.option_b
                        : letter === "C"
                        ? q.option_c
                        : q.option_d;

                    const isSelected = selectedOption === letter;

                    return (
                      <motion.button
                        key={letter}
                        whileHover={!locked ? { scale: 1.02 } : {}}
                        whileTap={!locked ? { scale: 0.97 } : {}}
                        onClick={() => handleAnswer(letter)}
                        disabled={locked}
                        className={`w-full text-left px-4 py-3 rounded-2xl border text-sm md:text-base 
                          transition shadow-sm
                          ${
                            isSelected
                              ? "bg-teal-500 text-white border-teal-400"
                              : "bg-slate-800/80 border-slate-700 hover:bg-slate-700/80"
                          }
                          ${locked && !isSelected ? "opacity-70" : ""}
                        `}
                      >
                        <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-slate-700 text-xs font-semibold mr-3">
                          {letter}
                        </span>
                        {text}
                      </motion.button>
                    );
                  })}
                </div>

                {feedback && (
                  <motion.p
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`mt-4 text-sm font-semibold ${
                      feedback === "Correct!"
                        ? "text-emerald-400"
                        : "text-rose-400"
                    }`}
                  >
                    {feedback}
                  </motion.p>
                )}
              </div>
            </motion.div>
          </AnimatePresence>
        )}
      </div>
    </main>
  );
}
