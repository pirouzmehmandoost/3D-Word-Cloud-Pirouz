export type WordWeight = {
  word: string
  weight: number
}
export type AnalyzeResponse = {
  url: string
  word_count: number
  words: WordWeight[]
}
