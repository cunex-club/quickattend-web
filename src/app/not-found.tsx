import "@styles/globals.css";

export default function RootNotFound() {
  return (
    <html>
      <body className="antialiased">
        <main className="flex min-h-screen w-full flex-col items-center justify-center gap-6 bg-neutral-white p-8 text-center">
          <div className="flex flex-col gap-2">
            <p className="headline-medium-emphasized">
              ไม่พบหน้านี้ / Page not found
            </p>
            <p className="body-large-primary text-neutral-500">
              ขออภัย ไม่พบหน้าที่คุณต้องการ
              <br />
              Sorry, we couldn&apos;t find the page you&apos;re looking for.
            </p>
          </div>
          <a
            href="/"
            className="label-large-emphasized rounded-full bg-primary px-6 py-3 text-neutral-white"
          >
            กลับหน้าแรก / Go home
          </a>
        </main>
      </body>
    </html>
  );
}
