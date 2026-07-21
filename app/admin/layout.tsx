'use client'

import { useState } from 'react'
import AdminSidebar from '@/components/admin/AdminSidebar'
import AdminBottomNav from '@/components/admin/AdminBottomNav'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg-alt)' }}>
      <style>{`
        .admin-mobile-topbar { display: none; }
        @media (max-width: 860px) {
          .admin-mobile-topbar {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 14px 16px;
            background: #1A1A2E;
            color: #fff;
            position: sticky;
            top: 0;
            z-index: 90;
          }
        }
      `}</style>

      <AdminSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column' }}>
        <div className="admin-mobile-topbar">
          <span style={{ fontWeight: 800, fontSize: 15 }}>
            BUTIK <span style={{ color: 'var(--gold)' }}>ANTAM</span>
          </span>
          <button
            onClick={() => setSidebarOpen(true)}
            style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer', padding: 4 }}
            aria-label="Buka menu lengkap"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M3 6h18M3 12h18M3 18h18" />
            </svg>
          </button>
        </div>

        {children}
      </div>

      <AdminBottomNav />
    </div>
  )
}