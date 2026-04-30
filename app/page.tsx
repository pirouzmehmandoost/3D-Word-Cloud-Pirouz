'use client'

import { useState } from 'react'
import Link from 'next/link'
import SceneCanvas from '@r3f/canvas/SceneCanvas'
import UrlAnalyzerForm from '@ui/UrlAnalyzerForm'
import { analyzeArticle } from './lib/api'
import type { AnalyzeResponse } from './lib/types'

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
    <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex flex-1 w-full max-w-3xl flex-col items-center justify-between py-32 px-16 bg-white dark:bg-black sm:items-start">
        <div className="fixed inset-0 flex flex-col grow w-full h-full">
          <SceneCanvas words={analysis?.words ?? []} />
        </div>
        <div className="relative z-10 flex min-h-screen w-full items-center justify-center px-6">
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
        <div className="z-100 flex flex-col text-base font-medium">
          <Link
            className="flex h-12 w-fit md:w-[158px] p-5 justify-center items-center cursor-pointer rounded-full border border-solid border-white/15 bg-black/60 text-white shadow-2xl backdrop-blur-md transition-colors hover:border-cyan-300"
            href="https://github.com/pirouzmehmandoost/3D-Word-Cloud-Pirouz"
            target="_blank"
            rel="noopener noreferrer"
          >
            Documentation
          </Link>
        </div>
      </main>
    </div>
  )
}
