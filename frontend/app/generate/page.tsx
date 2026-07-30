"use client";

import { useState } from "react";
import { motion } from "framer-motion";

export default function GenerateQuiz() {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [parsedText, setParsedText] = useState("");
  const [generating, setGenerating] = useState(false);
  const [questions, setQuestions] = useState<any[]>([]);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState("");

  // -------------------- UPLOAD --------------------
  async function handleUpload() {
    if (!file) return setError("Please choose a file first.");

    setError("");
    setUploading(true);

    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch("/api/parse-pdf", { method: "POST", body: formData });
    const data = await res.json();
    setUploading(false);

    if (data.error) return setError(data.error);

    setParsedText(data.text);
  }

  // -------------------- GENERATE QUIZ --------------------
  async function generateQuiz() {
    if (!parsedText) return setError("Upload and parse a file first.");

    setGenerating(true);

    const res = await fetch("/api/generate-quiz", {
      method: "POST",
      body: JSON.stringify({ text: parsedText }),
    });

    const data = await res.json();
    setGenerating(false);

    if (data.error) return setError(data.error);

    setQuestions(data.questions);
  }

  // -------------------- SAVE QUIZ --------------------
  async function saveQuiz() {
    setSaving(true);

    const res = await fetch("/api/quizzes/save", {
      method: "POST",
      body: JSON.stringify({
        title: file?.name || "Untitled Quiz",
        text: parsedText,
        questions,
      }),
    });

    const data = await res.json();
    setSaving(false);

    if (data.error) return setError(data.error);

    setSaveSuccess("Quiz saved successfully!");
  }

  return (
    <main className="flex flex-col items-center px-4 py-12">
      {/* HEADER */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="text-center max-w-2xl">
        <h1 className="text-4xl font-extrabold tracking-tight">Create Quiz from Document</h1>
        <p className="text-gray-600 mt-2">Upload a PDF, DOCX, PPTX, or TXT to generate quiz questions.</p>
      </motion.div>

      {/* UPLOAD BOX */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-2xl mt-10 p-10 border-2 border-dashed rounded-xl bg-white shadow"
      >
        <div className="flex flex-col items-center gap-4">
          <span className="material-symbols-outlined text-5xl text-teal-600">cloud_upload</span>

          <input
            type="file"
            accept=".pdf,.txt,.docx,.pptx"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
            className="hidden"
            id="fileInput"
          />

          <label
            htmlFor="fileInput"
            className="cursor-pointer px-6 py-3 bg-teal-600 text-white rounded-lg text-sm font-semibold hover:bg-teal-700 transition"
          >
            Choose File
          </label>

          {file && <p className="text-gray-700 text-sm">{file.name}</p>}

          {/* PARSE BUTTON – Solid & Visible */}
          <button
            onClick={handleUpload}
            disabled={!file || uploading}
            className={`
              w-full max-w-xs px-6 py-3 rounded-lg font-bold mt-3 
              ${uploading || !file ? "bg-gray-300 text-gray-600 cursor-not-allowed" : "bg-teal-600 text-white hover:bg-teal-700"}
            `}
          >
            {uploading ? "Parsing..." : "Parse Document"}
          </button>

          {error && <p className="text-red-500 text-sm">{error}</p>}
        </div>
      </motion.div>

      {/* GENERATE BUTTON – Solid & Visible */}
      {parsedText && (
        <motion.button
          initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          onClick={generateQuiz}
          disabled={generating}
          className={`
            mt-8 px-10 py-3 rounded-xl font-bold shadow 
            ${generating ? "bg-gray-300 text-gray-600 cursor-not-allowed" : "bg-indigo-600 text-white hover:bg-indigo-700"}
          `}
        >
          {generating ? "Generating Quiz..." : "Generate Quiz"}
        </motion.button>
      )}

      {/* QUIZ OUTPUT */}
      {questions.length > 0 && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="w-full max-w-3xl mt-12 bg-white p-6 rounded-xl shadow">
          <h2 className="text-2xl font-bold mb-4">Generated Quiz</h2>

          <div className="space-y-6">
            {questions.map((q, i) => (
              <div key={i} className="p-4 bg-gray-50 rounded-lg shadow">
                <p className="font-semibold">{i + 1}. {q.question}</p>

                <ul className="list-disc ml-6 text-gray-700">
                  {q.options.map((o: string, j: number) => (
                    <li key={j}>{o}</li>
                  ))}
                </ul>

                <p className="mt-2 font-semibold text-green-700">Answer: {q.answer}</p>
              </div>
            ))}
          </div>

          {/* SAVE BUTTON – Solid & Visible */}
          <button
            onClick={saveQuiz}
            disabled={saving}
            className={`
              w-full mt-8 px-10 py-3 rounded-xl font-bold shadow 
              ${saving ? "bg-gray-300 text-gray-600 cursor-not-allowed" : "bg-purple-600 text-white hover:bg-purple-700"}
            `}
          >
            {saving ? "Saving..." : "Save Quiz"}
          </button>

          {saveSuccess && <p className="text-green-600 font-semibold mt-4">{saveSuccess}</p>}
        </motion.div>
      )}
    </main>
  );
}
