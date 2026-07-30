"use client";

import { motion } from "framer-motion";
import Link from "next/link";

export default function Home() {
  return (
    <div className="relative min-h-screen overflow-hidden">

      {/* Floating Background Blobs */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.6 }}
        transition={{ duration: 1 }}
        className="absolute top-[-80px] left-[-80px] w-[350px] h-[350px] bg-teal-300 rounded-full blur-[120px] opacity-40"
      />

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.5 }}
        transition={{ duration: 1.3 }}
        className="absolute bottom-[-100px] right-[-100px] w-[400px] h-[400px] bg-blue-300 rounded-full blur-[130px] opacity-50"
      />

      {/* HERO SECTION */}
      <section className="relative flex flex-col items-center text-center pt-32 pb-28 px-6">

        <motion.span
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="px-5 py-2 bg-white/80 backdrop-blur-xl rounded-full border border-teal-200 shadow
                     text-teal-700 font-semibold"
        >
          ✨ AI-Powered Learning • Flashcards for memorisation • Instant Quizzes
        </motion.span>

        {/* TITLE */}
        <motion.h1
          initial={{ opacity: 0, y: -25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mt-6 text-6xl md:text-7xl font-extrabold text-teal-700"
        >
          Transform Learning  
          <br />
          Into an Adventure
        </motion.h1>

        {/* SUBTITLE */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="mt-6 text-xl md:text-2xl text-gray-600 max-w-2xl leading-relaxed"
        >
          Create quizzes from any topic or document.  
          AI-powered, beautifully designed, and made for students, educators, and teams.
        </motion.p>

        {/* CTA BUTTONS */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.7, duration: 0.6 }}
          className="mt-10 flex flex-col sm:flex-row gap-6"
        >
          <Link
            href="/topics"
            className="px-10 py-4 bg-teal-600 hover:bg-teal-700 text-white rounded-2xl 
                       text-lg font-semibold shadow-xl hover:scale-[1.05] transition-transform"
          >
            Start Learning
          </Link>

          <Link
            href="/generate"
            className="px-10 py-4 bg-white border-2 border-teal-300 hover:bg-teal-50 
                       text-teal-600 rounded-2xl text-lg font-semibold shadow-md
                       hover:scale-[1.05] transition-transform"
          >
            Generate Quiz
          </Link>
        </motion.div>

      </section>

      {/* FEATURES SECTION */}
      <section className="py-24 px-6 bg-white">
        <h2 className="text-center text-4xl font-bold text-teal-700">
          Why Choose Inquizitive?
        </h2>

        <div className="grid md:grid-cols-3 gap-14 max-w-6xl mx-auto mt-16">
          {[
            {
              title: "AI-Generated Quizzes",
              desc: "Upload notes or PDFs and instantly get smart, high-quality MCQs powered by AI.",
              icon: "🧠",
            },
            {
              title: "Flashcard Learning",
              desc: "Remember important concepts and memorize through Flashcards for better memory retention.",
              icon: "✨",

            },
            {
              title: "Gamified Learning",
              desc: "Earn points, track progress, and stay motivated through interactive quizzes.",
              icon: "🎮",
            },
          ].map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: i * 0.2 }}
              className="glass p-10 rounded-3xl shadow-xl hover:scale-[1.04] transition-transform"
            >
              <div className="text-5xl">{item.icon}</div>
              <h3 className="mt-6 text-2xl font-bold text-teal-700">{item.title}</h3>
              <p className="mt-3 text-gray-600">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA SECTION */}
      <section className="py-24 px-6 bg-gradient-to-r from-teal-500 to-teal-700 text-white text-center">
        <motion.h2
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="text-4xl md:text-5xl font-extrabold"
        >
          Ready to Level Up Your Learning?
        </motion.h2>

        <p className="mt-4 text-xl opacity-90">
          Start exploring topics or build your first AI-generated quiz today.
        </p>

        <Link
          href="/topics"
          className="inline-block mt-10 px-10 py-4 bg-white text-teal-700 
                     rounded-2xl text-lg font-bold shadow-xl hover:scale-[1.05]
                     transition-transform"
        >
          Explore Topics →
        </Link>
      </section>

      {/* FOOTER */}
      <footer className="py-6 text-center text-gray-500 text-sm">
        © {new Date().getFullYear()} Inquizitive — Learning made Interactive and Fun.
      </footer>
    </div>
  );
}
