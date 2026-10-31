import { categories as fallbackCategories } from '../data/categories'

let cachedFallbackListings = null
async function getFallbackListings() {
  if (!cachedFallbackListings) {
    const mod = await import('../data/listings')
    cachedFallbackListings = mod.listings
  }
  return cachedFallbackListings
}

const API_BASE = '/api'

// Simple in-memory cache to prevent data flickering during SPA route changes
const cacheMap = new Map()

async function apiFetch(endpoint, options = {}) {
  const cacheKey = `${options.method || 'GET'}:${endpoint}`

  try {
    const res = await fetch(`${API_BASE}${endpoint}`, {
      credentials: 'same-origin',
      headers: {
        'Content-Type': 'application/json',
        ...(options.headers || {}),
      },
      ...options,
    })

    if (!res.ok) {
      const errData = await res.json().catch(() => ({}))
      throw new Error(errData.error || `HTTP ${res.status}`)
    }

    const data = await res.json()
    if ((!options.method || options.method === 'GET') && data.success) {
      cacheMap.set(cacheKey, data)
    }
    return data
  } catch (err) {
    if ((!options.method || options.method === 'GET') && cacheMap.has(cacheKey)) {
      return cacheMap.get(cacheKey)
    }
    throw err
  }
}

// Public API methods with cached fallback
export async function getCategoriesFromDb() {
  try {
    const json = await apiFetch('/categories')
    if (json.success && Array.isArray(json.data) && json.data.length > 0) {
      return json.data
    }
  } catch {
    // API failed, use fallback
  }
  return fallbackCategories
}

export async function getCategoryBySlugFromDb(slug) {
  try {
    const json = await apiFetch(`/categories/${slug}`)
    if (json.success && json.data) {
      return json.data
    }
  } catch {
    // Fallback
  }
  const category = fallbackCategories.find((c) => c.slug === slug)
  if (!category) return null
  const fallbackListings = await getFallbackListings()
  const articles = fallbackListings.filter((l) => l.category === slug)
  return { category, articles }
}

export async function getFeaturedListingsFromDb(limit = 4) {
  try {
    const json = await apiFetch(`/articles?featured=true&limit=${limit}`)
    if (json.success && Array.isArray(json.data) && json.data.length > 0) {
      return json.data
    }
  } catch {
    // Fallback
  }
  const fallbackListings = await getFallbackListings()
  return fallbackListings
    .filter((l) => l.featured)
    .slice(0, limit)
}

export async function getClosingSoonOpportunitiesFromDb(limit = 6) {
  try {
    const json = await apiFetch(`/articles?closingSoon=true&limit=${limit}`)
    if (json.success && Array.isArray(json.data) && json.data.length > 0) {
      return json.data
    }
  } catch {
    // Fallback
  }

  const todayStr = new Date().toISOString().split('T')[0]
  const fallbackListings = await getFallbackListings()
  return [...fallbackListings]
    .filter((l) => l.lastDate && l.lastDate >= todayStr)
    .sort((a, b) => new Date(a.lastDate) - new Date(b.lastDate))
    .slice(0, limit)
}

export async function getLatestListingsFromDb(limit = 10) {
  try {
    const json = await apiFetch(`/articles?latest=true&limit=${limit}`)
    if (json.success && Array.isArray(json.data) && json.data.length > 0) {
      return json.data
    }
  } catch {
    // Fallback
  }
  const fallbackListings = await getFallbackListings()
  return [...fallbackListings]
    .sort((a, b) => new Date(b.publishDate) - new Date(a.publishDate))
    .slice(0, limit)
}

export async function getArticleBySlugFromDb(slug) {
  try {
    const json = await apiFetch(`/articles/${slug}`)
    if (json.success && json.data) {
      return json.data
    }
  } catch {
    // Fallback
  }
  const fallbackListings = await getFallbackListings()
  return fallbackListings.find((l) => l.slug === slug) || null
}

export async function getArticlesByCategoryFromDb(categorySlug, limit = 0) {
  try {
    const limitQuery = limit > 0 ? `&limit=${limit}` : ''
    const json = await apiFetch(`/articles?category=${categorySlug}${limitQuery}`)
    if (json.success && Array.isArray(json.data) && json.data.length > 0) {
      return json.data
    }
  } catch {
    // Fallback
  }
  const fallbackListings = await getFallbackListings()
  let filtered = fallbackListings
    .filter((l) => l.category === categorySlug)
    .sort((a, b) => new Date(b.publishDate) - new Date(a.publishDate))
  if (limit > 0) {
    filtered = filtered.slice(0, limit)
  }
  return filtered
}

export async function searchListingsFromDb(query) {
  if (!query || !query.trim()) return []
  try {
    const json = await apiFetch(`/articles/search?q=${encodeURIComponent(query.trim())}`)
    if (json.success && Array.isArray(json.data)) {
      return json.data
    }
  } catch {
    // Fallback
  }
  const q = query.trim().toLowerCase()
  const fallbackListings = await getFallbackListings()
  return fallbackListings.filter((l) =>
    [l.title, l.organization, l.location, l.category].join(' ').toLowerCase().includes(q)
  )
}

export async function submitContactForm(contactData) {
  return await apiFetch('/contact', {
    method: 'POST',
    body: JSON.stringify(contactData),
  })
}

// Admin API
export async function adminLogin(username, password, turnstileToken = '') {
  return await apiFetch('/admin/login', {
    method: 'POST',
    body: JSON.stringify({ username, password, turnstileToken }),
  })
}

export async function adminLogout() {
  cacheMap.clear()
  return await apiFetch('/admin/logout', {
    method: 'POST',
  })
}

export async function adminMe(token) {
  return await apiFetch('/admin/me', {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  })
}

export async function adminGetStats(token) {
  return await apiFetch('/admin/stats', {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  })
}

export async function adminGetArticles(token, statusFilter = '') {
  const query = statusFilter ? `?status=${statusFilter}` : ''
  return await apiFetch(`/admin/articles${query}`, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  })
}

export async function adminCreateArticle(token, articleData) {
  cacheMap.clear()
  return await apiFetch('/admin/articles', {
    method: 'POST',
    headers: token ? { Authorization: `Bearer ${token}` } : {},
    body: JSON.stringify(articleData),
  })
}

export async function adminUpdateArticle(token, slug, articleData) {
  cacheMap.clear()
  return await apiFetch(`/admin/articles/${slug}`, {
    method: 'PUT',
    headers: token ? { Authorization: `Bearer ${token}` } : {},
    body: JSON.stringify(articleData),
  })
}

export async function adminToggleArticleStatus(token, slug, status) {
  cacheMap.clear()
  return await apiFetch(`/admin/articles/${slug}/status`, {
    method: 'PATCH',
    headers: token ? { Authorization: `Bearer ${token}` } : {},
    body: JSON.stringify({ status }),
  })
}

export async function adminDeleteArticle(token, slug) {
  cacheMap.clear()
  return await apiFetch(`/admin/articles/${slug}`, {
    method: 'DELETE',
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  })
}

export async function adminCreateCategory(token, categoryData) {
  cacheMap.clear()
  return await apiFetch('/admin/categories', {
    method: 'POST',
    headers: token ? { Authorization: `Bearer ${token}` } : {},
    body: JSON.stringify(categoryData),
  })
}

export async function adminUpdateCategory(token, slug, categoryData) {
  cacheMap.clear()
  return await apiFetch(`/admin/categories/${slug}`, {
    method: 'PUT',
    headers: token ? { Authorization: `Bearer ${token}` } : {},
    body: JSON.stringify(categoryData),
  })
}

export async function adminDeleteCategory(token, slug) {
  cacheMap.clear()
  return await apiFetch(`/admin/categories/${slug}`, {
    method: 'DELETE',
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  })
}

// Daily Updates Public API
export async function getDailyUpdatesFromDb(params = {}) {
  try {
    const query = new URLSearchParams()
    if (params.category) query.append('category', params.category)
    if (params.limit) query.append('limit', params.limit)
    if (params.q) query.append('q', params.q)

    const queryString = query.toString() ? `?${query.toString()}` : ''
    const json = await apiFetch(`/updates${queryString}`)
    if (json.success && Array.isArray(json.data) && json.data.length > 0) {
      return json.data
    }
  } catch {
    // Fallback
  }
  if (typeof window !== 'undefined' && Array.isArray(window.__INITIAL_UPDATES__) && window.__INITIAL_UPDATES__.length > 0) {
    let items = [...window.__INITIAL_UPDATES__]
    if (params.category) {
      items = items.filter((u) => u.category === params.category)
    }
    if (params.q) {
      const q = params.q.trim().toLowerCase()
      items = items.filter((u) =>
        [u.title, u.category, u.shortDescription, u.organization, u.location].join(' ').toLowerCase().includes(q)
      )
    }
    if (params.limit) {
      items = items.slice(0, Number(params.limit))
    }
    return items
  }
  try {
    const fallbackListings = await getFallbackListings()
    return fallbackListings.slice(0, Number(params.limit) || 24).map((l) => ({
      id: l.id,
      slug: l.slug,
      title: l.title,
      category: l.category || 'Government Jobs',
      shortDescription: l.excerpt || '',
      featuredImage: l.featuredImage || '',
      imageAlt: l.imageAlt || l.title,
      officialLink: l.officialLink || '',
      applyLink: l.applyLink || '',
      deadline: l.lastDate || '',
      publishDate: l.publishDate || '',
      organization: l.organization || '',
      location: l.location || '',
      qualification: l.qualification || '',
      jobType: l.jobType || '',
      salary: l.salary || '',
      isVerified: true,
    }))
  } catch {
    return []
  }
}

export async function getLatestDailyUpdatesFromDb(limit = 6) {
  try {
    const json = await apiFetch(`/updates/latest?limit=${limit}`)
    if (json.success && Array.isArray(json.data) && json.data.length > 0) {
      return json.data
    }
  } catch {
    // Fallback
  }
  if (typeof window !== 'undefined' && Array.isArray(window.__INITIAL_UPDATES__) && window.__INITIAL_UPDATES__.length > 0) {
    return window.__INITIAL_UPDATES__.slice(0, limit)
  }
  return []
}

export async function getDailyUpdateBySlugFromDb(slug) {
  try {
    const json = await apiFetch(`/updates/${slug}`)
    if (json.success && json.data) {
      return json.data
    }
  } catch {
    // Fallback
  }
  return null
}

// Daily Updates Admin API
export async function adminGetUpdates(token, statusFilter = '') {
  const query = statusFilter ? `?status=${statusFilter}` : ''
  return await apiFetch(`/admin/updates${query}`, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  })
}

export async function adminCreateUpdate(token, updateData) {
  cacheMap.clear()
  return await apiFetch('/admin/updates', {
    method: 'POST',
    headers: token ? { Authorization: `Bearer ${token}` } : {},
    body: JSON.stringify(updateData),
  })
}

export async function adminUpdateUpdate(token, slug, updateData) {
  cacheMap.clear()
  return await apiFetch(`/admin/updates/${slug}`, {
    method: 'PUT',
    headers: token ? { Authorization: `Bearer ${token}` } : {},
    body: JSON.stringify(updateData),
  })
}

export async function adminToggleUpdateStatus(token, slug, status) {
  cacheMap.clear()
  return await apiFetch(`/admin/updates/${slug}/status`, {
    method: 'PATCH',
    headers: token ? { Authorization: `Bearer ${token}` } : {},
    body: JSON.stringify({ status }),
  })
}

export async function adminDeleteUpdate(token, slug) {
  cacheMap.clear()
  return await apiFetch(`/admin/updates/${slug}`, {
    method: 'DELETE',
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  })
}

export async function generateClientImageVariants(file) {
  if (typeof window === 'undefined' || typeof document === 'undefined' || !file || !(file instanceof Blob)) {
    return null
  }
  return new Promise((resolve) => {
    try {
      const img = new Image()
      const url = URL.createObjectURL(file)
      img.onload = () => {
        URL.revokeObjectURL(url)
        const origWidth = img.naturalWidth || img.width
        const origHeight = img.naturalHeight || img.height

        const makeVariant = (targetWidth, quality) => {
          return new Promise((res) => {
            let width = origWidth
            let height = origHeight
            if (width > targetWidth) {
              height = Math.round((height * targetWidth) / width)
              width = targetWidth
            }
            const canvas = document.createElement('canvas')
            canvas.width = width
            canvas.height = height
            const ctx = canvas.getContext('2d')
            if (!ctx) return res(null)
            ctx.imageSmoothingEnabled = true
            ctx.imageSmoothingQuality = 'high'
            ctx.drawImage(img, 0, 0, width, height)
            canvas.toBlob((blob) => res(blob), 'image/webp', quality)
          })
        }

        Promise.all([makeVariant(640, 0.82), makeVariant(1200, 0.85)])
          .then(([card, display]) => resolve({ card, display }))
          .catch(() => resolve(null))
      }
      img.onerror = () => {
        URL.revokeObjectURL(url)
        resolve(null)
      }
      img.src = url
    } catch {
      resolve(null)
    }
  })
}

export async function adminUploadImage(token, imageData, userVariants = null) {
  const isBase64 = typeof imageData === 'object' && imageData.base64
  let variants = userVariants

  if (isBase64 || typeof imageData === 'string') {
    const payload = isBase64 ? { ...imageData } : { base64: imageData }
    if (variants) {
      payload.variants = variants
    }
    return await apiFetch('/admin/upload-image', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify(payload),
    })
  }

  // File or Blob object
  const formData = new FormData()
  formData.append('file', imageData)

  // Automatically attempt client-side generation of optimized WebP variants
  if (!variants && typeof window !== 'undefined') {
    try {
      variants = await generateClientImageVariants(imageData)
    } catch {
      // Fallback: proceed without variants
    }
  }

  if (variants) {
    if (variants.card) {
      formData.append('variant_card', variants.card, 'card.webp')
    }
    if (variants.display) {
      formData.append('variant_display', variants.display, 'display.webp')
    }
  }

  const res = await fetch('/api/admin/upload-image', {
    method: 'POST',
    headers: token ? { Authorization: `Bearer ${token}` } : {},
    body: formData,
  })

  return await res.json()
}

