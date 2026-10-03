let getTokenFn: (() => Promise<string | null>) | null = null;

export function setGetToken(fn: () => Promise<string | null>) {
  getTokenFn = fn;
}

export async function authFetch(url: string, options: RequestInit = {}) {
  const token = getTokenFn ? await getTokenFn() : null;

  const headers = new Headers(options.headers);

  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  return fetch(url, {
    ...options,
    headers,
  });
}
