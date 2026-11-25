import { useEffect, useState } from 'react'

// Phase 1 placeholder: confirms Tailwind works and the frontend can reach the backend.
// This file will be replaced by the real 4-screen flow in Phase 2.
function App() {
  const [backendStatus, setBackendStatus] = useState('checking')

  useEffect(() => {
    fetch('/api/health')
      .then((response) => (response.ok ? response.json() : Promise.reject()))
      .then((data) => setBackendStatus(data.status === 'ok' ? 'connected' : 'error'))
      .catch(() => setBackendStatus('error'))
  }, [])

  const statusStyles = {
    checking: 'bg-amber-100 text-amber-700',
    connected: 'bg-emerald-100 text-emerald-700',
    error: 'bg-rose-100 text-rose-700',
  }

  const statusLabels = {
    checking: 'Checking backend…',
    connected: 'Backend connected',
    error: 'Backend not reachable',
  }

  return (
    <main className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-sm ring-1 ring-slate-200 text-center">
        <h1 className="text-2xl font-semibold text-slate-900">ReturnEase</h1>
        <p className="mt-2 text-slate-500">AI-Powered Returns &amp; Exchanges</p>
        <span
          className={`mt-6 inline-block rounded-full px-4 py-1.5 text-sm font-medium ${statusStyles[backendStatus]}`}
        >
          {statusLabels[backendStatus]}
        </span>
      </div>
    </main>
  )
}

export default App
