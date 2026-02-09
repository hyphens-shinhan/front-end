/**
 * Recommended content service – fetches from same API as hyphens-frontend.
 */

export interface RecommendedContent {
  id: string;
  title: string;
  description?: string;
  category?: string;
  youtube_video_id: string;
  display_order: number;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000/api/v1';

/**
 * Get active recommended contents (same endpoint as hyphens-frontend).
 */
export async function getRecommendedContents(
  limit?: number
): Promise<RecommendedContent[]> {
  let url = `${API_BASE}/recommended-contents`;
  if (limit) {
    url += `?limit=${limit}`;
  }

  const response = await fetch(url, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  });

  if (!response.ok) {
    if (response.status === 404) {
      return [];
    }
    const errorText = await response.text();
    let message = `Failed to fetch recommended contents: ${response.status}`;
    try {
      const data = JSON.parse(errorText);
      message = data.detail ?? message;
    } catch {
      if (errorText) message += ` - ${errorText}`;
    }
    throw new Error(message);
  }

  const data = await response.json();
  return data ?? [];
}
