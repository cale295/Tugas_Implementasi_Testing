export default function Home() {
  return (
    <div className="flex flex-col min-h-screen items-center justify-center bg-zinc-50 dark:bg-black font-sans">
      <main className="w-full max-w-2xl px-6 py-20 bg-white dark:bg-black text-center sm:text-left">

        {/* Announcement Title */}
        <h1 className="text-4xl font-bold tracking-tight text-black dark:text-white mb-4">
          🚀 We Just Launched Something New
        </h1>

        {/* Subtitle */}
        <p className="text-lg text-zinc-600 dark:text-zinc-400 mb-8">
          Our latest product is now live. Built to solve real problems faster,
          simpler, and more efficiently than before.
        </p>

        {/* Details */}
        <div className="text-base text-zinc-700 dark:text-zinc-300 space-y-4 mb-10">
          <p>
            • Faster performance with improved infrastructure  
          </p>
          <p>
            • Cleaner interface for better usability  
          </p>
          <p>
            • New features based on real user feedback  
          </p>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4">
          <a
            href="#"
            className="flex h-12 items-center justify-center rounded-full bg-black text-white px-6 hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-zinc-200 transition"
          >
            Try It Now
          </a>

          <a
            href="#"
            className="flex h-12 items-center justify-center rounded-full border border-zinc-300 px-6 hover:bg-zinc-100 dark:border-zinc-700 dark:hover:bg-zinc-900 transition"
          >
            Learn More
          </a>
        </div>

      </main>
    </div>
  );
}