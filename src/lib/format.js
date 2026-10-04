export function formatDate(iso) {
  if (!iso || typeof iso !== 'string' && typeof iso !== 'number') return 'N/A'
  
  // Handle simple ISO date string (YYYY-MM-DD) or ISO timestamp
  const dateStr = String(iso).trim()
  const cleanIso = dateStr.includes('T') ? dateStr.split('T')[0] : dateStr
  const d = new Date(cleanIso + 'T00:00:00')
  
  if (isNaN(d.getTime())) {
    const fallback = new Date(dateStr)
    if (isNaN(fallback.getTime())) return dateStr || 'N/A'
    return fallback.toLocaleDateString('en-PK', { day: '2-digit', month: 'short', year: 'numeric' })
  }
  return d.toLocaleDateString('en-PK', { day: '2-digit', month: 'short', year: 'numeric' })
}

export function daysRemaining(iso) {
  if (!iso) return null
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  
  const dateStr = String(iso).trim()
  const cleanIso = dateStr.includes('T') ? dateStr.split('T')[0] : dateStr
  const target = new Date(cleanIso + 'T00:00:00')
  
  if (isNaN(target.getTime())) {
    const fallback = new Date(dateStr)
    if (isNaN(fallback.getTime())) return null
    return Math.ceil((fallback - today) / (1000 * 60 * 60 * 24))
  }
  return Math.ceil((target - today) / (1000 * 60 * 60 * 24))
}

export function deadlineLabel(iso) {
  const days = daysRemaining(iso)
  if (days === null) return { text: 'N/A', urgent: false, closed: false, days: 999 }
  if (days < 0) return { text: 'Expired', urgent: false, closed: true, days: -1 }
  if (days === 0) return { text: 'Closes Today', urgent: true, closed: false, days: 0 }
  if (days === 1) return { text: '1 Day Left', urgent: true, closed: false, days: 1 }
  if (days <= 5) return { text: `${days} Days Left`, urgent: true, closed: false, days }
  return { text: `${days} Days Left`, urgent: false, closed: false, days }
}

export function getOpportunityStatus(iso, noDeadline = false) {
  if (noDeadline || !iso || String(iso).trim() === '') {
    return {
      status: 'OPEN',
      label: 'NO DEADLINE',
      badgeClass: 'bg-emerald-100 text-emerald-800 border-emerald-300',
      isExpired: false,
      days: 999,
    }
  }

  const days = daysRemaining(iso)
  if (days === null) {
    return {
      status: 'OPEN',
      label: 'OPEN',
      badgeClass: 'bg-emerald-100 text-emerald-800 border-emerald-300',
      isExpired: false,
      days: 999,
    }
  }
  if (days < 0) {
    return {
      status: 'EXPIRED',
      label: 'EXPIRED',
      badgeClass: 'bg-slate-200 text-slate-700 border-slate-300',
      isExpired: true,
      days,
    }
  }
  if (days === 0) {
    return {
      status: 'CLOSES TODAY',
      label: 'CLOSES TODAY',
      badgeClass: 'bg-red-100 text-red-800 border-red-300 font-bold animate-pulse',
      isExpired: false,
      days: 0,
    }
  }
  if (days <= 3) {
    return {
      status: 'CLOSING SOON',
      label: `CLOSING SOON (${days}d left)`,
      badgeClass: 'bg-amber-100 text-amber-800 border-amber-300 font-bold',
      isExpired: false,
      days,
    }
  }
  return {
    status: 'OPEN',
    label: `${days} Days Left`,
    badgeClass: 'bg-emerald-100 text-emerald-800 border-emerald-300',
    isExpired: false,
    days,
  }
}
