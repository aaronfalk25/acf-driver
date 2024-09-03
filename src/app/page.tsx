"use client";
export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <section>
          <h1>ACF Driver Portal</h1>

          <a href='/signin'>Driver signin</a>
          <a href='/signup'>Driver signup</a>
          <a href='/profile'>Driver profile</a>
          <br/>
          <a href="/event">Event</a>
      </section>
    </main>
  );
}
