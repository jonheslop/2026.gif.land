import { createClient } from "@libsql/client/web";
import { type Row } from "@libsql/client";

export const turso = (
  config = {
    url: import.meta.env.TURSO_DATABASE_URL ?? process.env.TURSO_DATABASE_URL,
    authToken: import.meta.env.TURSO_AUTH_TOKEN ?? process.env.TURSO_AUTH_TOKEN,
  },
) => createClient(config);

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
