# Lettersforme

> Write. Listen. Feel.

Lettersforme is a web application that allows you to create a personal space for receiving anonymous messages, complete with songs that touch the soul. Each session is ephemeral, lasting only 21 days before the messages disappear, encouraging genuine and timely expression/page.js].

## ✨ Features

  * **Create Personal Sessions:** Start a new session with just your name.
  * **Shareable Links:** Get a unique, shareable link for your session to receive messages.
  * **Anonymous Messaging:** Receive messages from anyone, with or without a name.
  * **Spotify Integration:** Attach a Spotify song link to any message/page.js] and view it via an embedded player.
  * **Mood Tags:** Senders can tag their message with their current mood (e.g., Happy, Sad, Nostalgic.
  * **Ephemeral Storage:** All sessions and messages are automatically deleted after 21 days.
  * **Like Messages:** Show appreciation for messages you receive.

## 🛠️ Tech Stack

  * **Framework:** [Next.js](https://nextjs.org/)
  * **UI:** [React](https://reactjs.org/)
  * **Backend & Database:** [Supabase](https://supabase.io/)
  * **Styling:** [Tailwind CSS](https://tailwindcss.com/)
  * **Icons:** [Lucide React](https://lucide.dev/)
  * **Language:** JavaScript / TypeScript

## 🚀 Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites

  * Node.js (v18 or later recommended)
  * A package manager (npm, yarn, pnpm)
  * A [Supabase](https://supabase.com/) account for the database

### Environment Variables

This project connects to a Supabase backend. You must create a `.env.local` file in the root of the project and add your Supabase credentials. The `.gitignore` file is already set up to ignore this file.

Create a `.env.local` file with the following content:

```
NEXT_PUBLIC_SUPABASE_URL=your-supabase-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```

**Important:** You must also set up your database tables (`sessions`, `messages`) in Supabase and enable **Row Level Security (RLS)** to ensure data is secure.

### Installation & Running

1.  **Clone the repository:**

    ```bash
    git clone https://github.com/gcarlo11/project-lettersforme.git
    ```

2.  **Navigate to the project directory:**

    ```bash
    cd project-lettersforme
    ```

3.  **Install dependencies:**

    ```bash
    npm install
    # or
    yarn install
    # or
    pnpm install
    ```

4.  **Run the development server:**

    ```bash
    npm run dev
    # or
    yarn dev
    # or
    pnpm dev
    ```

Open [http://localhost:3000](https://www.google.com/search?q=http://localhost:3000) with your browser to see the result.

## 📦 Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Don't forget to add your Supabase environment variables in the Vercel project settings.

Check out the [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
