import "express-session";

declare module "express-session" {
  interface SessionData {
    userId?: string;
    username?: string;
    avatar?: string | null;
    hasAccess?: boolean;
  }
}
