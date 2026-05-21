const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

/**
 * Submits a GitHub commit URL for AI analysis.
 * @param {string} commitUrl - Full GitHub commit URL
 * @returns {Promise<{data: object, cached: boolean}>} The review data object with cached flag
 * @throws {Error} With user-friendly message on failure
 */
export async function submitCommitForReview(commitUrl) {
  let response;

  try {
    response = await fetch(`${API_BASE_URL}/api/review`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ commitUrl }),
    });
  } catch (error) {
    throw new Error(
      'Unable to connect to the analysis service. Check your connection and try again.'
    );
  }

  let json;

  try {
    json = await response.json();
  } catch (error) {
    throw new Error('Received an unexpected response from the server.');
  }

  if (json.success) {
    return {
      data: json.data,
      cached: json.cached || false,
    };
  }

  throw new Error(json.error);
}
