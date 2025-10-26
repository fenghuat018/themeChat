export type Profile = {
  nickname?: string | null;
  avatar_url?: string | null;
};

export type User = {
  id: number;
  username: string;
  email: string | null;
  profile?: Profile | null;
};

export type Room = {
  id: number;
  name: string;
  theme: string;
  is_public: boolean;
  created_at: string;
};

export type Message = {
  id: number;
  room: Room;
  sender: User;
  snippet: string;
  is_read: boolean;
  created_at: string;
};

export type OAuthProvider = {
  id: string;
  name: string;
  login_url: string;
};
