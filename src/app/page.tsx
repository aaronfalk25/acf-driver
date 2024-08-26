"use client";
export default function Home() {

  async function call_api() {
    fetch("/api/test")
      .then((res) => res.json())
      .then((data) => alert(data.message));
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="z-10 w-full max-w-5xl items-center justify-between font-mono text-sm">
          <h1>ACF Driver Portal</h1>

          <p>Driver login</p>
          <p>Driver signup</p>
          <p>Driver profile</p>
          <br/>
          <p>Create an event</p>
          <p>View events</p>
      </div>
    </main>
  );
}
