// DO NOT use for video
export function buildImageUrl(path?: string | null) {
  if (!path) return null;
  return `${process.env.EXPO_PUBLIC_API_URL}/storage/${path}`;
}
