export function formatDate(iso) {
  const d = new Date(iso + 'T00:00:00')
  return d.toLocaleDateString('en-PK', { day: '2-digit', month: 'short', year: 'numeric' })
}

export function daysRemaining(iso) {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const target = new Date(iso + 'T00:00:00')
  return Math.ceil((target - today) / (1000 * 60 * 60 * 24))
}

export function deadlineLabel(iso) {
  const days = daysRemaining(iso)
  if (days < 0) return { text: 'Closed', urgent: false, closed: true }
  if (days === 0) return { text: 'Closes today', urgent: true, closed: false }
  if (days <= 5) return { text: `${days} day${days === 1 ? '' : 's'} left`, urgent: true, closed: false }
  return { text: `${days} days left`, urgent: false, closed: false }
}
