export function calculateReadingTimeMinutes(markdown: string | undefined) {
  if (!markdown) {
    return 1
  }

  const wordCount = markdown.trim().split(/\s+/).filter(Boolean).length
  return Math.max(1, Math.ceil(wordCount / 220))
}