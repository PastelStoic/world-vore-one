import { createDefine } from "fresh";
import type { SessionUser } from "./lib/auth.ts";

// This specifies the type of "ctx.state" which is used to share
// data among middlewares, layouts and routes.
export interface State {
  shared: string;
  user: SessionUser | null;
}

export const define = createDefine<State>();
