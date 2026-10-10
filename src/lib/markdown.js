import DOMPurify from 'dompurify'

/**
 * CareerDost Semantic Markdown Parser & Sanitizer
 * Transforms editorial markdown (headings, callouts, tables, lists, links) into sanitized HTML.
 */
export function parseMarkdownToHtml(md) {
  if (!md) return ''
  const rawText = Array.isArray(md) ? md.join('\n\n') : String(md)
  const lines = rawText.split('\n')
  const html = []

  let inTable = false
  let tableHeader = []
  let tableRows = []
  let inList = false
  let listType = null
  let inBlockquote = false
  let quoteType = 'note'
  let quoteContent = []

  function flushList() {
    if (inList) {
      html.push(listType === 'ol' ? '</ol>' : '</ul>')
      inList = false
      listType = null
    }
  }

  function flushTable() {
    if (inTable) {
      let tHtml = '<div class="overflow-x-auto my-6 border border-line rounded-xs shadow-xs"><table class="w-full text-left text-xs sm:text-sm font-sans divide-y divide-line">'
      if (tableHeader.length > 0) {
        tHtml += '<thead class="bg-paper font-bold text-ink uppercase text-[11px] tracking-wider"><tr>'
        for (const cell of tableHeader) {
          tHtml += '<th class="p-3">' + formatInline(cell.trim()) + '</th>'
        }
        tHtml += '</tr></thead>'
      }
      if (tableRows.length > 0) {
        tHtml += '<tbody class="divide-y divide-line/60 bg-white">'
        for (const row of tableRows) {
          tHtml += '<tr class="hover:bg-paper/50 transition-colors">'
          for (const cell of row) {
            tHtml += '<td class="p-3 text-inksoft">' + formatInline(cell.trim()) + '</td>'
          }
          tHtml += '</tr>'
        }
        tHtml += '</tbody>'
      }
      tHtml += '</table></div>'
      html.push(tHtml)
      inTable = false
      tableHeader = []
      tableRows = []
    }
  }

  function flushBlockquote() {
    if (inBlockquote) {
      const qText = quoteContent.join('<br/>')
      const alertClasses = {
        note: 'border-l-4 border-emerald-600 bg-emerald-50 text-emerald-950 p-4 rounded-xs my-4 shadow-xs',
        important: 'border-l-4 border-amber-500 bg-amber-50 text-amber-950 p-4 rounded-xs my-4 shadow-xs',
        warning: 'border-l-4 border-red-600 bg-red-50 text-red-950 p-4 rounded-xs my-4 shadow-xs',
        tip: 'border-l-4 border-sky-600 bg-sky-50 text-sky-950 p-4 rounded-xs my-4 shadow-xs',
      }
      const icons = {
        note: '📌',
        important: '⭐',
        warning: '⚠️',
        tip: '💡',
      }
      const cls = alertClasses[quoteType] || alertClasses.note
      const icon = icons[quoteType] || '📌'
      html.push(`<div class="${cls}"><div class="flex items-start gap-2.5"><span class="text-lg leading-none mt-0.5">${icon}</span><div class="flex-1 font-sans text-xs sm:text-sm leading-relaxed">${formatInline(qText)}</div></div></div>`)
      inBlockquote = false
      quoteType = 'note'
      quoteContent = []
    }
  }

  function formatInline(str) {
    if (!str) return ''
    return str
      .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer" class="text-green hover:underline font-semibold">$1</a>')
      .replace(/\*\*([^*]+)\*\*/g, '<strong class="font-bold text-ink">$1</strong>')
      .replace(/\*([^*]+)\*/g, '<em class="italic">$1</em>')
      .replace(/`([^`]+)`/g, '<code class="bg-paper px-1.5 py-0.5 rounded text-xs font-mono border border-line text-ink">$1</code>')
  }

  for (let i = 0; i < lines.length; i++) {
    const rawLine = lines[i]
    const line = rawLine.trim()

    if (!line) {
      flushTable()
      flushList()
      flushBlockquote()
      continue
    }

    // Callout / Blockquote
    if (line.startsWith('>')) {
      flushTable()
      flushList()
      let raw = line.replace(/^>\s*/, '')
      if (raw.includes('[!NOTE]') || raw.includes('[!TIP]')) {
        flushBlockquote()
        inBlockquote = true
        quoteType = raw.includes('[!TIP]') ? 'tip' : 'note'
        raw = raw.replace(/\[!(NOTE|TIP)\]/g, '').trim()
      } else if (raw.includes('[!IMPORTANT]')) {
        flushBlockquote()
        inBlockquote = true
        quoteType = 'important'
        raw = raw.replace(/\[!IMPORTANT\]/g, '').trim()
      } else if (raw.includes('[!WARNING]') || raw.includes('[!CAUTION]')) {
        flushBlockquote()
        inBlockquote = true
        quoteType = 'warning'
        raw = raw.replace(/\[!(WARNING|CAUTION)\]/g, '').trim()
      } else if (!inBlockquote) {
        inBlockquote = true
        quoteType = 'note'
      }
      if (raw) quoteContent.push(raw)
      continue
    } else {
      flushBlockquote()
    }

    // Markdown Table
    if (line.startsWith('|') && line.endsWith('|')) {
      flushList()
      const cells = line.slice(1, -1).split('|')
      if (line.includes('---')) {
        continue
      }
      if (!inTable) {
        inTable = true
        tableHeader = cells
      } else {
        tableRows.push(cells)
      }
      continue
    } else {
      flushTable()
    }

    // Headings
    if (line.startsWith('### ')) {
      flushList()
      html.push('<h3 class="font-serif text-xl sm:text-2xl font-bold text-ink mt-8 mb-4 border-b border-line pb-2">' + formatInline(line.slice(4)) + '</h3>')
      continue
    }
    if (line.startsWith('## ')) {
      flushList()
      html.push('<h2 class="font-serif text-2xl sm:text-3xl font-bold text-ink mt-10 mb-4 border-b border-line pb-2">' + formatInline(line.slice(3)) + '</h2>')
      continue
    }
    if (line.startsWith('# ')) {
      flushList()
      html.push('<h1 class="font-serif text-3xl sm:text-4xl font-bold text-ink mt-8 mb-4">' + formatInline(line.slice(2)) + '</h1>')
      continue
    }

    // Ordered list
    if (/^\d+\.\s/.test(line)) {
      if (!inList || listType !== 'ol') {
        flushList()
        inList = true
        listType = 'ol'
        html.push('<ol class="list-decimal list-inside space-y-2 my-3 text-inksoft leading-relaxed">')
      }
      html.push('<li>' + formatInline(line.replace(/^\d+\.\s*/, '')) + '</li>')
      continue
    }

    // Unordered list
    if (/^[-*]\s/.test(line)) {
      if (!inList || listType !== 'ul') {
        flushList()
        inList = true
        listType = 'ul'
        html.push('<ul class="list-disc list-inside space-y-2 my-3 text-inksoft leading-relaxed">')
      }
      html.push('<li>' + formatInline(line.replace(/^[-*]\s*/, '')) + '</li>')
      continue
    }

    flushList()
    // Regular paragraph or pre-formatted HTML tag
    if (line.startsWith('<') && line.endsWith('>')) {
      html.push(line)
    } else {
      html.push('<p class="leading-relaxed text-inksoft mb-4 text-sm sm:text-base">' + formatInline(line) + '</p>')
    }
  }

  flushTable()
  flushList()
  flushBlockquote()

  const rawHtml = html.join('\n')

  // Sanitize via DOMPurify with allowed tags and attributes
  return DOMPurify.sanitize(rawHtml, {
    ADD_ATTR: ['target', 'rel', 'class', 'className'],
    ALLOWED_TAGS: [
      'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'ul', 'ol', 'li', 'strong', 'em', 'b', 'i',
      'a', 'table', 'thead', 'tbody', 'tr', 'th', 'td', 'blockquote',
      'div', 'span', 'br', 'hr', 'code', 'pre', 'img'
    ],
  })
}
