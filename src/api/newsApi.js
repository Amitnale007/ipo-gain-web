const API_URL = import.meta.env.VITE_API_URL;

export async function getNewsAnalysis({ date, stock, limit } = {}) {
  const params = new URLSearchParams();
  if (date) params.append('date', date);
  if (stock) params.append('stock', stock);
  if (limit) params.append('limit', limit);

  const query = params.toString() ? `?${params.toString()}` : '';
  const response = await fetch(`${API_URL}/api/news-analysis${query}`);
  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || 'Failed to fetch news analysis');
  }

  return result;
}

export async function getNewsAnalysisDates() {
  const response = await fetch(`${API_URL}/api/news-analysis/dates`);
  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || 'Failed to fetch analysis dates');
  }

  return result;
}

export async function saveNewsAnalysis(payload) {
  const response = await fetch(`${API_URL}/api/news-analysis`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || 'Failed to save news analysis');
  }

  return result;
}

