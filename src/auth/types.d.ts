interface Payload {
  email: string;
  userId: string;
  username: string;
  artistId?: number;
}

type TEnable2FA = {
  secret: string;
};
