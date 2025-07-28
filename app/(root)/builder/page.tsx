'use client'

import { Suspense } from 'react'
import { BuilderContent } from './_components/builder-content'

export default function BuilderPage() {
  return (
    <Suspense fallback={(
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    )}
    >
      <BuilderContent />
    </Suspense>
  )
}
