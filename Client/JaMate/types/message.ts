type Message =
  | {
      id: number;
      type: "text";
      body: string;
      sent_at: string;
      sender_profile_id: number;
    }
  | {
      id: number;
      type: "track";
      sent_at: string;
      sender_profile_id: number;
      track: {
        id: number;
        title: string;
        duration: number;
        audio_public_url: string;
        track_type: string;
      };
    };
