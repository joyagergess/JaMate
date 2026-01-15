
export function buildImageUrl(path?: string | null) {

  return `${process.env.EXPO_PUBLIC_IMG_URL}/storage/${path}`;
}


export type MatchMedia = {
  id: number;
  type: "image" | "video";
  url: string;
  order: number;
};

export function getFirstImage(media?: MatchMedia[]) {
  return media
    ?.slice()
    .sort((a, b) => a.order - b.order)
    .find((m) => m.type === "image")
    ?.url;
}
