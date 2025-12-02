# gif.land

I love [bukk.it](https://bukk.it) ([thanks Ethan!](https://ethanmarcotte.com/)) but I always forget the filenames of my favourites, so I’ve made this to store my them with extra tags.

I can add new faves from the command line using [Turso’s CLI](https://docs.turso.tech/cli/db/shell):

```sh
  ❯ turso db shell gifland "INSERT INTO favourites (created_at, url, author, tags) VALUES (datetime('now'), 'theandies.gif', 'Jon Heslop', 'hot fuzz');"
```

I blogged about making it here https://jonheslop.com/posts/2025/gif-land and have since rebuilt it with Astro which [I mentioned here](https://jonheslop.com/posts/2025/ditching-vercel/).

## Todos

- A UI for adding new GIFs (would need to be behind auth that only allows me to do it)
- Allow submissions and build something so I can review them before publishing
- Add stickers
