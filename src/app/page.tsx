export default function Home() {
  return (
    <main className="min-h-screen flex items-center justify-center px-5">
      <div className="max-w-content w-full text-center">
        <div className="mb-6 text-6xl">✨</div>
        <h1 className="text-3xl font-bold mb-4">Labs</h1>
        <p className="mb-8" style={{ color: 'var(--color-text-secondary)' }}>
          재미있는 심리테스트 플랫폼
        </p>
        <div className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-md font-medium transition-colors"
             style={{ backgroundColor: 'var(--color-primary)', color: '#ffffff' }}>
          Design System Test
        </div>
        <div className="mt-8 p-4 rounded-lg border"
             style={{
               backgroundColor: 'var(--color-bg-card)',
               borderColor: 'var(--color-border)'
             }}>
          <p className="text-sm" style={{ color: 'var(--color-text-tertiary)' }}>
            Design system configured successfully!
          </p>
        </div>
      </div>
    </main>
  );
}
