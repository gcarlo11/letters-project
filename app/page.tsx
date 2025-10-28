"use client"

import Link from "next/link"
import { useState } from "react"

export default function HomePage() {
  const [hoveredCard, setHoveredCard] = useState<number | null>(null)

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Navbar */}
      <nav className="flex items-center justify-between px-8 py-6 border-b border-muted">
        <div className="font-caveat text-3xl font-bold text-foreground">lettersforme</div>
        <div className="flex gap-8 items-center">
          <Link
            href="#create"
            className="text-sm font-medium text-foreground hover:text-muted-foreground transition-all duration-300 ease-out"
          >
            Create
          </Link>
          <Link
            href="#about"
            className="text-sm font-medium text-foreground hover:text-muted-foreground transition-all duration-300 ease-out"
          >
            About
          </Link>
          <Link
            href="#support"
            className="text-sm font-medium text-foreground hover:text-muted-foreground transition-all duration-300 ease-out"
          >
            Support
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="flex-1 flex flex-col items-center justify-center px-8 py-20 text-center">
        <h1 className="font-caveat text-6xl md:text-7xl font-bold text-foreground mb-6 leading-tight text-balance">
          a bunch of the unsent words, shared through letters.
        </h1>
        <p className="text-lg text-muted-foreground mb-12 max-w-2xl text-balance">
          Write heartfelt letters and share them with a song.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 mb-20">
          <Link
            href="/create"
            className="px-8 py-3 bg-foreground text-primary-foreground rounded-2xl font-medium hover:shadow-lg transition-all duration-300 ease-out shadow-sm"
          >
            Create Your Letter
          </Link>
          <Link
            href="/browse"
            className="px-8 py-3 border-2 border-foreground text-foreground rounded-2xl font-medium hover:bg-secondary transition-all duration-300 ease-out"
          >
            Browse the Letters
          </Link>
        </div>
      </section>

      {/* Info Cards Section */}
      <section className="px-8 py-20 bg-secondary">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Card 1: Share Letters */}
            <div
              className="p-8 bg-white rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 ease-out cursor-pointer"
              onMouseEnter={() => setHoveredCard(0)}
              onMouseLeave={() => setHoveredCard(null)}
            >
              <div className="text-4xl mb-4">{hoveredCard === 0 ? "✍️" : "💌"}</div>
              <h3 className="font-caveat text-2xl font-bold text-foreground mb-3">Share Letters</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Write your heartfelt message and share it with a song.
              </p>
            </div>

            {/* Card 2: Browse Letters */}
            <div
              className="p-8 bg-white rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 ease-out cursor-pointer"
              onMouseEnter={() => setHoveredCard(1)}
              onMouseLeave={() => setHoveredCard(null)}
            >
              <div className="text-4xl mb-4">{hoveredCard === 1 ? "🔍" : "📖"}</div>
              <h3 className="font-caveat text-2xl font-bold text-foreground mb-3">Browse Letters</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">Find messages written for you or others.</p>
            </div>

            {/* Card 3: View Letters */}
            <div
              className="p-8 bg-white rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 ease-out cursor-pointer"
              onMouseEnter={() => setHoveredCard(2)}
              onMouseLeave={() => setHoveredCard(null)}
            >
              <div className="text-4xl mb-4">{hoveredCard === 2 ? "🎵" : "👁️"}</div>
              <h3 className="font-caveat text-2xl font-bold text-foreground mb-3">View Letters</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Open any letter to read it fully and listen to the song.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-8 py-8 border-t border-muted text-center text-sm text-muted-foreground">
        <p>Made with care. Share your unsent words.</p>
      </footer>
    </div>
  )
}
