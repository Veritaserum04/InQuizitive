"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
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

interface ScoreRow {
  id: number;
  session_code: string;
  team_name: string;
  score: number;
}

export default function HostRoomPage() {
  const params = useParams<{ code: string }>();
  const roomCode = (params.code as string) || "";

  const [topicTitle, setTopicTitle] = useState("");
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [scores, setScores] = useState<ScoreRow[]>([]);
  const [channel, setChannel] = useState<any>(null);
  const [finished, setFinished] = useState(false);

  // Load session + questions
  useEffect(() => {
    async function loadSessionAndQuestions() {
      const { data: session, error: sessionError } = await supabase
        .from("team_sessions")
        .select("topic_id, code, topics ( title )")
        .eq("code", roomCode)
        .single();

      if (sessionError || !session) {
        console.error(sessionError);
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
        return;
      }

      setQuestions(qs || []);
    }

    if (roomCode) loadSessionAndQuestions();
  }, [roomCode]);

  // Load scores from DB
  async function loadScores() {
    const { data, error } = await supabase
      .from("team_scores")
      .select("*")
      .eq("session_code", roomCode)
      .order("score", { ascending: false });

    if (error) {
      console.error(error);
      return;
    }

    setScores(data || []);
  }

  // Setup realtime channel
  useEffect(() => {
    if (!roomCode) return;

    const ch = supabase.channel(`team-room-${roomCode}`);

    ch.on("broadcast", { event: "SCORE_UPDATE" }, () => {
      loadScores();
    });

    ch.subscribe((status) => {
      if (status === "SUBSCRIBED") {
        console.log("Host subscribed to realtime channel");
        loadScores();
      }
    });

    setChannel(ch);

    return () => {
      ch.unsubscribe();
    };
  }, [roomCode]);

  function handleNextQuestion() {
    if (!questions.length) return;

    const nextIndex = currentIndex + 1;

    if (nextIndex >= questions.length) {
      setFinished(true);
      if (channel) {
        channel.send({
          type: "broadcast",
          event: "QUIZ_FINISHED",
          payload: {},
        });
      }
      return;
    }

    setCurrentIndex(nextIndex);

    if (channel) {
      channel.send({
        type: "broadcast",
        event: "NEXT_QUESTION",
        payload: { index: nextIndex },
      });
    }
  }

  const currentQuestion = questions[currentIndex];

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 text-white px-6 py-10 flex justify-center">
      <div className="w-full max-w-5xl flex flex-col gap-10">
        {/* Top header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-black tracking-tight">
              Team Host Panel
            </h1>
            <p className="text-slate-300 mt-2">
              Room code:{" "}
              <span className="font-mono font-bold text-teal-300">
                {roomCode}
              </span>
              {topicTitle && (
                <>
                  {" "}
                  • Topic:{" "}
                  <span className="font-semibold text-teal-200">
                    {topicTitle}
                  </span>
                </>
              )}
            </p>
          </div>

          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className="px-4 py-2 rounded-full bg-teal-500/10 border border-teal-400/40 text-sm flex items-center gap-2 self-start md:self-auto"
          >
            <span className="inline-block h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Live session running</span>
          </motion.div>
        </div>

        {/* Main layout: question + scoreboard */}
        <div className="grid md:grid-cols-3 gap-8 items-start">
          {/* Question panel */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
              className="md:col-span-2 bg-slate-900/70 border border-slate-700 rounded-3xl p-7 shadow-2xl relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(45,212,191,0.18),_transparent_55%)] pointer-events-none" />
              <div className="relative">
                {!finished && currentQuestion ? (
                  <>
                    <p className="text-sm text-slate-400 mb-2">
                      Question {currentIndex + 1} of {questions.length}
                    </p>
                    <h2 className="text-2xl font-bold mb-4">
                      {currentQuestion.question}
                    </h2>
                    <ul className="space-y-3 text-slate-200 text-sm">
                      <li>① {currentQuestion.option_a}</li>
                      <li>② {currentQuestion.option_b}</li>
                      <li>③ {currentQuestion.option_c}</li>
                      <li>④ {currentQuestion.option_d}</li>
                    </ul>
                    <motion.button
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.96 }}
                      onClick={handleNextQuestion}
                      className="mt-8 inline-flex items-center justify-center px-6 py-3 rounded-xl bg-teal-500 text-white font-semibold shadow-md hover:bg-teal-400"
                    >
                      Next Question →
                    </motion.button>
                  </>
                ) : (
                  <div className="text-center py-16">
                    <h2 className="text-3xl font-bold mb-3">
                      Quiz Finished 🎉
                    </h2>
                    <p className="text-slate-300">
                      Show the final leaderboard on the right and celebrate the
                      winning team!
                    </p>
                  </div>
                )}
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Scoreboard */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="relative"
          >
            <div className="absolute inset-0 bg-gradient-to-b from-teal-500/20 to-sky-500/10 blur-2xl rounded-3xl pointer-events-none" />
            <div className="relative bg-slate-900/80 border border-slate-700 rounded-3xl p-6 shadow-2xl">
              <h3 className="text-xl font-bold mb-4 flex items-center justify-between">
                Live Scoreboard
                <span className="text-xs font-medium text-slate-400">
                  updates in real-time
                </span>
              </h3>
              {scores.length === 0 ? (
                <p className="text-slate-400 text-sm">
                  Waiting for teams to join and answer…
                </p>
              ) : (
                <div className="space-y-2">
                  {scores.map((team, index) => (
                    <motion.div
                      key={team.id}
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.2, delay: index * 0.05 }}
                      className="flex items-center justify-between bg-slate-800/80 rounded-xl px-3 py-2"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-sm w-6 h-6 flex items-center justify-center rounded-full bg-slate-700 text-slate-200 font-semibold">
                          {index + 1}
                        </span>
                        <span className="text-sm font-medium">
                          {team.team_name}
                        </span>
                      </div>
                      <span className="text-sm font-semibold text-teal-300">
                        {team.score} pts
                      </span>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </main>
  );
}
