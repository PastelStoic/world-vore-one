import { createDefine } from "fresh";
import type { SessionUser } from "./lib/session_types.ts";

// This specifies the type of "ctx.state" which is used to share
// data among middlewares, layouts and routes.
export interface State {
  shared: string;
  user: SessionUser | null;
  isAdmin: boolean;
  /** Anti-spam: user has had a character approved (or was grandfathered). */
  isValidated: boolean;
}

export const define = createDefine<State>();
