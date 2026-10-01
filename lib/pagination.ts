/** Sliding window of up to `size` page numbers that moves with the current page — e.g. 4 5 [6] 7 8 */
export function pageRange(cur: number, total: number, size = 5): number[] {
  const count = Math.min(size, total)
  const start = Math.max(1, Math.min(cur - Math.floor(count / 2), total - count + 1))
  return Array.from({ length: count }, (_, i) => start + i)
}
