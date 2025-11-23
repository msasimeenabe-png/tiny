TinyLink – URL Shortener:
TinyLink is a simple web app that shortens long URLs into easy-to-share links, like Bit.ly. It lets you create short links, track how many times each link is clicked, and manage your links from a dashboard.

Features:
Create short links with custom names, or let the system generate one automatically.
Track total clicks for each link and see the last time it was clicked.
Delete links you no longer need.
Clicking a short link automatically redirects to the original URL.
Frontend is deployed on Vercel, backend on Render, and the database is hosted on Neon Postgres.

Tech Stack:
Frontend: Next.js with React and Tailwind CSS
Backend: Node.js with Express
Database: Neon Postgres
Hosting: Vercel for frontend, Render for backend

How It Works:
Backend connects to Neon Postgres. It automatically creates a table for storing links if it doesn’t already exist.
Frontend interacts with the backend through API calls to create, list, delete, or redirect links.
Users interact with the frontend dashboard to manage their links.
Clicking a short link triggers the backend to increase the click count and redirect to the original URL.

Deployment:
Frontend is hosted on Vercel. You just push the frontend code and set the backend URL as an environment variable.
Backend is hosted on Render or Railway. You push the backend code and set the database URL and frontend URL as environment variables.
After deployment, the app is fully functional with database, backend APIs, and frontend dashboard.

Notes:
You don’t need to manually create tables in the database; the backend handles that automatically.
Make sure the frontend knows where the backend is hosted by setting the proper environment variable.
SSL is required for the Neon Postgres connection.


Make sure the frontend knows where the backend is hosted by setting the proper environment variable.

SSL is required for the Neon Postgres connection.
