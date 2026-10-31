const MONTH_MAP = {
  jan: '01', january: '01',
  feb: '02', february: '02',
  mar: '03', march: '03',
  apr: '04', april: '04',
  may: '05',
  jun: '06', june: '06',
  jul: '07', july: '07',
  aug: '08', august: '08',
  sep: '09', sept: '09', september: '09',
  oct: '10', october: '10',
  nov: '11', november: '11',
  dec: '12', december: '12'
}

/**
 * Normalizes any supported date string to 'YYYY-MM-DD' calendar date string.
 * Supports ISO dates ('2026-10-19'), long English dates ('19 October 2026', 'October 19, 2026').
 */
export function normalizeDateToYMD(dateStr) {
  if (!dateStr || (typeof dateStr !== 'string' && typeof dateStr !== 'number')) return null
  const s = String(dateStr).trim()
  if (!s) return null

  // 1. ISO YYYY-MM-DD (or YYYY-MM-DDTHH:mm:ss)
  const isoMatch = s.match(/\b(\d{4})-(\d{1,2})-(\d{1,2})\b/)
  if (isoMatch) {
    const y = isoMatch[1]
    const m = String(isoMatch[2]).padStart(2, '0')
    const d = String(isoMatch[3]).padStart(2, '0')
    return `${y}-${m}-${d}`
  }

  // 2. Day Month Year: e.g. '19 October 2026' or '19 Oct 2026'
  const dmyMatch = s.match(/\b(\d{1,2})\s+([a-zA-Z]+)\s+(\d{4})\b/)
  if (dmyMatch) {
    const d = String(dmyMatch[1]).padStart(2, '0')
    const monthKey = dmyMatch[2].toLowerCase()
    const m = MONTH_MAP[monthKey] || MONTH_MAP[monthKey.slice(0, 3)]
    const y = dmyMatch[3]
    if (m) return `${y}-${m}-${d}`
  }

  // 3. Month Day, Year: e.g. 'October 19, 2026' or 'Oct 19 2026'
  const mdyMatch = s.match(/\b([a-zA-Z]+)\s+(\d{1,2}),?\s+(\d{4})\b/)
  if (mdyMatch) {
    const monthKey = mdyMatch[1].toLowerCase()
    const m = MONTH_MAP[monthKey] || MONTH_MAP[monthKey.slice(0, 3)]
    const d = String(mdyMatch[2]).padStart(2, '0')
    const y = mdyMatch[3]
    if (m) return `${y}-${m}-${d}`
  }

  return null
}

export function formatDate(iso) {
  if (!iso || (typeof iso !== 'string' && typeof iso !== 'number')) return 'N/A'
  
  const dateStr = String(iso).trim()
  if (!dateStr) return 'N/A'

  const ymd = normalizeDateToYMD(dateStr)
  if (ymd) {
    const [y, m, d] = ymd.split('-').map(Number)
    const dt = new Date(y, m - 1, d)
    return dt.toLocaleDateString('en-PK', { day: '2-digit', month: 'short', year: 'numeric' })
  }

  const fallback = new Date(dateStr)
  if (!isNaN(fallback.getTime())) {
    return fallback.toLocaleDateString('en-PK', { day: '2-digit', month: 'short', year: 'numeric' })
  }

  return dateStr || 'N/A'
}

export function daysRemaining(iso) {
  if (!iso) return null
  const ymd = normalizeDateToYMD(iso)
  if (!ymd) {
    const fallback = new Date(String(iso).trim())
    if (isNaN(fallback.getTime())) return null
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    return Math.ceil((fallback - today) / (1000 * 60 * 60 * 24))
  }

  // Calculate calendar days difference in Pakistan Standard Time (PKT, UTC+5)
  const todayPkt = new Date().toLocaleDateString('en-CA', { timeZone: 'Asia/Karachi' })
  const [ty, tm, td] = ymd.split('-').map(Number)
  const [cy, cm, cd] = todayPkt.split('-').map(Number)
  const targetUtc = Date.UTC(ty, tm - 1, td)
  const currentUtc = Date.UTC(cy, cm - 1, cd)
  return Math.round((targetUtc - currentUtc) / (1000 * 60 * 60 * 24))
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
      badgeClass: 'bg-red-100 text-red-800 border-red-300 font-bold',
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
