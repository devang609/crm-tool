'use client'

import Link from 'next/link'

export default function Home() {
  return (
    <div className="container flex flex-col items-center justify-center min-h-screen">
      <div className="text-center">
        <h1 className="text-5xl font-bold mb-4 text-gray-900">CRM Application</h1>
        <p className="text-xl text-gray-600 mb-8">Manage your customers efficiently</p>
        <Link href="/login" className="btn btn-primary text-lg">
          Get Started
        </Link>
      </div>
    </div>
  )
}
