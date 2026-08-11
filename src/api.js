// Cliente HTTP centralizado para Nexus.
// Todos los llamados a la API pasan por aquí: añade el header de auth,
// normaliza las respuestas y, si el token es inválido/expirado (401),
// limpia la sesión y redirige a /login para no dejar al usuario atascado.

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

function clearSession() {
  localStorage.removeItem('token');
  localStorage.removeItem('username');
  if (window.location.pathname !== '/login') {
    window.location.href = '/login';
  }
}

async function apiFetch(path, { method = 'GET', body, auth = true } = {}) {
  const headers = { 'Content-Type': 'application/json' };
  const token = localStorage.getItem('token');
  if (auth && token) {
    headers.Authorization = `Token ${token}`;
  }

  const response = await fetch(`${API_URL}${path}`, {
    method,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  if (response.status === 401) {
    clearSession();
  }

  return response;
}

// Helpers por método: get('/projects/'), post('/tasks/', {...}), patch(...), del(...)
export const get = (path, opts) => apiFetch(path, { ...opts, method: 'GET' });
export const post = (path, body, opts) => apiFetch(path, { ...opts, method: 'POST', body });
export const patch = (path, body, opts) => apiFetch(path, { ...opts, method: 'PATCH', body });
export const del = (path, opts) => apiFetch(path, { ...opts, method: 'DELETE' });

export default apiFetch;
