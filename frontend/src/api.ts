const BASE = `${import.meta.env.VITE_API_BASE || 'http://localhost:5000'}/api`;

const headers = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

const handleResponse = async (r: Response) => {
  if (r.status === 401) {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.hash = '';
    window.location.reload();
  }
  return r.json();
};

export const api = {
  get:       (path: string) =>
    fetch(`${BASE}${path}`, { headers: headers() }).then(handleResponse),
  post:      (path: string, body: unknown) =>
    fetch(`${BASE}${path}`, { method: 'POST',   headers: headers(), body: JSON.stringify(body) }).then(handleResponse),
  patch:     (path: string) =>
    fetch(`${BASE}${path}`, { method: 'PATCH',  headers: headers() }).then(handleResponse),
  patchBody: (path: string, body: unknown) =>
    fetch(`${BASE}${path}`, { method: 'PATCH',  headers: headers(), body: JSON.stringify(body) }).then(handleResponse),
  put:       (path: string, body: unknown) =>
    fetch(`${BASE}${path}`, { method: 'PUT',    headers: headers(), body: JSON.stringify(body) }).then(handleResponse),
  del:       (path: string) =>
    fetch(`${BASE}${path}`, { method: 'DELETE', headers: headers() }).then(handleResponse),
};
