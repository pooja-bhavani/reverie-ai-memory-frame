const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export type Photo = {
  id: number;
  url: string;
  caption: string;
  scene: string;
  mood: string;
  tags: string[];
  people: number;
  palette: string[];
  takenAt: string | null;
  favorite: boolean;
  score?: number;
};

export type Collection = {
  key: string;
  title: string;
  description: string;
  cover: string;
  count: number;
  photos: Photo[];
};

const OWNER = "me";

async function jget<T>(path: string): Promise<T> {
  const res = await fetch(`${API}${path}`);
  if (!res.ok) throw new Error(`GET ${path} failed`);
  return res.json();
}

export const api = {
  base: API,

  photos: () => jget<Photo[]>(`/api/photos?owner=${OWNER}`),

  collections: () => jget<Collection[]>(`/api/collections?owner=${OWNER}`),

  map: () => jget<(Photo & { x: number; y: number })[]>(`/api/map?owner=${OWNER}`),

  onThisDay: () => jget<Photo[]>(`/api/on-this-day?owner=${OWNER}`),

  feed: (mode: string, query = "") =>
    jget<Photo[]>(`/api/frame/feed?owner=${OWNER}&mode=${mode}&query=${encodeURIComponent(query)}`),

  search: async (query: string): Promise<Photo[]> => {
    const res = await fetch(`${API}/api/search`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query, owner: OWNER, limit: 30 }),
    });
    return res.json();
  },

  story: (id: number) => jget<{ story: string }>(`/api/frame/story/${id}`),

  // ?v busts any audio your browser cached from before the single-voice fix.
  narrateUrl: (id: number) => `${API}/api/narrate/${id}?v=ruth1`,

  ask: async (question: string): Promise<{ answer: string; photos: Photo[] }> => {
    const res = await fetch(`${API}/api/ask`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ question, owner: OWNER }),
    });
    return res.json();
  },

  reel: async (mode = "shuffle", query = ""): Promise<{ title: string; photos: (Photo & { line: string })[] }> => {
    const res = await fetch(`${API}/api/reel`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ owner: OWNER, mode, query, limit: 8 }),
    });
    return res.json();
  },

  favorite: (id: number) =>
    fetch(`${API}/api/photos/${id}/favorite`, { method: "POST" }).then((r) => r.json()),

  remove: (id: number) =>
    fetch(`${API}/api/photos/${id}`, { method: "DELETE" }).then((r) => r.json()),

  upload: async (file: File): Promise<Photo> => {
    const form = new FormData();
    form.append("file", file);
    form.append("owner", OWNER);
    const res = await fetch(`${API}/api/photos`, { method: "POST", body: form });
    if (!res.ok) throw new Error("upload failed");
    return res.json();
  },
};
