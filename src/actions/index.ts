import { defineAction } from "astro:actions";
import { z } from "astro:schema";
import { turso } from "../turso";

const fileSizeMB: number = 10;
const fileSizeBytes: number = fileSizeMB * 1024 * 1024; // 10MB

export const server = {
  approveGif: defineAction({
    accept: "form",
    input: z.object({
      id: z.number(),
    }),
    handler: async ({ id }) => {
      const result = await turso().execute({
        sql: "UPDATE favourites SET published = true WHERE id = ? AND published = false",
        args: [id],
      });

      if (result.rowsAffected !== 1) {
        throw new Error("Failed to approve gif");
      }

      console.log("Gif approved successfully", id);

      return { success: true };
    },
  }),
  deleteGif: defineAction({
    accept: "form",
    input: z.object({
      id: z.number(),
    }),
    handler: async ({ id }) => {
      const row = await turso().execute({
        sql: "SELECT url FROM favourites WHERE id = ? AND published = 0",
        args: [id],
      });

      if (!row.rows.length) {
        throw new Error("Gif not found");
      }

      const url = row.rows[0].url as string;

      const cloudflare = await fetch(
        `https://api.gif.land/${url}`,
        {
          method: "DELETE",
          headers: {
            "X-Custom-Auth-Key": import.meta.env.CF_WORKER_API_TOKEN || "",
          },
        },
      );

      if (!cloudflare.ok) {
        throw new Error("Failed to delete file from Cloudflare R2");
      }

      const result = await turso().execute({
        sql: "DELETE FROM favourites WHERE id = ? AND published = 0",
        args: [id],
      });

      if (result.rowsAffected !== 1) {
        throw new Error("Failed to delete gif from DB");
      }

      console.log("Gif deleted successfully", id, url);

      return { success: true };
    },
  }),
  addGif: defineAction({
    accept: "form",
    input: z.object({
      file: z
        .instanceof(File)
        .refine(
          (file) =>
            ["image/png", "image/jpeg", "image/jpg", "image/gif"].includes(
              file.type,
            ),
          { message: "Invalid image file type" },
        )
        .refine((file) => file.size <= fileSizeBytes, {
          message: `File size should not exceed ${fileSizeMB}MB`,
        }),
      tags: z
        .string()
        .min(1)
        .max(100)
        .regex(/^[a-zA-Z0-9\s,]+$/),
      source: z
        .string()
        .min(1)
        .max(100)
        .regex(/^[a-zA-Z0-9\s]+$/),
      author: z
        .string()
        .min(1)
        .max(32)
        .regex(/^[a-zA-Z0-9\s]+$/),
      width: z.number().min(1).max(10000),
      height: z.number().min(1).max(10000),
    }),
    handler: async ({ file, tags, source, author, width, height }) => {
      const cloudflare = await fetch(
        `https://api.gif.land/${file.name.toLowerCase()}`,
        {
          method: "PUT",
          body: file,
          headers: {
            "X-Custom-Auth-Key": import.meta.env.CF_WORKER_API_TOKEN || "",
          },
        },
      );

      if (!cloudflare.ok) {
        throw new Error("Failed to upload file to Cloudflare R2");
      }

      const result = await turso().execute(
        `INSERT INTO favourites (created_at, url, author, tags, source, width, height) VALUES (datetime('now'), '${file.name}', '${author}', '${tags}', '${source}', ${width}, ${height});`,
      );

      if (result.rowsAffected !== 1) {
        throw new Error("Failed to add meta to Turso DB");
      }

      return {
        id: file.name,
      };
    },
  }),
};
