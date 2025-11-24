import { createClient } from "@libsql/client/web";
import { type Row } from "@libsql/client";

export const turso = createClient({
  url:
    import.meta.env.TURSO_DATABASE_URL ??
    "libsql://bukkit-jonheslop.aws-us-east-1.turso.io",
  authToken: import.meta.env.TURSO_AUTH_TOKEN ?? process.env.TURSO_AUTH_TOKEN,
});

export type Fave = Row & {
  id: number;
  created_at: string;
  url: string;
  author: string;
  tags: string;
  width: number;
  height: number;
  Source: string;
};
