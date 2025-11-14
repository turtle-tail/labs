export default function Home() {
  return (
    <main className="min-h-screen flex items-center justify-center px-5">
      <div className="max-w-content w-full text-center">
        <div className="mb-6 text-6xl">✨</div>
        <h1 className="text-3xl font-bold mb-4">Labs</h1>
        <p className="mb-8 text-text-secondary">
          재미있는 심리테스트 플랫폼
        </p>
        <div className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-md font-medium transition-colors bg-primary text-white">
          Design System Test
        </div>
        <div className="mt-8 p-4 rounded-lg border border-border bg-bg-card">
          <p className="text-sm text-text-tertiary">
            Design system configured successfully!
          </p>
        </div>
      </div>
    </main>
  );
}
