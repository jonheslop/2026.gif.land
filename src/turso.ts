import { createClient } from "@libsql/client/web";
import { type Row } from "@libsql/client";
import { ENV } from 'varlock/env';

export const turso = (
  config = {
    url: ENV.TURSO_DATABASE_URL ?? process.env.TURSO_DATABASE_URL,
    authToken: ENV.TURSO_AUTH_TOKEN ?? process.env.TURSO_AUTH_TOKEN,
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
