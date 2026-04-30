'use client'

import type { SyntheticEvent } from 'react'

export type SampleArticle = {
  label: string
  url: string
}

type UrlAnalyzerFormProps = {
  url: string
  isLoading: boolean
  error: string | null
  sampleArticles?: SampleArticle[]
  analyzedUrl?: string | null
  wordCount?: number | null
  onUrlChange: (url: string) => void
  onSubmit: () => void | Promise<void>
  onSelectSample?: (url: string) => void
}

export const DEFAULT_SAMPLE_ARTICLES: SampleArticle[] = [
  {
    label: 'BBC News article',
    url: 'https://www.bbc.com/news/articles/c70vzj1nrddo',
  },
  {
    label: 'BBC News homepage',
    url: 'https://www.bbc.com/news',
  },
]

export default function UrlAnalyzerForm({
  url,
  isLoading,
  error,
  sampleArticles = DEFAULT_SAMPLE_ARTICLES,
  analyzedUrl,
  wordCount,
  onUrlChange,
  onSubmit,
  onSelectSample,
}: UrlAnalyzerFormProps) {
  const normalizedUrl = url.trim()
  const canSubmit = normalizedUrl.length > 0 && !isLoading

  const handleSubmit = (
    event: SyntheticEvent<HTMLFormElement, SubmitEvent>,
  ) => {
    event.preventDefault()

    if (!canSubmit) return

    void onSubmit()
  }

  const handleSampleClick = (sampleUrl: string) => {
    if (isLoading) return

    onUrlChange(sampleUrl)
    onSelectSample?.(sampleUrl)
  }

  return (
    <section
      aria-labelledby="article-analyzer-heading"
      className="pointer-events-auto w-full max-w-2xl rounded-3xl border border-white/15 bg-black/60 p-5 text-white shadow-2xl backdrop-blur-md"
    >
      <div className="space-y-2">
        <p className="text-sm font-medium uppercase tracking-[0.25em] text-cyan-200">
          3D Word Cloud
        </p>
        <h1 id="article-analyzer-heading" className="text-3xl font-semibold">
          Analyze a news article
        </h1>
        <p className="text-sm leading-6 text-zinc-300">
          Enter an article URL and the FastAPI backend will extract important
          words for the 3D visualization.
        </p>
      </div>

      <form className="mt-5 space-y-4" onSubmit={handleSubmit}>
        <div className="space-y-2">
          <label htmlFor="article-url" className="text-sm font-medium">
            Article URL
          </label>
          <input
            id="article-url"
            name="url"
            type="url"
            required
            inputMode="url"
            autoComplete="url"
            placeholder="https://www.example.com/news/article"
            value={url}
            disabled={isLoading}
            onChange={(event) => onUrlChange(event.target.value)}
            className="w-full rounded-2xl border border-white/15 bg-white/95 px-4 py-3 text-sm text-zinc-950 outline-none transition focus:border-cyan-300 focus:ring-4 focus:ring-cyan-300/20 disabled:cursor-not-allowed disabled:opacity-70"
          />
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <button
            type="submit"
            disabled={!canSubmit}
            className="rounded-2xl bg-cyan-300 px-5 py-3 text-sm font-semibold text-zinc-950 transition hover:bg-cyan-200 disabled:cursor-not-allowed disabled:bg-zinc-500 disabled:text-zinc-300"
          >
            {isLoading ? 'Analyzing...' : 'Analyze article'}
          </button>

          {analyzedUrl && wordCount ? (
            <p className="self-center text-sm text-zinc-300">
              Last analyzed {wordCount.toLocaleString()} words.
            </p>
          ) : null}
        </div>
      </form>

      {sampleArticles.length > 0 ? (
        <div className="mt-5 space-y-3">
          <p className="text-sm font-medium text-zinc-200">Sample links</p>
          <div className="flex flex-wrap gap-2">
            {sampleArticles.map((article) => (
              <button
                key={article.url}
                type="button"
                disabled={isLoading}
                onClick={() => handleSampleClick(article.url)}
                className="rounded-full border border-white/15 px-3 py-2 text-xs font-medium text-zinc-200 transition hover:border-cyan-300 hover:text-cyan-100 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {article.label}
              </button>
            ))}
          </div>
        </div>
      ) : null}

      {error ? (
        <p
          role="alert"
          className="mt-5 rounded-2xl border border-red-300/30 bg-red-500/15 px-4 py-3 text-sm text-red-100"
        >
          {error}
        </p>
      ) : null}
    </section>
  )
}
