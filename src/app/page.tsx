"use client";
export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-6 md:p-24">
      <section>
          <h1>ACF Driver Portal</h1>

          <div className='item bg-blue-950 text-white'>
            <a href='/signin'>Driver sign in</a>
            <a href='/signup'>Driver sign up</a>
            <a href='/profile'>Driver profile</a>
            <br/>
            <a href="/event">See events</a>
          </div>
      </section>
    </main>
  );
}
