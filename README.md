This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.js`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

---

## Steps to Connect to Supabase

1. **Install the Supabase JS client** in your project.
2. **Set up environment variables** for your Supabase URL and service role key.
3. **Initialize the Supabase client** in your API route files.
4. **Replace in-memory CRUD logic** with Supabase queries.

---

### 1. Install Supabase Client

You’ll need to install the Supabase JS client in your project:

```sh
cd dandi
npm install @supabase/supabase-js
```

---

### 2. Set Up Environment Variables

In your `dandi` directory, create a `.env.local` file (if you don’t have one) and add:

```
SUPABASE_URL=your-supabase-url
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

- You can find these in your Supabase project settings.
- **Use the service role key only in server-side code (API routes), never in the browser.**

---

### 3. Initialize Supabase Client

Create a helper file, e.g., `dandi/src/app/api/keys/supabase.js`:

```js
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

export const supabase = createClient(supabaseUrl, supabaseKey);
```

---

### 4. Update API Routes to Use Supabase

You’ll need to:
- Replace all in-memory operations with Supabase queries (select, insert, update, delete).
- Use the `supabase` client in your API route handlers.

---

Would you like me to:
- Proceed with the code for all CRUD endpoints using Supabase?
- Or do you want to start with just one (e.g., listing API keys) and build up from there?

Let me know, and please confirm you have your Supabase credentials ready!
