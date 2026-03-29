export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

/**
 * Helper wrapper around fetch that includes credentials for session auth.
 * Also handles CSRF token from cookies.
 */
export async function apiFetch(path: string, options: RequestInit = {}): Promise<Response> {
  const url = path.startsWith('http') ? path : `${API_BASE_URL}${path}`;
  
  // Get CSRF token from cookies
  const csrfToken = document.cookie
    .split('; ')
    .find(row => row.startsWith('csrftoken='))
    ?.split('=')[1];

  const headers: Record<string, string> = {
    ...(options.headers as Record<string, string> || {}),
  };

  // Add CSRF token for non-GET requests
  if (csrfToken && options.method && options.method !== 'GET') {
    headers['X-CSRFToken'] = csrfToken;
  }

  // Add Content-Type if body is present and not FormData
  if (options.body && !(options.body instanceof FormData)) {
    headers['Content-Type'] = headers['Content-Type'] || 'application/json';
  }

  return fetch(url, {
    ...options,
    headers,
    credentials: 'include',
  });
}
