import "./globals.css";
import Link from "next/link";

export const metadata = {
  title: "Inquizitive",
  description: "AI-powered quiz, revision, and team battle platform",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gradient-to-b from-white to-teal-50 dark:from-gray-900 dark:to-gray-950 text-gray-900 dark:text-gray-200">

        {/* NAVBAR */}
        <nav className="w-full bg-white/70 dark:bg-gray-900/50 backdrop-blur-md border-b border-gray-200 dark:border-gray-700 shadow-sm sticky top-0 z-50">
          <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">

            {/* Brand */}
            <Link href="/" className="text-2xl font-black text-teal-600 dark:text-teal-400 tracking-tight">
              Inquizitive
            </Link>

            {/* Desktop Menu */}
            <div className="hidden md:flex gap-6 text-gray-700 dark:text-gray-300 font-medium">
              <Link className="hover:text-teal-600 dark:hover:text-teal-400 transition" href="/">
                Home
              </Link>

              <Link className="hover:text-teal-600 dark:hover:text-teal-400 transition" href="/dashboard">
                Dashboard
              </Link>

              <Link className="hover:text-teal-600 dark:hover:text-teal-400 transition" href="/topics">
                Topics
              </Link>

              <Link className="hover:text-teal-600 dark:hover:text-teal-400 transition" href="/revise">
                Revise
              </Link>

              <Link className="hover:text-teal-600 dark:hover:text-teal-400 transition" href="/team">
                Team Mode
              </Link>

              <Link className="hover:text-teal-600 dark:hover:text-teal-400 transition" href="/generate">
                Generate
              </Link>

              <Link className="hover:text-teal-600 dark:hover:text-teal-400 transition font-semibold" href="/login">
                Login
              </Link>
            </div>

            {/* Mobile Menu Placeholder — optional */}
            <div className="md:hidden text-gray-700 dark:text-gray-300">
              {/* later we can add a hamburger menu here */}
              ☰
            </div>
          </div>
        </nav>

        {/* Content */}
        <main className="max-w-6xl mx-auto px-6 py-10">{children}</main>

      </body>
    </html>
  );
}
