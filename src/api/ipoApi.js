const API_URL = import.meta.env.VITE_API_URL;

export async function getIPOAnalysis(date) {
  const response = await fetch(
    `${API_URL}/api/ipo?date=${encodeURIComponent(date)}`
  );

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || 'Failed to fetch IPO data');
  }

  return result;
}