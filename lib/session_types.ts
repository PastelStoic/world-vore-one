/** Client-safe session user shape (no server/DB imports). */

export interface SessionUser {
  id: string; // Discord user id
  username: string;
  avatar: string | null;
}
