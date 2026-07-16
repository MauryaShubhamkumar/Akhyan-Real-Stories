const HISTORY_KEY = "akhyan_recent_searches";

export function saveSearch(query: string): void {
  const trimmed = query.trim();
  if (!trimmed) return;

  const history = getRecentSearches();

  const updated = [
    trimmed,
    ...history.filter((item) => item.toLowerCase() !== trimmed.toLowerCase()),
  ].slice(0, 5);

  localStorage.setItem(HISTORY_KEY, JSON.stringify(updated));
}

export function getRecentSearches(): string[] {
  try {
    const raw = localStorage.getItem(HISTORY_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function clearHistory(): void {
  localStorage.removeItem(HISTORY_KEY);
}
