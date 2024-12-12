import "express-session";

declare module "express-session" {
  interface SessionData {
    user: {
      uid: number;
      cid: number;
      email: string;
      username: string;
    };
  }
}