'use client'

import { useRouter } from 'next/navigation'

export default function UnauthorizedPage() {
  const router = useRouter()

  return (
    <div className="container flex flex-col items-center justify-center min-h-screen">
      <div className="card max-w-md text-center">
        <h1 className="text-4xl font-bold mb-4 text-red-600">Access Denied</h1>
        <p className="text-gray-600 mb-6">
          You don't have permission to access this page.
        </p>
        <button
          onClick={() => router.back()}
          className="btn btn-primary w-full"
        >
          Go Back
        </button>
      </div>
    </div>
  )
}
