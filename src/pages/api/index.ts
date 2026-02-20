import { turso } from "../../turso";

export async function GET({}) {
  try {
    const { rows } = await turso().execute(
      "SELECT * FROM favourites WHERE published = true ORDER BY url ASC",
    );

    return new Response(JSON.stringify(rows), {
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    if (error instanceof Error) {
      console.error(error.message);
    }
  }
}
