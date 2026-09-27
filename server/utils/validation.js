export function sanitizeString(str, maxLength = 1000) {
  if (typeof str !== 'string') return ''
  // Strip control characters (except newlines and tabs)
  let cleaned = str.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '').trim()
  if (cleaned.length > maxLength) {
    cleaned = cleaned.slice(0, maxLength)
  }
  return cleaned
}

export function validateSlug(slug) {
  if (!slug || typeof slug !== 'string') return false
  const clean = slug.trim()
  return /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(clean) && clean.length <= 150
}

export function validateEmail(email) {
  if (!email || typeof email !== 'string') return false
  const clean = email.trim().toLowerCase()
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(clean) && clean.length <= 150
}

export function validateUrl(url) {
  if (!url || typeof url !== 'string' || !url.trim()) return true // Optional
  try {
    const parsed = new URL(url.trim())
    return parsed.protocol === 'http:' || parsed.protocol === 'https:'
  } catch {
    return false
  }
}

export function sanitizeArticleInput(data) {
  const errors = []

  const title = sanitizeString(data.title, 200)
  if (!title || title.length < 3) {
    errors.push('Title must be between 3 and 200 characters.')
  }

  const slug = sanitizeString(data.slug, 150).toLowerCase()
  if (!validateSlug(slug)) {
    errors.push('Slug must contain only lowercase letters, numbers, and hyphens (max 150 chars).')
  }

  const category = sanitizeString(data.category || data.category_slug, 100).toLowerCase()
  if (!category) {
    errors.push('Category is required.')
  }

  const organization = sanitizeString(data.organization, 150)
  if (!organization) {
    errors.push('Organization is required.')
  }

  const jobType = sanitizeString(data.jobType || data.job_type, 100) || 'Full Time'
  const location = sanitizeString(data.location, 100)
  const qualification = sanitizeString(data.qualification, 200)
  const salary = sanitizeString(data.salary, 100)
  const lastDate = sanitizeString(data.lastDate || data.last_date, 20)
  const publishDate = sanitizeString(data.publishDate || data.publish_date, 20)
  const officialLink = sanitizeString(data.officialLink || data.official_link, 500)

  if (!validateUrl(officialLink)) {
    errors.push('Official link must be a valid http:// or https:// URL.')
  }

  const featured = Boolean(data.featured)
  const logoInitial = sanitizeString(data.logoInitial || data.logo_initial, 10).toUpperCase()
  const excerpt = sanitizeString(data.excerpt, 500)

  let content = data.content
  if (Array.isArray(content)) {
    content = content.map((p) => sanitizeString(p, 5000)).filter(Boolean)
  } else if (typeof content === 'string') {
    content = [sanitizeString(content, 10000)]
  } else {
    content = []
  }

  if (content.length === 0 || !content[0]) {
    errors.push('Article content is required.')
  }

  const seoTitle = sanitizeString(data.seoTitle || data.seo_title, 200) || title
  const metaDescription = sanitizeString(data.metaDescription || data.meta_description, 300) || excerpt
  const status = data.status === 'draft' ? 'draft' : 'published'

  return {
    valid: errors.length === 0,
    errors,
    data: {
      title,
      slug,
      category,
      organization,
      jobType,
      location,
      qualification,
      salary,
      lastDate,
      publishDate,
      officialLink,
      featured,
      logoInitial,
      excerpt,
      content,
      seoTitle,
      metaDescription,
      status,
    },
  }
}

export function sanitizeCategoryInput(data) {
  const errors = []

  const label = sanitizeString(data.label, 100)
  if (!label || label.length < 2) {
    errors.push('Category label must be between 2 and 100 characters.')
  }

  const slug = sanitizeString(data.slug, 100).toLowerCase()
  if (!validateSlug(slug)) {
    errors.push('Category slug must contain only lowercase letters, numbers, and hyphens.')
  }

  const short = sanitizeString(data.short, 50) || label
  const tone = ['slate', 'green', 'gold', 'brick'].includes(data.tone) ? data.tone : 'slate'
  const description = sanitizeString(data.description, 500)

  return {
    valid: errors.length === 0,
    errors,
    data: {
      label,
      slug,
      short,
      tone,
      description,
    },
  }
}

export function sanitizeUpdateInput(data) {
  const errors = []

  const title = sanitizeString(data.title, 200)
  if (!title || title.length < 3) {
    errors.push('Title must be between 3 and 200 characters.')
  }

  const slug = sanitizeString(data.slug, 150).toLowerCase()
  if (!validateSlug(slug)) {
    errors.push('Slug must contain only lowercase letters, numbers, and hyphens (max 150 chars).')
  }

  const category = sanitizeString(data.category, 100)
  if (!category) {
    errors.push('Category is required.')
  }

  const shortDescription = sanitizeString(data.shortDescription || data.short_description, 500)
  if (!shortDescription) {
    errors.push('Short description is required.')
  }

  const officialLink = sanitizeString(data.officialLink || data.official_link, 500)
  if (!validateUrl(officialLink)) {
    errors.push('Official link must be a valid URL.')
  }

  const applyLink = sanitizeString(data.applyLink || data.apply_link, 500)
  if (!validateUrl(applyLink)) {
    errors.push('Apply link must be a valid URL.')
  }

  const featuredImage = sanitizeString(data.featuredImage || data.featured_image, 1000)
  const imageAlt = sanitizeString(data.imageAlt || data.image_alt, 200)
  const deadline = sanitizeString(data.deadline, 30)
  const publishDate = sanitizeString(data.publishDate || data.publish_date, 40) || new Date().toISOString()

  let content = data.content
  if (Array.isArray(content)) {
    content = content.map((p) => sanitizeString(p, 5000)).filter(Boolean)
  } else if (typeof content === 'string') {
    content = [sanitizeString(content, 10000)]
  } else {
    content = []
  }

  if (content.length === 0 || !content[0]) {
    errors.push('Content body is required.')
  }

  const seoTitle = sanitizeString(data.seoTitle || data.seo_title, 200) || title
  const metaDescription = sanitizeString(data.metaDescription || data.meta_description, 300) || shortDescription
  const status = data.status === 'draft' ? 'draft' : 'published'

  return {
    valid: errors.length === 0,
    errors,
    data: {
      title,
      slug,
      category,
      shortDescription,
      content,
      featuredImage,
      imageAlt,
      officialLink,
      applyLink,
      deadline,
      publishDate,
      seoTitle,
      metaDescription,
      status,
    },
  }
}

