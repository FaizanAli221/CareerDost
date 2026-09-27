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
