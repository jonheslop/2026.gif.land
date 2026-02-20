import { turso } from "../../turso";

export async function GET({}) {
  try {
    const { rows } = await turso().execute(
      "SELECT * FROM favourites WHERE published = true ORDER BY url ASC",
    );

    return new Response(JSON.stringify(rows), {
      headers: {
        "Content-Type": "application/json",
        "Content-Disposition": "inline",
      },
    });
  } catch (error) {
    if (error instanceof Error) {
      console.error(error.message);
    }
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
        "Content-Disposition": "inline",
      },
    });
  }
}
