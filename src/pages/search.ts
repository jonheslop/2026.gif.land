export const prerender = false;
import type { APIRoute } from "astro";

export const POST: APIRoute = async ({ request, redirect }) => {
  try {
    const data = await request.formData();
    // console.log(data);
    const search = data.get("search");
    return redirect(`/search/${search}`);
  } catch (error) {
    if (error instanceof Error) {
      console.error(error.message);
    }
  }
};
