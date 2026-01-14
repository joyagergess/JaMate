export type FeedProfile = {
  id: number;
  name: string;
  username: string;
  bio: string | null;
  location: string | null;
  gender: string;
  experience_level: string;

  instruments: { id: number; name: string }[];
  genres: { id: number; name: string }[];
  objectives: { id: number; name: string }[];

  media: {
    id: number;
    type: "image" | "video";
    url: string;
    order: number;
  }[];
};

export type FeedItem = {
  profile: FeedProfile;
  score: number;
};
