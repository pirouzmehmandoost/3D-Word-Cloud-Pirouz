'use client'

import { useState } from 'react'
import Link from 'next/link'
import SceneCanvas from '@r3f/canvas/SceneCanvas'
import UrlAnalyzerForm from '@ui/UrlAnalyzerForm'
import { analyzeArticle } from './lib/api'
import type { AnalyzeResponse, WordWeight } from './lib/types'

// Stable fallback so form-only state changes don't re-render the Canvas.
const EMPTY_WORDS: WordWeight[] = []

export default function Home() {
  const [url, setUrl] = useState('')
  const [analysis, setAnalysis] = useState<AnalyzeResponse | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleAnalyze = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const result = await analyzeArticle(url.trim())
      setAnalysis(result)
    } catch (error) {
      setError(
        error instanceof Error ? error.message : 'Failed to analyze article.',
      )
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <main className="flex flex-col min-h-screen items-center justify-center bg-black sm:items-start font-sans">
      <SceneCanvas words={analysis?.words ?? EMPTY_WORDS} />
      <div className="fixed inset-0 z-10 flex items-start justify-start p-4 sm:p-6 pointer-events-none">
        <UrlAnalyzerForm
          url={url}
          isLoading={isLoading}
          error={error}
          analyzedUrl={analysis?.url}
          wordCount={analysis?.word_count}
          onUrlChange={setUrl}
          onSubmit={handleAnalyze}
        />
      </div>
      <div className="fixed bottom-6 right-6 z-10">
        <Link
          className="flex h-12 p-5 font-medium items-center justify-center cursor-pointer rounded-full border border-solid border-white/15 bg-black/60 text-zinc-200 shadow-2xl backdrop-blur-md transition-colors hover:border-cyan-300 hover:text-cyan-100"
          href="https://github.com/pirouzmehmandoost/3D-Word-Cloud-Pirouz"
          target="_blank"
          rel="noopener noreferrer"
        >
          Documentation
        </Link>
      </div>
    </main>
  )
}
