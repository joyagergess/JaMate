// src/utils/media.ts
export function buildMediaUrl(path?: string | null) {
  if (!path) return null;
  return `${process.env.EXPO_PUBLIC_API_URL}/storage/${path}`;
}
