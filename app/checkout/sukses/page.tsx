import { Suspense } from 'react'
import SuksesContent from './SuksesContent'

export default function SuksesPage() {
  return (
    <Suspense fallback={<div style={{ padding: 40, textAlign: 'center' }}>Memuat...</div>}>
      <SuksesContent />
    </Suspense>
  )
}