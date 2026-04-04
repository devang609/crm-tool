'use client'

import { useState } from 'react'
import { Modal } from './Modal'

export function BriefingButton() {
  const [showBriefing, setShowBriefing] = useState(false)
  const [briefing, setBriefing] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleGetBriefing = async () => {
    try {
      setLoading(true)
      setError('')
      setBriefing('')

      const response = await fetch('/api/briefing')
      const result = await response.json()

      if (!result.success) {
        setError(result.error || 'Failed to generate briefing')
        return
      }

      setBriefing(result.data.briefing)
      setShowBriefing(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <button
        onClick={handleGetBriefing}
        disabled={loading}
        className="btn btn-primary"
      >
        {loading ? 'Generating...' : "📋 What's for Today"}
      </button>

      <Modal
        isOpen={showBriefing && !loading}
        onClose={() => setShowBriefing(false)}
        title="Daily Briefing"
      >
        <div className="space-y-4">
          {error ? (
            <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded">
              {error}
            </div>
          ) : (
            <div className="bg-blue-50 border border-blue-200 rounded p-6 whitespace-pre-wrap text-sm leading-relaxed">
              {briefing}
            </div>
          )}
          <button
            onClick={() => setShowBriefing(false)}
            className="btn btn-primary w-full"
          >
            Close
          </button>
        </div>
      </Modal>
    </>
  )
}
