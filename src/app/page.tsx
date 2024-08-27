"use client";
export default function Home() {

  async function call_api() {
    fetch("/api/test")
      .then((res) => res.json())
      .then((data) => alert(data.message));
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <section>
          <h1>ACF Driver Portal</h1>

          <a href='/signin'>Driver login</a>
          <a href='/signup'>Driver signup</a>
          <a href='/profile'>Driver profile</a>
          <br/>
          <p>Create an event</p>
          <p>View events</p>
      </section>
    </main>
  );
}
