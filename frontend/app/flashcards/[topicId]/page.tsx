"use client";

import { use, useEffect, useState } from "react";
import { supabase } from "@/src/lib/supabase";

export default function FlashcardsPage({ params }: any) {
  // ✅ Next.js 16 — unwrap the Promise
  const { topicId } = use(params);

  const [cards, setCards] = useState<any[]>([]);
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [loading, setLoading] = useState(true);

  // Load flashcards
  useEffect(() => {
    async function fetchCards() {
      const { data, error } = await supabase
        .from("flashcards")
        .select("*")
        .eq("topic_id", topicId);

      if (!error && data) {
        setCards(data);
      }
      setLoading(false);
    }

    fetchCards();
  }, [topicId]);

  function nextCard() {
    setFlipped(false);
    setIndex((prev) => (prev + 1) % cards.length);
  }

  function prevCard() {
    setFlipped(false);
    setIndex((prev) => (prev - 1 + cards.length) % cards.length);
  }

  if (loading) {
    return <p className="text-center mt-20">Loading flashcards...</p>;
  }

  if (!cards.length) {
    return (
      <p className="text-center mt-20 text-red-500">
        No flashcards found for this topic.
      </p>
    );
  }

  const currentCard = cards[index];

  return (
    <main className="min-h-screen flex flex-col items-center px-6 py-16">

      <h1 className="text-3xl font-bold text-teal-700 mb-8">
        Flashcards
      </h1>

      {/* FLASHCARD */}
      {/* FLASHCARD */}
<div className="flashcard w-full max-w-md h-80 md:h-96" onClick={() => setFlipped(!flipped)}>
  <div className={`flashcard-inner ${flipped ? "rotate-y-180" : ""}`}>
    
    {/* FRONT */}
    <div className="
      flashcard-front absolute inset-0 flex items-center justify-center
      bg-teal-500 text-white text-xl font-semibold p-6 rounded-2xl shadow-xl
    ">
      {currentCard.front}
    </div>

    {/* BACK */}
    <div className="
      flashcard-back absolute inset-0 flex items-center justify-center
      bg-teal-600 text-white text-lg p-6 rounded-2xl shadow-xl
    ">
      {currentCard.back}
    </div>

  </div>
</div>


      {/* BUTTONS */}
      <div className="flex gap-6 mt-10">
        <button
          onClick={prevCard}
          className="px-6 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700"
        >
          Previous
        </button>

        <button
          onClick={nextCard}
          className="px-6 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700"
        >
          Next
        </button>
      </div>

      <p className="mt-4 text-gray-600">
        Card {index + 1} / {cards.length}
      </p>

    </main>
  );
}
