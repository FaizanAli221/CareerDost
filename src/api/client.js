import { categories as fallbackCategories } from '../data/categories'
import { listings as fallbackListings } from '../data/listings'

const API_BASE = '/api'

// Simple in-memory cache to prevent data flickering during SPA route changes
const cacheMap = new Map()

async function apiFetch(endpoint, options = {}) {
  const cacheKey = `${options.method || 'GET'}:${endpoint}`

  try {
    const res = await fetch(`${API_BASE}${endpoint}`, {
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
    .sort((a, b) => new Date(b.publishDate) - new Date(a.publishDate))
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

// Admin API
export async function adminLogin(username, password) {
  return await apiFetch('/admin/login', {
    method: 'POST',
    body: JSON.stringify({ username, password }),
  })
}

export async function adminMe(token) {
  return await apiFetch('/admin/me', {
    headers: { Authorization: `Bearer ${token}` },
  })
}

export async function adminGetStats(token) {
  return await apiFetch('/admin/stats', {
    headers: { Authorization: `Bearer ${token}` },
  })
}

export async function adminGetArticles(token, statusFilter = '') {
  const query = statusFilter ? `?status=${statusFilter}` : ''
  return await apiFetch(`/admin/articles${query}`, {
    headers: { Authorization: `Bearer ${token}` },
  })
}

export async function adminCreateArticle(token, articleData) {
  cacheMap.clear()
  return await apiFetch('/admin/articles', {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
    body: JSON.stringify(articleData),
  })
}

export async function adminUpdateArticle(token, slug, articleData) {
  cacheMap.clear()
  return await apiFetch(`/admin/articles/${slug}`, {
    method: 'PUT',
    headers: { Authorization: `Bearer ${token}` },
    body: JSON.stringify(articleData),
  })
}

export async function adminToggleArticleStatus(token, slug, status) {
  cacheMap.clear()
  return await apiFetch(`/admin/articles/${slug}/status`, {
    method: 'PATCH',
    headers: { Authorization: `Bearer ${token}` },
    body: JSON.stringify({ status }),
  })
}

export async function adminDeleteArticle(token, slug) {
  cacheMap.clear()
  return await apiFetch(`/admin/articles/${slug}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  })
}

export async function adminCreateCategory(token, categoryData) {
  cacheMap.clear()
  return await apiFetch('/admin/categories', {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
    body: JSON.stringify(categoryData),
  })
}

export async function adminUpdateCategory(token, slug, categoryData) {
  cacheMap.clear()
  return await apiFetch(`/admin/categories/${slug}`, {
    method: 'PUT',
    headers: { Authorization: `Bearer ${token}` },
    body: JSON.stringify(categoryData),
  })
}

export async function adminDeleteCategory(token, slug) {
  cacheMap.clear()
  return await apiFetch(`/admin/categories/${slug}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  })
}
