This is a [Next.js](https://nextjs.org/) project that comes with Prisma and Tailwind already setup.

It has cookie-based auth already setup and has a `Notes` resource as an example of a private localized resource for a given user. One user has many notes and only that user can see and change their notes.

## Getting Started

Install node and dependencies with
```bash
bin/setup
```

If you have `asdf-vm` that will take care of setting the node version for you.

Then, run the development server:

```bash
bin/server
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `src/pages/index.js`. The page auto-updates as you edit the file.

[API routes](https://nextjs.org/docs/api-routes/introduction) can be accessed on [http://localhost:3000/api/](http://localhost:3000/api). This endpoints can be edited in `src/pages/api`.

The `src/pages/api` directory is mapped to `/api/*`. Files in this directory are treated as [API routes](https://nextjs.org/docs/api-routes/introduction) instead of React pages.

## Environment

This project start requires two environment variables to work. `DATABASE_URL` and `SECRET_KEY`

`DATABASE_URL` should be a URL postgres database, either local or not.
`SECRET_KEY` is the encryption key used by `bcrypt` for users passwords.

## Deploy

This project is ready for deployment on Heroku. Just create a Heroku project and point it to your git repo. Only requirement is setting the `SECRET_KEY` environment variable. If you add the Postgresql addon that will take care of the `DATABASE_URL`

You can also deploy it on Vercel, as long you setup your Postgresql database somewhere else. I recommend Heroku for now as the round trip times from Vercel to a regular SQL database are a bit big. Also connection management is a issue right now. Stateless functions don't deal well it that. If you want to use Vercel, I'd recommend swaping out Prisma+SQL with FaunaDB for example.

Check out [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.
