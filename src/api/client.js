import { categories as fallbackCategories } from '../data/categories'
import { listings as fallbackListings } from '../data/listings'

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
  return fallbackListings.find((l) => l.slug === slug) || null
}

export async function getArticlesByCategoryFromDb(categorySlug) {
  try {
    const json = await apiFetch(`/articles?category=${categorySlug}`)
    if (json.success && Array.isArray(json.data) && json.data.length > 0) {
      return json.data
    }
  } catch {
    // Fallback
  }
  return fallbackListings
    .filter((l) => l.category === categorySlug)
    .sort((a, b) => new Date(b.publishDate) - new Date(a.publishDate))
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
    if (json.success && Array.isArray(json.data)) {
      return json.data
    }
  } catch {
    // Fallback
  }
  return []
}

export async function getLatestDailyUpdatesFromDb(limit = 6) {
  try {
    const json = await apiFetch(`/updates/latest?limit=${limit}`)
    if (json.success && Array.isArray(json.data)) {
      return json.data
    }
  } catch {
    // Fallback
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

export async function adminUploadImage(token, imageData) {
  const isBase64 = typeof imageData === 'object' && imageData.base64
  const bodyPayload = isBase64
    ? JSON.stringify(imageData)
    : typeof imageData === 'string'
    ? JSON.stringify({ base64: imageData })
    : null

  if (bodyPayload) {
    return await apiFetch('/admin/upload-image', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: bodyPayload,
    })
  }

  // File object
  const formData = new FormData()
  formData.append('file', imageData)

  const res = await fetch('/api/admin/upload-image', {
    method: 'POST',
    headers: token ? { Authorization: `Bearer ${token}` } : {},
    body: formData,
  })

  return await res.json()
}

