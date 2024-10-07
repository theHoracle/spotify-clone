interface Payload {
  email: string;
  userId: number;
  username: string;
  artistId?: number;
}

type TEnable2FA = {
  secret: string;
};
