import React, { useState, useEffect } from 'react'
import {
  adminLogin,
  adminGetStats,
  adminGetArticles,
  getCategoriesFromDb,
  adminCreateArticle,
  adminUpdateArticle,
  adminToggleArticleStatus,
  adminDeleteArticle,
  adminCreateCategory,
  adminUpdateCategory,
  adminDeleteCategory,
  adminGetUpdates,
  adminCreateUpdate,
  adminUpdateUpdate,
  adminToggleUpdateStatus,
  adminDeleteUpdate,
  adminUploadImage,
  adminLogout,
} from '../api/client'
import CategoryFallbackImage from '../components/CategoryFallbackImage'
import UpdateCard from '../components/UpdateCard'
import SafeContent from '../components/SafeContent'
import { getOpportunityStatus, formatDate } from '../lib/format'
import { safeUrl } from '../lib/security'
import { useSeo } from '../lib/useSeo'
import { SITE_URL } from '../lib/config'
import { getContentType, getContentTypeLabels } from '../lib/contentType'

const UPDATE_CATEGORIES = [
  'Latest Jobs',
  'Government Jobs',
  'Private Jobs',
  'Bank Jobs',
  'Internships',
  'Scholarships',
  'Admissions',
  'Results / Test Updates',
  'Deadline Alerts',
  'Career News',
  'Government Schemes',
]

const SITE_PRODUCTION_URL = SITE_URL

export default function AdminPage() {
  useSeo({
    title: 'CareerDost CMS Admin Panel',
    description: 'Manage Pakistan jobs, scholarships, daily updates, admissions, and SEO content.',
    noIndex: true,
  })

  const [token, setToken] = useState(() => localStorage.getItem('careerdost_admin_token') || '')
  const [usernameInput, setUsernameInput] = useState('')
  const [passwordInput, setPasswordInput] = useState('')
  const [loginError, setLoginError] = useState('')
  const [loading, setLoading] = useState(false)

  const [stats, setStats] = useState(null)
  const [activeTab, setActiveTab] = useState('updates') // 'updates' | 'articles' | 'categories' | 'updateForm' | 'articleForm' | 'categoryForm'

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all') // 'all' | 'published' | 'draft' | 'open' | 'expired'

  const [articles, setArticles] = useState([])
  const [updates, setUpdates] = useState([])
  const [categories, setCategories] = useState([])

  const [editingArticle, setEditingArticle] = useState(null)
  const [editingUpdate, setEditingUpdate] = useState(null)
  const [editingCategory, setEditingCategory] = useState(null)
  const [previewUpdate, setPreviewUpdate] = useState(null)
  const [previewArticle, setPreviewArticle] = useState(null)
  const [uploadingImage, setUploadingImage] = useState(false)
  const [formMsg, setFormMsg] = useState('')
  const [nanoPromptBox, setNanoPromptBox] = useState('')

  // Daily Update / Item Form State
  const [updateForm, setUpdateForm] = useState({
    title: '',
    slug: '',
    contentType: '',
    category: 'Latest Jobs',
    shortDescription: '',
    content: '',
    organization: '',
    location: '',
    qualification: '',
    experience: '',
    positions: '',
    jobType: 'Full Time',
    salary: '',
    officialLink: '',
    applyLink: '',
    deadline: '',
    noDeadline: false,
    isVerified: false,
    featured: false,
    featuredImage: '',
    imageAlt: '',
    publishDate: new Date().toISOString().slice(0, 16),
    seoTitle: '',
    metaDescription: '',
    focusKeyword: '',
    canonicalUrl: '',
    ogTitle: '',
    ogDescription: '',
    status: 'published',
  })

  // Article Form State
  const [articleForm, setArticleForm] = useState({
    title: '',
    slug: '',
    contentType: '',
    category: 'government-jobs',
    organization: '',
    jobType: 'Full Time',
    location: '',
    qualification: '',
    experience: '',
    positions: '',
    salary: '',
    lastDate: '',
    noDeadline: false,
    publishDate: new Date().toISOString().split('T')[0],
    officialLink: '',
    applyLink: '',
    isVerified: false,
    featured: false,
    logoInitial: '',
    featuredImage: '',
    imageAlt: '',
    excerpt: '',
    content: '',
    seoTitle: '',
    metaDescription: '',
    focusKeyword: '',
    canonicalUrl: '',
    ogTitle: '',
    ogDescription: '',
    status: 'published',
  })

  // Category Form State
  const [categoryForm, setCategoryForm] = useState({
    slug: '',
    label: '',
    short: '',
    tone: 'slate',
    description: '',
  })

  const activeUpdateType = updateForm.contentType || getContentType(updateForm)
  const updateLabels = getContentTypeLabels(activeUpdateType)

  const activeArticleType = articleForm.contentType || getContentType(articleForm)
  const articleLabels = getContentTypeLabels(activeArticleType)

  useEffect(() => {
    if (token) {
      loadDashboardData()
    }
  }, [token])

  const loadDashboardData = async () => {
    try {
      const statsRes = await adminGetStats(token)
      if (statsRes.success) setStats(statsRes.data)

      const catsRes = await getCategoriesFromDb()
      if (catsRes) setCategories(catsRes)

      const artsRes = await adminGetArticles(token, '')
      if (artsRes.success) setArticles(artsRes.data)

      const updsRes = await adminGetUpdates(token, '')
      if (updsRes.success) setUpdates(updsRes.data)
    } catch (err) {
      if (err.message?.includes('401') || err.message?.includes('Unauthorized')) {
        handleLogout()
      }
    }
  }

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoginError('')
    setLoading(true)
    try {
      const res = await adminLogin(usernameInput, passwordInput)
      if (res.success && res.data?.token) {
        localStorage.setItem('careerdost_admin_token', res.data.token)
        setToken(res.data.token)
        setPasswordInput('')
      } else {
        setLoginError(res.error || 'Login failed. Please verify credentials.')
      }
    } catch (err) {
      setLoginError(err.message || 'Login error occurred.')
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = async () => {
    try {
      await adminLogout()
    } catch {
      // Ignore
    }
    localStorage.removeItem('careerdost_admin_token')
    setToken('')
    setStats(null)
    setPasswordInput('')
  }

  // Slug generator helper
  const generateSlug = (text) => {
    return text
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '')
  }

  // Toolbar Injectors for Content Editor
  const insertFormatting = (targetForm, setFormState, tagOpen, tagClose = '', placeholder = '') => {
    const current = targetForm.content || ''
    const injection = `${tagOpen}${placeholder}${tagClose}`
    setFormState((prev) => ({
      ...prev,
      content: current ? `${current}\n\n${injection}` : injection,
    }))
  }

  const insertTableTemplate = (targetForm, setFormState) => {
    const tableHtml = `<table className="w-full border border-line my-4 text-sm font-sans">
  <thead>
    <tr className="bg-paper border-b border-line">
      <th className="p-2.5 text-left font-bold">Position / Scale</th>
      <th className="p-2.5 text-left font-bold">Qualification</th>
      <th className="p-2.5 text-left font-bold">Vacancies</th>
    </tr>
  </thead>
  <tbody className="divide-y divide-line">
    <tr>
      <td className="p-2.5">Assistant Director (BPS-17)</td>
      <td className="p-2.5">Master's / Sixteen Years Education</td>
      <td className="p-2.5">12 Posts</td>
    </tr>
    <tr>
      <td className="p-2.5">Inspector (BPS-16)</td>
      <td className="p-2.5">Bachelor's Degree (Four Years)</td>
      <td className="p-2.5">25 Posts</td>
    </tr>
  </tbody>
</table>`
    insertFormatting(targetForm, setFormState, tableHtml)
  }

  const insertNoticeBoxTemplate = (targetForm, setFormState) => {
    const noticeHtml = `<div className="border-l-4 border-green bg-green-light p-4 my-4 font-sans text-sm text-green">
  <strong>Important Verification Notice:</strong> Applicants are instructed to verify documents on the official department portal before submitting fees.
</div>`
    insertFormatting(targetForm, setFormState, noticeHtml)
  }

  // Daily Updates Handlers
  const handleOpenUpdateForm = (upd = null) => {
    setFormMsg('')
    setNanoPromptBox('')
    if (upd) {
      setEditingUpdate(upd)
      setUpdateForm({
        title: upd.title || '',
        slug: upd.slug || '',
        category: upd.category || 'Latest Jobs',
        shortDescription: upd.shortDescription || '',
        content: Array.isArray(upd.content) ? upd.content.join('\n\n') : upd.content || '',
        organization: upd.organization || '',
        location: upd.location || '',
        qualification: upd.qualification || '',
        experience: upd.experience || '',
        positions: upd.positions || '',
        jobType: upd.jobType || 'Full Time',
        salary: upd.salary || '',
        officialLink: upd.officialLink || '',
        applyLink: upd.applyLink || '',
        deadline: upd.deadline || '',
        noDeadline: Boolean(upd.noDeadline),
        isVerified: Boolean(upd.isVerified),
        featured: Boolean(upd.featured),
        featuredImage: upd.featuredImage || '',
        imageAlt: upd.imageAlt || '',
        publishDate: upd.publishDate ? upd.publishDate.slice(0, 16) : new Date().toISOString().slice(0, 16),
        seoTitle: upd.seoTitle || upd.title || '',
        metaDescription: upd.metaDescription || upd.shortDescription || '',
        focusKeyword: upd.focusKeyword || '',
        canonicalUrl: upd.canonicalUrl || `${SITE_PRODUCTION_URL}/daily-updates/${upd.slug}`,
        ogTitle: upd.ogTitle || upd.seoTitle || upd.title || '',
        ogDescription: upd.ogDescription || upd.metaDescription || upd.shortDescription || '',
        status: upd.status || 'published',
      })
    } else {
      setEditingUpdate(null)
      const defaultSlug = generateSlug('new-update')
      setUpdateForm({
        title: '',
        slug: '',
        category: 'Latest Jobs',
        shortDescription: '',
        content: '',
        organization: '',
        location: '',
        qualification: '',
        experience: '',
        positions: '',
        jobType: 'Full Time',
        salary: '',
        officialLink: '',
        applyLink: '',
        deadline: '',
        noDeadline: false,
        isVerified: false,
        featured: false,
        featuredImage: '',
        imageAlt: '',
        publishDate: new Date().toISOString().slice(0, 16),
        seoTitle: '',
        metaDescription: '',
        focusKeyword: '',
        canonicalUrl: `${SITE_PRODUCTION_URL}/daily-updates/`,
        ogTitle: '',
        ogDescription: '',
        status: 'published',
      })
    }
    setActiveTab('updateForm')
  }

  const handleImageFileChange = async (e, setFormState) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploadingImage(true)
    setFormMsg('')

    try {
      const res = await adminUploadImage(token, file)
      if (res.success && res.data?.url) {
        setFormState((prev) => ({
          ...prev,
          featuredImage: res.data.url,
          imageAlt: prev.imageAlt || file.name.split('.')[0].replace(/[-_]/g, ' '),
        }))
        setFormMsg('✅ Image uploaded successfully!')
      } else {
        setFormMsg(`❌ Image upload failed: ${res.error || 'Server error'}`)
      }
    } catch (err) {
      setFormMsg(`❌ Image upload error: ${err.message}`)
    } finally {
      setUploadingImage(false)
    }
  }

  // Pre-Publish Quality, Safety & Transparency Validator
  const validatePrePublish = (form, isArticle, existingList, currentEditingSlug) => {
    const errors = []
    const warnings = []

    // 1. Title & Slug
    if (!form.title || form.title.trim().length < 5) {
      errors.push('Title must be at least 5 characters long.')
    }
    const slug = (form.slug || generateSlug(form.title || '')).trim()
    if (!slug) {
      errors.push('A valid URL slug is required.')
    }

    // 2. Duplicate Detection
    const duplicate = (existingList || []).find((item) => {
      if (currentEditingSlug && item.slug === currentEditingSlug) return false
      return item.slug === slug || (item.title && item.title.toLowerCase().trim() === (form.title || '').toLowerCase().trim())
    })
    if (duplicate) {
      errors.push(`Duplicate detected: An existing ${isArticle ? 'article' : 'update'} already uses slug "${duplicate.slug}".`)
    }

    // 3. Official Source Verification
    if (form.isVerified) {
      if (!form.officialLink || !form.officialLink.trim()) {
        errors.push('Listing is marked as "Official Source Verified", but no Official Source Link is provided. You must provide a valid official URL.')
      } else if (!/^https?:\/\//i.test(form.officialLink.trim())) {
        errors.push('Official Source Link must start with http:// or https://')
      }
    }

    // 4. AI Content and Hallucination Check
    const rawContent = Array.isArray(form.content) ? form.content.join('\n') : form.content || ''
    const aiPhrases = [
      'as an ai language model',
      'i cannot guarantee',
      'insert date here',
      'insert link here',
      'lorem ipsum',
      '[insert ',
      '{insert '
    ]
    for (const phrase of aiPhrases) {
      if (rawContent.toLowerCase().includes(phrase)) {
        errors.push(`Unreviewed AI placeholder found in content body: "${phrase}". Please review and edit before publishing.`)
      }
    }

    // 5. Short Description / Excerpt Check
    const desc = form.excerpt || form.shortDescription || ''
    if (!desc || desc.trim().length < 20) {
      warnings.push('Short description / summary is very short. Provide at least 20 characters for clean SEO snippet display.')
    }

    return { errors, warnings }
  }

  const handleGenerateNanoPrompt = (title, category, org = '') => {
    const prompt = `Editorial 16:9 featured banner for CareerDost (Pakistani career & opportunities portal). Topic: "${title || 'Career Opportunity'}" (${category}${org ? ', ' + org : ''}). Palette: Deep forest green (#059669 / #064e3b), clean off-white background (#faf9f6), subtle gold accents. Clean architectural lines, professional Pakistan public institution aesthetic, modern flat editorial illustration style. Highly professional, zero watermark, strictly no hallucinated or unverified text.`
    setNanoPromptBox(prompt)
  }

  const handleAutoSeoSuggestions = (targetForm, setFormState, isArticle = true) => {
    const title = (targetForm.title || '').trim()
    const org = (targetForm.organization || '').trim()
    const slug = (targetForm.slug || generateSlug(title)).trim()
    const category = targetForm.category || 'Career Opportunity'

    // Clean, high-CTR SEO Title between 45 and 58 characters
    let cleanT = title.replace(/\s*\|\s*CareerDost\s*$/i, '').replace(/\s*—\s*CareerDost\s*$/i, '').trim()
    if (cleanT.includes('–') || cleanT.includes('—') || cleanT.includes(' - ')) {
      const parts = cleanT.split(/\s*[–—-]\s*/)
      if (parts[0].trim().length >= 15 && `${parts[0].trim()} — CareerDost`.length <= 60) {
        cleanT = parts[0].trim()
      }
    }
    let suggestedTitle = `${cleanT} — CareerDost`
    if (suggestedTitle.length > 60) {
      suggestedTitle = cleanT.slice(0, 46).trim() + ' — CareerDost'
    }

    // High-CTR Meta Description between 140 and 155 characters
    let descBase = (targetForm.excerpt || targetForm.shortDescription || '').trim()
    if (!descBase || descBase.length < 50) {
      descBase = `Explore verified details for ${cleanT}${org ? ' announced by ' + org : ''}. Check eligibility, qualification requirements, and apply online on CareerDost.`
    }
    if (descBase.length > 155) {
      descBase = descBase.slice(0, 152).trim() + '...'
    }

    const suggestedAlt = `${cleanT}${org ? ' — ' + org : ''} Official Announcement CareerDost`.slice(0, 150)
    const suggestedKeyword = cleanT.split(' ').slice(0, 4).join(' ')
    const canonicalUrl = `${SITE_PRODUCTION_URL}/${isArticle ? 'jobs' : 'daily-updates'}/${slug}`

    setFormState((prev) => ({
      ...prev,
      seoTitle: suggestedTitle,
      metaDescription: descBase,
      imageAlt: prev.imageAlt || suggestedAlt,
      focusKeyword: prev.focusKeyword || suggestedKeyword,
      canonicalUrl: canonicalUrl,
      ogTitle: suggestedTitle,
      ogDescription: descBase,
    }))

    handleGenerateNanoPrompt(cleanT, category, org)
    setFormMsg('✨ Automatic SEO & Image Alt suggestions generated based on verified content.')
  }

  const handleSaveUpdate = async (targetStatus = 'published') => {
    setFormMsg('')
    if (targetStatus === 'published') {
      const validation = validatePrePublish(updateForm, false, updates, editingUpdate?.slug)
      if (validation.errors.length > 0) {
        setFormMsg(`❌ Pre-publish check failed: ${validation.errors.join(' | ')}`)
        return
      }
    }

    try {
      const finalSlug = updateForm.slug || generateSlug(updateForm.title)
      const payload = {
        ...updateForm,
        slug: finalSlug,
        canonicalUrl: updateForm.canonicalUrl || `${SITE_PRODUCTION_URL}/daily-updates/${finalSlug}`,
        status: targetStatus,
        content: updateForm.content.split('\n\n').filter((p) => p.trim()),
      }

      let res
      if (editingUpdate) {
        res = await adminUpdateUpdate(token, editingUpdate.slug, payload)
      } else {
        res = await adminCreateUpdate(token, payload)
      }

      if (res.success) {
        setFormMsg(
          targetStatus === 'published'
            ? 'Daily Update published successfully!'
            : 'Daily Update saved as draft!'
        )
        await loadDashboardData()
        setTimeout(() => setActiveTab('updates'), 1000)
      } else {
        setFormMsg(`Error: ${res.error || 'Failed to save update'}`)
      }
    } catch (err) {
      setFormMsg(`Error: ${err.message}`)
    }
  }

  const handleToggleUpdateStatus = async (slug, currentStatus) => {
    const newStatus = currentStatus === 'published' ? 'draft' : 'published'
    try {
      const res = await adminToggleUpdateStatus(token, slug, newStatus)
      if (res.success) loadDashboardData()
      else alert(res.error || 'Failed to toggle status')
    } catch (err) {
      alert(err.message)
    }
  }

  const handleDeleteUpdate = async (slug) => {
    if (!window.confirm(`Are you sure you want to permanently delete daily update "${slug}"?`)) return
    try {
      const res = await adminDeleteUpdate(token, slug)
      if (res.success) loadDashboardData()
      else alert(res.error || 'Failed to delete update')
    } catch (err) {
      alert(err.message)
    }
  }

  // Article Handlers
  const handleOpenArticleForm = (art = null) => {
    setFormMsg('')
    setNanoPromptBox('')
    if (art) {
      setEditingArticle(art)
      setArticleForm({
        title: art.title || '',
        slug: art.slug || '',
        category: art.category || categories[0]?.slug || 'government-jobs',
        organization: art.organization || '',
        jobType: art.jobType || 'Full Time',
        location: art.location || '',
        qualification: art.qualification || '',
        experience: art.experience || '',
        positions: art.positions || '',
        salary: art.salary || '',
        lastDate: art.lastDate || '',
        noDeadline: Boolean(art.noDeadline),
        publishDate: art.publishDate || new Date().toISOString().split('T')[0],
        officialLink: art.officialLink || '',
        applyLink: art.applyLink || '',
        isVerified: Boolean(art.isVerified),
        featured: Boolean(art.featured),
        logoInitial: art.logoInitial || '',
        featuredImage: art.featuredImage || '',
        imageAlt: art.imageAlt || '',
        excerpt: art.excerpt || '',
        content: Array.isArray(art.content) ? art.content.join('\n\n') : art.content || '',
        seoTitle: art.seoTitle || art.title || '',
        metaDescription: art.metaDescription || art.excerpt || '',
        focusKeyword: art.focusKeyword || '',
        canonicalUrl: art.canonicalUrl || `${SITE_PRODUCTION_URL}/jobs/${art.slug}`,
        ogTitle: art.ogTitle || art.seoTitle || art.title || '',
        ogDescription: art.ogDescription || art.metaDescription || art.excerpt || '',
        status: art.status || 'published',
      })
    } else {
      setEditingArticle(null)
      setArticleForm({
        title: '',
        slug: '',
        category: categories[0]?.slug || 'government-jobs',
        organization: '',
        jobType: 'Full Time',
        location: '',
        qualification: '',
        experience: '',
        positions: '',
        salary: '',
        lastDate: '',
        noDeadline: false,
        publishDate: new Date().toISOString().split('T')[0],
        officialLink: '',
        applyLink: '',
        isVerified: false,
        featured: false,
        logoInitial: '',
        featuredImage: '',
        imageAlt: '',
        excerpt: '',
        content: '',
        seoTitle: '',
        metaDescription: '',
        focusKeyword: '',
        canonicalUrl: `${SITE_PRODUCTION_URL}/jobs/`,
        ogTitle: '',
        ogDescription: '',
        status: 'published',
      })
    }
    setActiveTab('articleForm')
  }

  const handleSaveArticle = async (targetStatus = 'published') => {
    setFormMsg('')
    if (targetStatus === 'published') {
      const validation = validatePrePublish(articleForm, true, articles, editingArticle?.slug)
      if (validation.errors.length > 0) {
        setFormMsg(`❌ Pre-publish check failed: ${validation.errors.join(' | ')}`)
        return
      }
    }

    try {
      const finalSlug = articleForm.slug || generateSlug(articleForm.title)
      const payload = {
        ...articleForm,
        slug: finalSlug,
        canonicalUrl: articleForm.canonicalUrl || `${SITE_PRODUCTION_URL}/jobs/${finalSlug}`,
        status: targetStatus,
        content: articleForm.content.split('\n\n').filter((p) => p.trim()),
      }

      let res
      if (editingArticle) {
        res = await adminUpdateArticle(token, editingArticle.slug, payload)
      } else {
        res = await adminCreateArticle(token, payload)
      }

      if (res.success) {
        setFormMsg(
          targetStatus === 'published'
            ? 'Article published successfully!'
            : 'Article saved as draft!'
        )
        await loadDashboardData()
        setTimeout(() => setActiveTab('articles'), 1000)
      } else {
        setFormMsg(`Error: ${res.error || 'Failed to save article'}`)
      }
    } catch (err) {
      setFormMsg(`Error: ${err.message}`)
    }
  }

  const handleToggleArticleStatus = async (slug, currentStatus) => {
    const newStatus = currentStatus === 'published' ? 'draft' : 'published'
    try {
      const res = await adminToggleArticleStatus(token, slug, newStatus)
      if (res.success) loadDashboardData()
      else alert(res.error || 'Failed to toggle status')
    } catch (err) {
      alert(err.message)
    }
  }

  const handleDeleteArticle = async (slug) => {
    if (!window.confirm(`Are you sure you want to delete article "${slug}"?`)) return
    try {
      const res = await adminDeleteArticle(token, slug)
      if (res.success) loadDashboardData()
      else alert(res.error || 'Failed to delete article')
    } catch (err) {
      alert(err.message)
    }
  }

  // Category Handlers
  const handleOpenCategoryForm = (cat = null) => {
    setFormMsg('')
    if (cat) {
      setEditingCategory(cat)
      setCategoryForm({
        slug: cat.slug || '',
        label: cat.label || '',
        short: cat.short || '',
        tone: cat.tone || 'slate',
        description: cat.description || '',
      })
    } else {
      setEditingCategory(null)
      setCategoryForm({
        slug: '',
        label: '',
        short: '',
        tone: 'slate',
        description: '',
      })
    }
    setActiveTab('categoryForm')
  }

  const handleSaveCategory = async (e) => {
    e.preventDefault()
    setFormMsg('')
    try {
      let res
      if (editingCategory) {
        res = await adminUpdateCategory(token, editingCategory.slug, categoryForm)
      } else {
        res = await adminCreateCategory(token, categoryForm)
      }

      if (res.success) {
        setFormMsg(editingCategory ? 'Category updated!' : 'Category created!')
        await loadDashboardData()
        setTimeout(() => setActiveTab('categories'), 1000)
      } else {
        setFormMsg(`Error: ${res.error || 'Failed to save category'}`)
      }
    } catch (err) {
      setFormMsg(`Error: ${err.message}`)
    }
  }

  const handleDeleteCategory = async (slug) => {
    if (!window.confirm(`Are you sure you want to delete category "${slug}"?`)) return
    try {
      const res = await adminDeleteCategory(token, slug)
      if (res.success) loadDashboardData()
      else alert(res.error || 'Failed to delete category')
    } catch (err) {
      alert(err.message)
    }
  }

  // Filter Helper
  const filterContentList = (list) => {
    return list.filter((item) => {
      // Search text
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim()
        const text = [item.title, item.slug, item.organization, item.category].join(' ').toLowerCase()
        if (!text.includes(q)) return false
      }

      // Category Filter
      if (categoryFilter !== 'all' && item.category !== categoryFilter && item.category_slug !== categoryFilter) {
        return false
      }

      // Status Filter
      if (statusFilter === 'published' && item.status !== 'published') return false
      if (statusFilter === 'draft' && item.status !== 'draft') return false
      
      const deadlineVal = item.deadline || item.lastDate
      const oppStatus = getOpportunityStatus(deadlineVal, item.noDeadline)
      if (statusFilter === 'open' && oppStatus.isExpired) return false
      if (statusFilter === 'expired' && !oppStatus.isExpired) return false

      return true
    })
  }

  // Unauthenticated Login Form
  if (!token) {
    return (
      <div className="container-x py-12 max-w-md font-sans">
        <div className="border border-line bg-white p-6 shadow-md rounded-xs">
          <div className="text-center mb-6 border-b border-line pb-4">
            <h1 className="font-serif text-2xl font-bold text-ink">CareerDost CMS Login</h1>
            <p className="text-xs text-inksoft mt-1">Professional Pakistan Opportunity Management System</p>
          </div>

          {loginError && (
            <div className="bg-brick-light text-brick text-xs font-semibold p-3 mb-4 border border-brick/30 rounded-xs">
              ⚠️ {loginError}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4 text-sm">
            <div>
              <label className="block text-inksoft font-medium mb-1">Username / Access Key</label>
              <input
                type="text"
                value={usernameInput}
                onChange={(e) => setUsernameInput(e.target.value)}
                className="w-full border border-line p-2.5 bg-paper focus:bg-white focus:border-green transition-colors"
                required
              />
            </div>
            <div>
              <label className="block text-inksoft font-medium mb-1">Password</label>
              <input
                type="password"
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                className="w-full border border-line p-2.5 bg-paper focus:bg-white focus:border-green transition-colors"
                required
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-green text-white py-3 font-bold hover:bg-green-dark transition-all disabled:opacity-50 shadow-xs"
            >
              {loading ? 'Authenticating Session...' : 'Sign In to CMS Portal →'}
            </button>
          </form>

          <div className="mt-6 border-t border-line pt-4 text-[11px] text-inksoft text-center">
            🔒 Protected by HMAC SHA-256 server-side authentication &amp; HttpOnly cookie sessions.
          </div>
        </div>
      </div>
    )
  }

  const filteredUpdates = filterContentList(updates)
  const filteredArticles = filterContentList(articles)

  return (
    <div className="container-x py-8 font-sans">
      {/* Top Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6 border-b border-line pb-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-green-light border border-green/30 text-green text-[11px] font-bold rounded-full uppercase tracking-wider mb-1">
            <span className="w-1.5 h-1.5 rounded-full bg-green animate-pulse"></span>
            CareerDost CMS v2.0 Active
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-ink">CMS Content Dashboard</h1>
          <p className="text-xs text-inksoft">Create, manage, verify, and publish Pakistan daily career opportunities</p>
        </div>
        <div className="flex items-center gap-3">
          <a
            href={SITE_PRODUCTION_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="border border-line bg-paper text-ink hover:text-green text-xs font-semibold px-3 py-1.5"
          >
            🌐 View Production Site ↗
          </a>
          <button
            onClick={handleLogout}
            className="border border-brick/40 text-brick hover:bg-brick hover:text-white px-3 py-1.5 text-xs font-semibold transition-colors"
          >
            Sign Out
          </button>
        </div>
      </div>

      {/* Stats Counter Bar */}
      {stats && (
        <div className="grid grid-cols-2 sm:grid-cols-6 gap-3 mb-6 text-xs">
          <div className="border border-line bg-white p-3 rounded-xs">
            <span className="block text-inksoft uppercase tracking-wider text-[10px]">Total Updates</span>
            <span className="font-serif text-2xl font-bold text-green">{stats.totalUpdates || 0}</span>
          </div>
          <div className="border border-line bg-white p-3 rounded-xs">
            <span className="block text-inksoft uppercase tracking-wider text-[10px]">Published</span>
            <span className="font-serif text-2xl font-bold text-emerald-600">{stats.publishedUpdates || 0}</span>
          </div>
          <div className="border border-line bg-white p-3 rounded-xs">
            <span className="block text-inksoft uppercase tracking-wider text-[10px]">Job Articles</span>
            <span className="font-serif text-2xl font-bold text-ink">{stats.totalArticles || 0}</span>
          </div>
          <div className="border border-line bg-white p-3 rounded-xs">
            <span className="block text-inksoft uppercase tracking-wider text-[10px]">Drafts</span>
            <span className="font-serif text-2xl font-bold text-gold font-sans font-bold">
              {(stats.draftArticles || 0) + (stats.draftUpdates || 0)}
            </span>
          </div>
          <div className="border border-line bg-white p-3 rounded-xs">
            <span className="block text-inksoft uppercase tracking-wider text-[10px]">Featured</span>
            <span className="font-serif text-2xl font-bold text-amber-500">⭐ {stats.featuredArticles || 0}</span>
          </div>
          <div className="border border-line bg-white p-3 rounded-xs">
            <span className="block text-inksoft uppercase tracking-wider text-[10px]">Categories</span>
            <span className="font-serif text-2xl font-bold text-ink">{stats.totalCategories || 0}</span>
          </div>
        </div>
      )}

      {/* Navigation Tabs & Primary CTAs */}
      <div className="flex flex-wrap items-center justify-between border-b border-line mb-6 text-sm gap-2">
        <div className="flex gap-1 overflow-x-auto">
          <button
            onClick={() => setActiveTab('updates')}
            className={`px-4 py-2 border-b-2 font-bold transition-colors ${
              activeTab === 'updates' ? 'border-green text-green bg-green/5' : 'border-transparent text-inksoft hover:text-ink'
            }`}
          >
            Daily Updates ({updates.length})
          </button>
          <button
            onClick={() => setActiveTab('articles')}
            className={`px-4 py-2 border-b-2 font-bold transition-colors ${
              activeTab === 'articles' ? 'border-green text-green bg-green/5' : 'border-transparent text-inksoft hover:text-ink'
            }`}
          >
            Job Articles ({articles.length})
          </button>
          <button
            onClick={() => setActiveTab('categories')}
            className={`px-4 py-2 border-b-2 font-bold transition-colors ${
              activeTab === 'categories' ? 'border-green text-green bg-green/5' : 'border-transparent text-inksoft hover:text-ink'
            }`}
          >
            Categories ({categories.length})
          </button>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => handleOpenUpdateForm()}
            className="border border-green bg-green text-white px-4 py-2 text-xs font-bold hover:bg-green-dark shadow-xs"
          >
            + Create Daily Update
          </button>
          <button
            onClick={() => handleOpenArticleForm()}
            className="border border-line bg-white text-ink px-4 py-2 text-xs font-bold hover:border-green hover:text-green"
          >
            + Create Job Article
          </button>
        </div>
      </div>

      {/* FILTER & SEARCH BAR */}
      {(activeTab === 'updates' || activeTab === 'articles') && (
        <div className="bg-paper border border-line p-4 mb-6 rounded-xs flex flex-wrap items-center justify-between gap-4 text-xs">
          <div className="flex flex-wrap items-center gap-3 flex-1 min-w-[280px]">
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search title, organization, or keyword..."
              className="border border-line p-2 bg-white text-ink text-xs min-w-[200px] flex-1"
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery('')} className="text-inksoft hover:text-ink font-bold">
                Clear
              </button>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <span className="text-inksoft font-semibold">Filter:</span>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="border border-line bg-white p-2 text-xs"
            >
              <option value="all">All Categories</option>
              {UPDATE_CATEGORIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>

            <div className="flex items-center gap-1 border border-line bg-white p-1 rounded-xs">
              {['all', 'published', 'draft', 'open', 'expired'].map((st) => (
                <button
                  key={st}
                  onClick={() => setStatusFilter(st)}
                  className={`px-2.5 py-1 uppercase font-bold text-[10px] rounded-xs ${
                    statusFilter === st ? 'bg-green text-white' : 'text-inksoft hover:text-ink'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* DAILY UPDATES LIST TABLE */}
      {activeTab === 'updates' && (
        <div className="border border-line bg-white overflow-x-auto shadow-xs">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-line bg-paper text-inksoft text-xs uppercase tracking-wider">
              <tr>
                <th className="p-3">Title &amp; Info</th>
                <th className="p-3">Category</th>
                <th className="p-3">Verified</th>
                <th className="p-3">Deadline Status</th>
                <th className="p-3">Status</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line text-xs">
              {filteredUpdates.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-inksoft">
                    No daily updates matching the selected filter criteria.
                  </td>
                </tr>
              ) : (
                filteredUpdates.map((upd) => {
                  const oppStatus = getOpportunityStatus(upd.deadline, upd.noDeadline)
                  return (
                    <tr key={upd.slug} className="hover:bg-paper/60">
                      <td className="p-3 max-w-sm">
                        <div className="font-bold text-ink text-sm leading-snug">{upd.title}</div>
                        <div className="text-inksoft truncate mt-0.5 font-mono text-[11px]">
                          {upd.organization ? `${upd.organization} • ` : ''}/daily-updates/{upd.slug}
                        </div>
                      </td>
                      <td className="p-3">
                        <span className="font-semibold px-2 py-0.5 bg-paper border border-line text-ink">
                          {upd.category}
                        </span>
                      </td>
                      <td className="p-3">
                        {upd.isVerified ? (
                          <span className="inline-flex items-center gap-1 text-emerald-700 bg-emerald-50 px-2 py-0.5 border border-emerald-300 font-bold">
                            ✓ Verified
                          </span>
                        ) : (
                          <span className="text-inksoft">Unverified</span>
                        )}
                      </td>
                      <td className="p-3">
                        <span className={`inline-block px-2.5 py-0.5 text-[11px] border font-bold ${oppStatus.badgeClass}`}>
                          {oppStatus.label}
                        </span>
                      </td>
                      <td className="p-3">
                        {upd.status === 'published' ? (
                          <span className="bg-green-light text-green px-2 py-0.5 border border-green/20 font-bold">
                            Published
                          </span>
                        ) : (
                          <span className="bg-gold/10 text-gold-dark px-2 py-0.5 border border-gold/20 font-bold">
                            Draft
                          </span>
                        )}
                      </td>
                      <td className="p-3 text-right space-x-2">
                        <button
                          onClick={() => setPreviewUpdate(upd)}
                          className="text-inksoft hover:text-green underline"
                        >
                          Preview
                        </button>
                        <button
                          onClick={() => handleToggleUpdateStatus(upd.slug, upd.status)}
                          className="text-inksoft hover:text-green underline"
                        >
                          {upd.status === 'published' ? 'Unpublish' : 'Publish'}
                        </button>
                        <button
                          onClick={() => handleOpenUpdateForm(upd)}
                          className="border border-line px-2.5 py-1 bg-white hover:border-green hover:text-green font-bold"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteUpdate(upd.slug)}
                          className="text-brick hover:underline font-semibold"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* JOB ARTICLES LIST TABLE */}
      {activeTab === 'articles' && (
        <div className="border border-line bg-white overflow-x-auto shadow-xs">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-line bg-paper text-inksoft text-xs uppercase tracking-wider">
              <tr>
                <th className="p-3">Title &amp; Organization</th>
                <th className="p-3">Category</th>
                <th className="p-3">Verified</th>
                <th className="p-3">Deadline Status</th>
                <th className="p-3">Status</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line text-xs">
              {filteredArticles.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-inksoft">
                    No articles matching selected filter criteria.
                  </td>
                </tr>
              ) : (
                filteredArticles.map((art) => {
                  const oppStatus = getOpportunityStatus(art.lastDate, art.noDeadline)
                  return (
                    <tr key={art.slug} className="hover:bg-paper/60">
                      <td className="p-3 max-w-sm">
                        <div className="font-bold text-ink text-sm leading-snug">
                          {art.featured ? '⭐ ' : ''}{art.title}
                        </div>
                        <div className="text-inksoft truncate mt-0.5 font-mono text-[11px]">
                          {art.organization} • /jobs/{art.slug}
                        </div>
                      </td>
                      <td className="p-3 text-inksoft font-medium">{art.category}</td>
                      <td className="p-3">
                        {art.isVerified ? (
                          <span className="inline-flex items-center gap-1 text-emerald-700 bg-emerald-50 px-2 py-0.5 border border-emerald-300 font-bold">
                            ✓ Verified
                          </span>
                        ) : (
                          <span className="text-inksoft">Unverified</span>
                        )}
                      </td>
                      <td className="p-3">
                        <span className={`inline-block px-2.5 py-0.5 text-[11px] border font-bold ${oppStatus.badgeClass}`}>
                          {oppStatus.label}
                        </span>
                      </td>
                      <td className="p-3">
                        {art.status === 'published' ? (
                          <span className="bg-green-light text-green px-2 py-0.5 border border-green/20 font-bold">
                            Published
                          </span>
                        ) : (
                          <span className="bg-gold/10 text-gold-dark px-2 py-0.5 border border-gold/20 font-bold">
                            Draft
                          </span>
                        )}
                      </td>
                      <td className="p-3 text-right space-x-2">
                        <button
                          onClick={() => setPreviewArticle(art)}
                          className="text-inksoft hover:text-green underline"
                        >
                          Preview
                        </button>
                        <button
                          onClick={() => handleToggleArticleStatus(art.slug, art.status)}
                          className="text-inksoft hover:text-green underline"
                        >
                          {art.status === 'published' ? 'Unpublish' : 'Publish'}
                        </button>
                        <button
                          onClick={() => handleOpenArticleForm(art)}
                          className="border border-line px-2.5 py-1 bg-white hover:border-green hover:text-green font-bold"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteArticle(art.slug)}
                          className="text-brick hover:underline font-semibold"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* CATEGORIES LIST TABLE */}
      {activeTab === 'categories' && (
        <div className="border border-line bg-white overflow-x-auto shadow-xs">
          <div className="p-4 border-b border-line flex justify-between items-center bg-paper">
            <h3 className="font-serif font-bold text-base text-ink">Active Categories</h3>
            <button
              onClick={() => handleOpenCategoryForm()}
              className="bg-green text-white px-3 py-1.5 text-xs font-bold"
            >
              + Add Category
            </button>
          </div>
          <table className="w-full text-left text-sm">
            <thead className="border-b border-line bg-paper text-inksoft text-xs uppercase tracking-wider">
              <tr>
                <th className="p-3">Label</th>
                <th className="p-3">Slug</th>
                <th className="p-3">Tone</th>
                <th className="p-3">Description</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line text-xs">
              {categories.map((cat) => (
                <tr key={cat.slug} className="hover:bg-paper/50">
                  <td className="p-3 font-bold text-ink">{cat.label}</td>
                  <td className="p-3 text-inksoft font-mono">{cat.slug}</td>
                  <td className="p-3 uppercase font-semibold">{cat.tone}</td>
                  <td className="p-3 text-inksoft max-w-xs truncate">{cat.description}</td>
                  <td className="p-3 text-right space-x-2">
                    <button
                      onClick={() => handleOpenCategoryForm(cat)}
                      className="border border-line px-2.5 py-1 bg-white hover:border-green font-bold"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteCategory(cat.slug)}
                      className="text-brick hover:underline font-semibold"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* CREATE / EDIT DAILY UPDATE FORM */}
      {activeTab === 'updateForm' && (
        <div className="border border-line bg-white p-6 max-w-5xl shadow-sm rounded-xs">
          <div className="flex items-center justify-between border-b border-line pb-4 mb-6">
            <div>
              <h2 className="font-serif text-2xl font-bold text-ink">
                {editingUpdate ? 'Edit Daily Opportunity Update' : 'Create Daily Opportunity Update'}
              </h2>
              <p className="text-xs text-inksoft mt-0.5">Fill out opportunity details, source links, featured image, and SEO metadata</p>
            </div>
            <button
              onClick={() => setActiveTab('updates')}
              className="text-xs text-inksoft hover:text-ink font-bold border border-line px-3 py-1.5"
            >
              ← Cancel &amp; Return
            </button>
          </div>

          {formMsg && (
            <div
              className={`p-3.5 mb-6 text-xs font-bold border rounded-xs ${
                formMsg.includes('Error') || formMsg.includes('❌')
                  ? 'bg-brick-light text-brick border-brick/30'
                  : 'bg-green-light text-green border-green/30'
              }`}
            >
              {formMsg}
            </div>
          )}

          <div className="space-y-6 text-xs font-sans">
            {/* 1. BASIC INFORMATION */}
            <div className="border border-line p-5 rounded-xs bg-paper/30 space-y-4">
              <h3 className="font-serif text-base font-bold text-ink border-b border-line pb-2">1. Basic Information</h3>
              
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-ink font-bold mb-1">Title *</label>
                  <input
                    type="text"
                    value={updateForm.title}
                    onChange={(e) => {
                      const titleVal = e.target.value
                      setUpdateForm((prev) => ({
                        ...prev,
                        title: titleVal,
                        slug: prev.slug || generateSlug(titleVal),
                        seoTitle: prev.seoTitle || titleVal,
                        canonicalUrl: `${SITE_PRODUCTION_URL}/daily-updates/${prev.slug || generateSlug(titleVal)}`,
                      }))
                    }}
                    className="w-full border border-line p-2.5 bg-white text-sm focus:border-green"
                    placeholder="e.g. FPSC Advertisement No. 09/2026 – 450+ Federal Vacancies Announced"
                    required
                  />
                </div>

                <div>
                  <label className="block text-ink font-bold mb-1">URL Slug *</label>
                  <input
                    type="text"
                    value={updateForm.slug}
                    onChange={(e) => {
                      const slugVal = generateSlug(e.target.value)
                      setUpdateForm((prev) => ({
                        ...prev,
                        slug: slugVal,
                        canonicalUrl: `${SITE_PRODUCTION_URL}/daily-updates/${slugVal}`,
                      }))
                    }}
                    className="w-full border border-line p-2.5 bg-white font-mono text-xs focus:border-green"
                    placeholder="fpsc-ad-09-2026-vacancies"
                    required
                  />
                </div>
              </div>

              <div className="grid sm:grid-cols-4 gap-4">
                <div>
                  <label className="block text-ink font-bold mb-1">Content Type</label>
                  <select
                    value={updateForm.contentType || 'auto'}
                    onChange={(e) => setUpdateForm({ ...updateForm, contentType: e.target.value === 'auto' ? '' : e.target.value })}
                    className="w-full border border-line p-2.5 bg-white font-semibold text-xs focus:border-green"
                  >
                    <option value="auto">Auto-detect ({updateLabels.badge})</option>
                    <option value="job">Real Job Vacancy</option>
                    <option value="notification">Government Notification / Gazette</option>
                    <option value="scheme">Welfare Scheme / Public Benefit</option>
                    <option value="admission">Admission Notice</option>
                    <option value="scholarship">Scholarship Opportunity</option>
                    <option value="result">Result / Merit List</option>
                    <option value="guide">Career Guide</option>
                  </select>
                </div>

                <div>
                  <label className="block text-ink font-bold mb-1">Category *</label>
                  <select
                    value={updateForm.category}
                    onChange={(e) => setUpdateForm({ ...updateForm, category: e.target.value })}
                    className="w-full border border-line p-2.5 bg-white font-semibold text-xs focus:border-green"
                  >
                    {UPDATE_CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-ink font-bold mb-1">{updateLabels.orgLabel} *</label>
                  <input
                    type="text"
                    value={updateForm.organization}
                    onChange={(e) => setUpdateForm({ ...updateForm, organization: e.target.value })}
                    className="w-full border border-line p-2.5 bg-white focus:border-green"
                    placeholder="e.g. FPSC, Sindh Labour Dept, BISP, HEC"
                    required
                  />
                </div>

                <div>
                  <label className="block text-ink font-bold mb-1">{updateLabels.locationLabel}</label>
                  <input
                    type="text"
                    value={updateForm.location}
                    onChange={(e) => setUpdateForm({ ...updateForm, location: e.target.value })}
                    className="w-full border border-line p-2.5 bg-white focus:border-green"
                    placeholder="e.g. Islamabad / All Pakistan / Sindh"
                  />
                </div>
              </div>

              {/* SMART CONDITIONAL FIELDS SECTION */}
              <div className="p-4 bg-white border border-line/80 rounded-xs space-y-4">
                <div className="flex items-center justify-between">
                  <div className="text-[11px] font-bold text-green uppercase tracking-wider">
                    {updateLabels.badge} Specific Fields
                  </div>
                  <span className="text-[11px] text-inksoft font-sans">
                    {updateLabels.isJob ? 'Standard job recruitment attributes' : 'Contextual public information fields'}
                  </span>
                </div>

                <div className="grid sm:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-inksoft font-semibold mb-1">{updateLabels.qualificationLabel}</label>
                    <input
                      type="text"
                      value={updateForm.qualification}
                      onChange={(e) => setUpdateForm({ ...updateForm, qualification: e.target.value })}
                      className="w-full border border-line p-2 bg-paper focus:bg-white text-xs"
                      placeholder={updateLabels.isJob ? "e.g. Bachelor's / Master's / Matric" : "e.g. Applicable to all commercial establishments"}
                    />
                  </div>

                  <div>
                    <label className="block text-inksoft font-semibold mb-1">{updateLabels.positionsLabel}</label>
                    <input
                      type="text"
                      value={updateForm.positions}
                      onChange={(e) => setUpdateForm({ ...updateForm, positions: e.target.value })}
                      className="w-full border border-line p-2 bg-paper focus:bg-white text-xs"
                      placeholder={updateLabels.isJob ? "e.g. 450 Posts / Multiple" : "e.g. 4 Worker Categories / 9.3M Families"}
                    />
                  </div>

                  <div>
                    <label className="block text-inksoft font-semibold mb-1">{updateLabels.salaryLabel}</label>
                    <input
                      type="text"
                      value={updateForm.salary || ''}
                      onChange={(e) => setUpdateForm({ ...updateForm, salary: e.target.value })}
                      className="w-full border border-line p-2 bg-paper focus:bg-white text-xs"
                      placeholder={updateLabels.isJob ? "BPS-17 / Market Competitive" : "Rs. 43,000 / month"}
                    />
                  </div>

                  <div>
                    <label className="block text-inksoft font-semibold mb-1">Classification / Mode</label>
                    <input
                      type="text"
                      value={updateForm.jobType}
                      onChange={(e) => setUpdateForm({ ...updateForm, jobType: e.target.value })}
                      className="w-full border border-line p-2 bg-paper focus:bg-white text-xs"
                      placeholder={updateLabels.isJob ? "Full Time / Contract" : "Statutory Gazette / Public Relief"}
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-ink font-bold mb-1">Short Description / Excerpt *</label>
                <textarea
                  value={updateForm.shortDescription}
                  onChange={(e) => {
                    const text = e.target.value
                    setUpdateForm((prev) => ({
                      ...prev,
                      shortDescription: text,
                      metaDescription: prev.metaDescription || text,
                    }))
                  }}
                  className="w-full border border-line p-2.5 bg-white h-20 text-xs focus:border-green"
                  placeholder="Summarize key advertisement facts (1-2 clear sentences for card view & meta tags)..."
                  required
                />
              </div>
            </div>

            {/* 2. IMPORTANT DATES & DEADLINE CONTROL */}
            <div className="border border-line p-5 rounded-xs bg-paper/30 space-y-4">
              <h3 className="font-serif text-base font-bold text-ink border-b border-line pb-2">2. Important Dates &amp; Status</h3>
              
              <div className="grid sm:grid-cols-3 gap-4 items-end">
                <div>
                  <label className="block text-ink font-bold mb-1">Publish Date &amp; Time</label>
                  <input
                    type="datetime-local"
                    value={updateForm.publishDate}
                    onChange={(e) => setUpdateForm({ ...updateForm, publishDate: e.target.value })}
                    className="w-full border border-line p-2.5 bg-white text-xs focus:border-green"
                  />
                </div>

                <div>
                  <label className="block text-ink font-bold mb-1">Last Date / Deadline</label>
                  <input
                    type="date"
                    value={updateForm.deadline}
                    disabled={updateForm.noDeadline}
                    onChange={(e) => setUpdateForm({ ...updateForm, deadline: e.target.value })}
                    className="w-full border border-line p-2.5 bg-white text-xs focus:border-green disabled:bg-slate-100"
                  />
                </div>

                <div className="flex items-center gap-2 pt-2">
                  <input
                    type="checkbox"
                    id="noDeadlineUpdate"
                    checked={updateForm.noDeadline}
                    onChange={(e) => setUpdateForm({ ...updateForm, noDeadline: e.target.checked, deadline: e.target.checked ? '' : updateForm.deadline })}
                    className="w-4 h-4 text-green"
                  />
                  <label htmlFor="noDeadlineUpdate" className="text-ink font-bold">
                    No deadline / Not announced
                  </label>
                </div>
              </div>

              {/* Calculated Status Badge */}
              <div className="p-3 bg-white border border-line flex items-center justify-between">
                <span className="text-xs text-inksoft font-bold">Calculated Opportunity Status:</span>
                {(() => {
                  const st = getOpportunityStatus(updateForm.deadline, updateForm.noDeadline)
                  return (
                    <span className={`px-3 py-1 border font-bold text-xs ${st.badgeClass}`}>
                      Status: {st.status} ({st.label})
                    </span>
                  )
                })()}
              </div>
            </div>

            {/* 3. FEATURED IMAGE SYSTEM & NANO BANANA HELPER */}
            <div className="border border-line p-5 rounded-xs bg-paper/30 space-y-4">
              <div className="flex items-center justify-between border-b border-line pb-2">
                <h3 className="font-serif text-base font-bold text-ink">3. Featured Image System</h3>
                <button
                  type="button"
                  onClick={() => handleGenerateNanoPrompt(updateForm.title, updateForm.category)}
                  className="bg-emerald-800 hover:bg-emerald-900 text-white px-3 py-1 text-xs font-bold rounded-xs transition-colors"
                >
                  ✨ Generate Nano Banana Prompt
                </button>
              </div>

              {nanoPromptBox && (
                <div className="p-3 bg-emerald-950 text-emerald-100 border border-emerald-700 rounded-xs text-xs space-y-2">
                  <div className="flex items-center justify-between font-bold">
                    <span>Banana Image Generator Prompt Template:</span>
                    <button onClick={() => setNanoPromptBox('')} className="text-emerald-300 hover:text-white">✕</button>
                  </div>
                  <p className="font-mono bg-emerald-900/60 p-2 rounded select-all">{nanoPromptBox}</p>
                  <p className="text-[11px] text-emerald-200">Copy prompt into AI image generation tool, generate visual, and upload or paste image URL below.</p>
                </div>
              )}

              <div className="grid sm:grid-cols-2 gap-4 items-start">
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-bold text-ink mb-1">Upload Local Image (JPG, PNG, WebP — max 3MB)</label>
                    <input
                      type="file"
                      accept="image/jpeg,image/png,image/webp,image/jpg"
                      onChange={(e) => handleImageFileChange(e, setUpdateForm)}
                      disabled={uploadingImage}
                      className="w-full text-xs border border-line bg-white p-2 file:mr-3 file:py-1 file:px-3 file:border-0 file:bg-green file:text-white file:text-xs file:font-bold"
                    />
                    {uploadingImage && <span className="text-xs text-green font-bold block mt-1">Compressing &amp; uploading image...</span>}
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-ink mb-1">Or Direct Image URL</label>
                    <input
                      type="url"
                      value={updateForm.featuredImage}
                      onChange={(e) => setUpdateForm({ ...updateForm, featuredImage: e.target.value })}
                      className="w-full border border-line p-2 bg-white text-xs focus:border-green"
                      placeholder="https://careerdost.blog/images/... or /api/uploads/img_..."
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-ink mb-1">Image Alt Text (SEO)</label>
                    <input
                      type="text"
                      value={updateForm.imageAlt}
                      onChange={(e) => setUpdateForm({ ...updateForm, imageAlt: e.target.value })}
                      className="w-full border border-line p-2 bg-white text-xs focus:border-green"
                      placeholder="Descriptive ALT text for accessibility"
                    />
                  </div>

                  {updateForm.featuredImage && (
                    <button
                      type="button"
                      onClick={() => setUpdateForm({ ...updateForm, featuredImage: '', imageAlt: '' })}
                      className="text-xs text-brick hover:underline font-bold"
                    >
                      🗑️ Remove Image (Use Category Fallback)
                    </button>
                  )}
                </div>

                {/* Aspect 16:9 Image Preview */}
                <div>
                  <label className="block text-xs font-bold text-ink mb-1">Live Card Banner Preview (16:9)</label>
                  <div className="relative aspect-[16/9] w-full bg-slate-900 border border-line rounded-xs overflow-hidden shadow-xs">
                    {updateForm.featuredImage ? (
                      <img
                        src={updateForm.featuredImage}
                        alt={updateForm.imageAlt || 'Featured preview'}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <CategoryFallbackImage category={updateForm.category} title={updateForm.title || 'CareerDost Opportunity'} />
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* 4. SOURCE & APPLICATION URLS */}
            <div className="border border-line p-5 rounded-xs bg-paper/30 space-y-4">
              <h3 className="font-serif text-base font-bold text-ink border-b border-line pb-2">4. Verified Source &amp; Application Links</h3>
              
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-ink font-bold mb-1">Official Source URL</label>
                  <input
                    type="url"
                    value={updateForm.officialLink}
                    onChange={(e) => setUpdateForm({ ...updateForm, officialLink: e.target.value })}
                    className="w-full border border-line p-2.5 bg-white text-xs focus:border-green"
                    placeholder="https://fpsc.gov.pk or official Gazette link"
                  />
                </div>

                <div>
                  <label className="block text-ink font-bold mb-1">Apply Online URL</label>
                  <input
                    type="url"
                    value={updateForm.applyLink}
                    onChange={(e) => setUpdateForm({ ...updateForm, applyLink: e.target.value })}
                    className="w-full border border-line p-2.5 bg-white text-xs focus:border-green"
                    placeholder="https://online.fpsc.gov.pk"
                  />
                </div>
              </div>

              <div className="flex items-center gap-3 pt-1">
                <input
                  type="checkbox"
                  id="isVerifiedUpdate"
                  checked={updateForm.isVerified}
                  onChange={(e) => setUpdateForm({ ...updateForm, isVerified: e.target.checked })}
                  className="w-4 h-4 text-green"
                />
                <label htmlFor="isVerifiedUpdate" className="text-ink font-bold text-xs">
                  ✅ Official Source Verified by Admin (Only checked when source link is manually verified)
                </label>
              </div>
            </div>

            {/* 5. RICH CONTENT EDITOR WITH FORMATTING TOOLBAR */}
            <div className="border border-line p-5 rounded-xs bg-paper/30 space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-line pb-2">
                <h3 className="font-serif text-base font-bold text-ink">5. Full Article Body Content</h3>
                <span className="text-[11px] text-inksoft">Sanitized against XSS scripts</span>
              </div>

              {/* Formatting Toolbar Buttons */}
              <div className="flex flex-wrap items-center gap-1.5 p-2 bg-white border border-line rounded-xs text-xs">
                <button
                  type="button"
                  onClick={() => insertFormatting(updateForm, setUpdateForm, '<h2>', '</h2>', 'Section Heading Title')}
                  className="px-2.5 py-1 bg-paper border border-line hover:bg-green hover:text-white font-bold"
                >
                  H2 Heading
                </button>
                <button
                  type="button"
                  onClick={() => insertFormatting(updateForm, setUpdateForm, '<h3>', '</h3>', 'Subheading Title')}
                  className="px-2.5 py-1 bg-paper border border-line hover:bg-green hover:text-white font-bold"
                >
                  H3 Subheading
                </button>
                <button
                  type="button"
                  onClick={() => insertFormatting(updateForm, setUpdateForm, '<strong>', '</strong>', 'Bold text')}
                  className="px-2.5 py-1 bg-paper border border-line hover:bg-green hover:text-white font-bold"
                >
                  Bold
                </button>
                <button
                  type="button"
                  onClick={() => insertFormatting(updateForm, setUpdateForm, '<em>', '</em>', 'Italic text')}
                  className="px-2.5 py-1 bg-paper border border-line hover:bg-green hover:text-white italic font-bold"
                >
                  Italic
                </button>
                <button
                  type="button"
                  onClick={() => insertFormatting(updateForm, setUpdateForm, '<ul>\n  <li>', '</li>\n  <li>Second requirement</li>\n</ul>', 'First requirement')}
                  className="px-2.5 py-1 bg-paper border border-line hover:bg-green hover:text-white font-bold"
                >
                  • Bullet List
                </button>
                <button
                  type="button"
                  onClick={() => insertFormatting(updateForm, setUpdateForm, '<ol>\n  <li>', '</li>\n  <li>Second step</li>\n</ol>', 'First step')}
                  className="px-2.5 py-1 bg-paper border border-line hover:bg-green hover:text-white font-bold"
                >
                  1. Numbered List
                </button>
                <button
                  type="button"
                  onClick={() => insertFormatting(updateForm, setUpdateForm, '<a href="https://official.gov.pk" target="_blank" rel="noopener noreferrer">', '</a>', 'Official Portal Link')}
                  className="px-2.5 py-1 bg-paper border border-line hover:bg-green hover:text-white font-bold"
                >
                  🔗 Insert Link
                </button>
                <button
                  type="button"
                  onClick={() => insertTableTemplate(updateForm, setUpdateForm)}
                  className="px-2.5 py-1 bg-paper border border-line hover:bg-green hover:text-white font-bold"
                >
                  📊 Insert Table
                </button>
                <button
                  type="button"
                  onClick={() => insertNoticeBoxTemplate(updateForm, setUpdateForm)}
                  className="px-2.5 py-1 bg-paper border border-line hover:bg-green hover:text-white font-bold"
                >
                  📢 Callout Notice
                </button>
              </div>

              <textarea
                value={updateForm.content}
                onChange={(e) => setUpdateForm({ ...updateForm, content: e.target.value })}
                className="w-full border border-line p-3 bg-white h-56 text-xs font-mono leading-relaxed focus:border-green"
                placeholder="Enter full content. Separate paragraphs with double enter/newlines..."
                required
              />
            </div>

            {/* 6. SEO METADATA SECTION */}
            <div className="border border-line p-5 rounded-xs bg-paper/30 space-y-4">
              <div className="flex items-center justify-between border-b border-line pb-2">
                <h3 className="font-serif text-base font-bold text-ink">6. SEO Meta &amp; Social Graph</h3>
                <button
                  type="button"
                  onClick={() => handleAutoSeoSuggestions(updateForm, setUpdateForm, false)}
                  className="bg-emerald-800 hover:bg-emerald-900 text-white px-3 py-1 text-xs font-bold rounded-xs transition-colors"
                >
                  ✨ Auto-Generate SEO Suggestions
                </button>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-ink font-bold">SEO Title Tag</label>
                    <span className={`text-[10px] ${updateForm.seoTitle.length > 60 ? 'text-brick font-bold' : 'text-inksoft'}`}>
                      {updateForm.seoTitle.length} / 60 chars
                    </span>
                  </div>
                  <input
                    type="text"
                    value={updateForm.seoTitle}
                    onChange={(e) => setUpdateForm({ ...updateForm, seoTitle: e.target.value })}
                    className="w-full border border-line p-2 bg-white text-xs focus:border-green"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-ink font-bold">Focus Keyword</label>
                    <span className="text-[10px] text-inksoft">e.g. FPSC Jobs 2026</span>
                  </div>
                  <input
                    type="text"
                    value={updateForm.focusKeyword}
                    onChange={(e) => setUpdateForm({ ...updateForm, focusKeyword: e.target.value })}
                    className="w-full border border-line p-2 bg-white text-xs focus:border-green"
                    placeholder="Primary target search phrase"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-ink font-bold">Meta Description</label>
                  <span className={`text-[10px] ${updateForm.metaDescription.length > 160 ? 'text-brick font-bold' : 'text-inksoft'}`}>
                    {updateForm.metaDescription.length} / 160 chars
                  </span>
                </div>
                <textarea
                  value={updateForm.metaDescription}
                  onChange={(e) => setUpdateForm({ ...updateForm, metaDescription: e.target.value })}
                  className="w-full border border-line p-2 bg-white text-xs h-16 focus:border-green"
                />
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-inksoft font-semibold mb-1">Canonical URL</label>
                  <input
                    type="url"
                    value={updateForm.canonicalUrl}
                    onChange={(e) => setUpdateForm({ ...updateForm, canonicalUrl: e.target.value })}
                    className="w-full border border-line p-2 bg-white text-xs focus:border-green font-mono"
                  />
                </div>

                <div>
                  <label className="block text-inksoft font-semibold mb-1">Open Graph Title</label>
                  <input
                    type="text"
                    value={updateForm.ogTitle}
                    onChange={(e) => setUpdateForm({ ...updateForm, ogTitle: e.target.value })}
                    className="w-full border border-line p-2 bg-white text-xs focus:border-green"
                  />
                </div>
              </div>
            </div>

            {/* ACTION CONTROLS */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-t border-line pt-6">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() =>
                    setPreviewUpdate({
                      ...updateForm,
                      content: updateForm.content.split('\n\n').filter((p) => p.trim()),
                    })
                  }
                  className="border border-line bg-paper text-ink px-4 py-2.5 text-xs font-bold hover:border-green"
                >
                  👁️ Interactive Preview
                </button>
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="featuredToggleUpdate"
                    checked={updateForm.featured}
                    onChange={(e) => setUpdateForm({ ...updateForm, featured: e.target.checked })}
                    className="w-4 h-4 text-green"
                  />
                  <label htmlFor="featuredToggleUpdate" className="text-ink font-bold">
                    ⭐ Mark as Featured
                  </label>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => handleSaveUpdate('draft')}
                  className="border border-gold bg-gold/10 text-gold-dark px-5 py-2.5 text-xs font-bold hover:bg-gold hover:text-slate-950 transition-colors"
                >
                  💾 Save Draft
                </button>
                <button
                  type="button"
                  onClick={() => handleSaveUpdate('published')}
                  className="bg-green text-white px-6 py-2.5 text-xs font-bold hover:bg-green-dark transition-all shadow-xs"
                >
                  🚀 Publish Update Now
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* CREATE / EDIT ARTICLE FORM */}
      {activeTab === 'articleForm' && (
        <div className="border border-line bg-white p-6 max-w-5xl shadow-sm rounded-xs">
          <div className="flex items-center justify-between border-b border-line pb-4 mb-6">
            <div>
              <h2 className="font-serif text-2xl font-bold text-ink">
                {editingArticle ? 'Edit Job Article' : 'Create Job Article'}
              </h2>
              <p className="text-xs text-inksoft mt-0.5">Comprehensive opportunity listing with full specs and SEO configuration</p>
            </div>
            <button
              onClick={() => setActiveTab('articles')}
              className="text-xs text-inksoft hover:text-ink font-bold border border-line px-3 py-1.5"
            >
              ← Cancel &amp; Return
            </button>
          </div>

          {formMsg && (
            <div
              className={`p-3.5 mb-6 text-xs font-bold border rounded-xs ${
                formMsg.includes('Error')
                  ? 'bg-brick-light text-brick border-brick/30'
                  : 'bg-green-light text-green border-green/30'
              }`}
            >
              {formMsg}
            </div>
          )}

          <div className="space-y-6 text-xs font-sans">
            <div className="border border-line p-5 rounded-xs bg-paper/30 space-y-4">
              <h3 className="font-serif text-base font-bold text-ink border-b border-line pb-2">1. Article Details</h3>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-ink font-bold mb-1">Title *</label>
                  <input
                    type="text"
                    value={articleForm.title}
                    onChange={(e) => {
                      const titleVal = e.target.value
                      setArticleForm((prev) => ({
                        ...prev,
                        title: titleVal,
                        slug: prev.slug || generateSlug(titleVal),
                        seoTitle: prev.seoTitle || titleVal,
                        canonicalUrl: `${SITE_PRODUCTION_URL}/jobs/${prev.slug || generateSlug(titleVal)}`,
                      }))
                    }}
                    className="w-full border border-line p-2.5 bg-white text-sm focus:border-green"
                    required
                  />
                </div>

                <div>
                  <label className="block text-ink font-bold mb-1">URL Slug *</label>
                  <input
                    type="text"
                    value={articleForm.slug}
                    onChange={(e) => {
                      const slugVal = generateSlug(e.target.value)
                      setArticleForm((prev) => ({
                        ...prev,
                        slug: slugVal,
                        canonicalUrl: `${SITE_PRODUCTION_URL}/jobs/${slugVal}`,
                      }))
                    }}
                    className="w-full border border-line p-2.5 bg-white font-mono text-xs focus:border-green"
                    required
                  />
                </div>
              </div>

              <div className="grid sm:grid-cols-4 gap-4">
                <div>
                  <label className="block text-ink font-bold mb-1">Content Type</label>
                  <select
                    value={articleForm.contentType || 'auto'}
                    onChange={(e) => setArticleForm({ ...articleForm, contentType: e.target.value === 'auto' ? '' : e.target.value })}
                    className="w-full border border-line p-2.5 bg-white font-semibold text-xs focus:border-green"
                  >
                    <option value="auto">Auto-detect ({articleLabels.badge})</option>
                    <option value="job">Real Job Vacancy</option>
                    <option value="notification">Government Notification / Gazette</option>
                    <option value="scheme">Welfare Scheme / Public Benefit</option>
                    <option value="admission">Admission Notice</option>
                    <option value="scholarship">Scholarship Opportunity</option>
                    <option value="result">Result / Merit List</option>
                    <option value="guide">Career Guide</option>
                  </select>
                </div>

                <div>
                  <label className="block text-ink font-bold mb-1">Category *</label>
                  <select
                    value={articleForm.category}
                    onChange={(e) => setArticleForm({ ...articleForm, category: e.target.value })}
                    className="w-full border border-line p-2.5 bg-white font-semibold text-xs focus:border-green"
                  >
                    {categories.map((c) => (
                      <option key={c.slug} value={c.slug}>{c.label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-ink font-bold mb-1">{articleLabels.orgLabel} *</label>
                  <input
                    type="text"
                    value={articleForm.organization}
                    onChange={(e) => setArticleForm({ ...articleForm, organization: e.target.value })}
                    className="w-full border border-line p-2.5 bg-white focus:border-green"
                    placeholder="e.g. FPSC, Sindh Labour Dept, BISP, HEC"
                    required
                  />
                </div>

                <div>
                  <label className="block text-ink font-bold mb-1">{articleLabels.locationLabel}</label>
                  <input
                    type="text"
                    value={articleForm.location}
                    onChange={(e) => setArticleForm({ ...articleForm, location: e.target.value })}
                    className="w-full border border-line p-2.5 bg-white focus:border-green"
                    placeholder="e.g. Islamabad / All Pakistan / Sindh"
                  />
                </div>
              </div>

              {/* DYNAMIC ATTRIBUTES SECTION */}
              <div className="p-4 bg-white border border-line/80 rounded-xs space-y-4">
                <div className="flex items-center justify-between">
                  <div className="text-[11px] font-bold text-green uppercase tracking-wider">
                    {articleLabels.badge} Specific Fields
                  </div>
                  <span className="text-[11px] text-inksoft font-sans">
                    {articleLabels.isJob ? 'Standard employment fields' : 'Contextual public information fields'}
                  </span>
                </div>

                <div className="grid sm:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-inksoft font-semibold mb-1">{articleLabels.qualificationLabel}</label>
                    <input
                      type="text"
                      value={articleForm.qualification}
                      onChange={(e) => setArticleForm({ ...articleForm, qualification: e.target.value })}
                      className="w-full border border-line p-2 bg-paper focus:bg-white text-xs"
                      placeholder={articleLabels.isJob ? "e.g. Bachelor's / Master's / Matric" : "e.g. Applicable to all commercial establishments / PMT < 32"}
                    />
                  </div>

                  <div>
                    <label className="block text-inksoft font-semibold mb-1">{articleLabels.positionsLabel}</label>
                    <input
                      type="text"
                      value={articleForm.positions}
                      onChange={(e) => setArticleForm({ ...articleForm, positions: e.target.value })}
                      className="w-full border border-line p-2 bg-paper focus:bg-white text-xs"
                      placeholder={articleLabels.isJob ? "e.g. 450 Posts / Multiple" : "e.g. 4 Worker Categories / 9.3M Families"}
                    />
                  </div>

                  <div>
                    <label className="block text-inksoft font-semibold mb-1">{articleLabels.salaryLabel}</label>
                    <input
                      type="text"
                      value={articleForm.salary || ''}
                      onChange={(e) => setArticleForm({ ...articleForm, salary: e.target.value })}
                      className="w-full border border-line p-2 bg-paper focus:bg-white text-xs"
                      placeholder={articleLabels.isJob ? "BPS-17 / Market Competitive" : "Rs. 43,000 / month"}
                    />
                  </div>

                  <div>
                    <label className="block text-inksoft font-semibold mb-1">Classification / Type</label>
                    <input
                      type="text"
                      value={articleForm.jobType}
                      onChange={(e) => setArticleForm({ ...articleForm, jobType: e.target.value })}
                      className="w-full border border-line p-2 bg-paper focus:bg-white text-xs"
                      placeholder={articleLabels.isJob ? "Full Time / Contract" : "Statutory Gazette / Public Relief"}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* DATES & DEADLINE */}
            <div className="border border-line p-5 rounded-xs bg-paper/30 space-y-4">
              <h3 className="font-serif text-base font-bold text-ink border-b border-line pb-2">2. Dates &amp; Links</h3>

              <div className="grid sm:grid-cols-3 gap-4 items-end">
                <div>
                  <label className="block text-ink font-bold mb-1">Publish Date</label>
                  <input
                    type="date"
                    value={articleForm.publishDate}
                    onChange={(e) => setArticleForm({ ...articleForm, publishDate: e.target.value })}
                    className="w-full border border-line p-2 bg-white text-xs focus:border-green"
                  />
                </div>

                <div>
                  <label className="block text-ink font-bold mb-1">{articleLabels.deadlineLabel}</label>
                  <input
                    type="date"
                    value={articleForm.lastDate}
                    disabled={articleForm.noDeadline}
                    onChange={(e) => setArticleForm({ ...articleForm, lastDate: e.target.value })}
                    className="w-full border border-line p-2 bg-white text-xs focus:border-green disabled:bg-slate-100"
                  />
                </div>

                <div className="flex items-center gap-2 pt-2">
                  <input
                    type="checkbox"
                    id="noDeadlineArticle"
                    checked={articleForm.noDeadline}
                    onChange={(e) => setArticleForm({ ...articleForm, noDeadline: e.target.checked, lastDate: e.target.checked ? '' : articleForm.lastDate })}
                    className="w-4 h-4 text-green"
                  />
                  <label htmlFor="noDeadlineArticle" className="text-ink font-bold">
                    No deadline / Not applicable
                  </label>
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-ink font-bold mb-1">Official Source Link</label>
                  <input
                    type="url"
                    value={articleForm.officialLink}
                    onChange={(e) => setArticleForm({ ...articleForm, officialLink: e.target.value })}
                    className="w-full border border-line p-2 bg-white text-xs focus:border-green"
                    placeholder="https://... official government or department page"
                  />
                </div>
                <div>
                  <label className="block text-ink font-bold mb-1">{articleLabels.isJob ? 'Apply Online URL' : 'Official Portal / Notification URL'}</label>
                  <input
                    type="url"
                    value={articleForm.applyLink}
                    onChange={(e) => setArticleForm({ ...articleForm, applyLink: e.target.value })}
                    className="w-full border border-line p-2 bg-white text-xs focus:border-green"
                    placeholder="https://..."
                  />
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="isVerifiedArticle"
                    checked={articleForm.isVerified}
                    onChange={(e) => setArticleForm({ ...articleForm, isVerified: e.target.checked })}
                    className="w-4 h-4 text-green"
                  />
                  <label htmlFor="isVerifiedArticle" className="text-ink font-bold text-xs">
                    ✅ Official Source Verified by Admin (Manually verified against gazette/official notice)
                  </label>
                </div>
                {articleForm.isVerified && !articleForm.officialLink && (
                  <span className="text-brick text-[11px] block pl-7">⚠️ An Official Source Link is required when marking as Verified.</span>
                )}
              </div>
            </div>

            {/* RICH CONTENT BODY */}
            <div className="border border-line p-5 rounded-xs bg-paper/30 space-y-3">
              <h3 className="font-serif text-base font-bold text-ink border-b border-line pb-2">3. Full Article Body Content</h3>
              
              <div className="flex flex-wrap items-center gap-1.5 p-2 bg-white border border-line rounded-xs text-xs">
                <button
                  type="button"
                  onClick={() => insertFormatting(articleForm, setArticleForm, '<h2>', '</h2>', 'Section Heading')}
                  className="px-2.5 py-1 bg-paper border hover:bg-green hover:text-white font-bold"
                >
                  H2 Heading
                </button>
                <button
                  type="button"
                  onClick={() => insertFormatting(articleForm, setArticleForm, '<strong>', '</strong>', 'Bold text')}
                  className="px-2.5 py-1 bg-paper border hover:bg-green hover:text-white font-bold"
                >
                  Bold
                </button>
                <button
                  type="button"
                  onClick={() => insertFormatting(articleForm, setArticleForm, '<ul>\n  <li>', '</li>\n</ul>', 'Requirement item')}
                  className="px-2.5 py-1 bg-paper border hover:bg-green hover:text-white font-bold"
                >
                  • List
                </button>
                <button
                  type="button"
                  onClick={() => insertTableTemplate(articleForm, setArticleForm)}
                  className="px-2.5 py-1 bg-paper border hover:bg-green hover:text-white font-bold"
                >
                  📊 Table
                </button>
                <button
                  type="button"
                  onClick={() => insertNoticeBoxTemplate(articleForm, setArticleForm)}
                  className="px-2.5 py-1 bg-paper border hover:bg-green hover:text-white font-bold"
                >
                  📢 Notice Box
                </button>
              </div>

              <textarea
                value={articleForm.content}
                onChange={(e) => setArticleForm({ ...articleForm, content: e.target.value })}
                className="w-full border border-line p-3 bg-white h-56 text-xs font-mono focus:border-green"
                required
              />
            </div>

            {/* 4. FEATURED IMAGE SYSTEM & NANO BANANA HELPER */}
            <div className="border border-line p-5 rounded-xs bg-paper/30 space-y-4">
              <div className="flex items-center justify-between border-b border-line pb-2">
                <h3 className="font-serif text-base font-bold text-ink">4. Featured Image System</h3>
                <button
                  type="button"
                  onClick={() => handleGenerateNanoPrompt(articleForm.title, articleForm.category)}
                  className="bg-emerald-800 hover:bg-emerald-900 text-white px-3 py-1 text-xs font-bold rounded-xs transition-colors"
                >
                  ✨ Generate Nano Banana Prompt
                </button>
              </div>

              {nanoPromptBox && (
                <div className="p-3 bg-emerald-950 text-emerald-100 border border-emerald-700 rounded-xs text-xs space-y-2">
                  <div className="flex items-center justify-between font-bold">
                    <span>Banana Image Generator Prompt Template:</span>
                    <button onClick={() => setNanoPromptBox('')} className="text-emerald-300 hover:text-white">✕</button>
                  </div>
                  <p className="font-mono bg-emerald-900/60 p-2 rounded select-all">{nanoPromptBox}</p>
                  <p className="text-[11px] text-emerald-200">Copy prompt into AI image generation tool, generate visual, and upload or paste image URL below.</p>
                </div>
              )}

              <div className="grid sm:grid-cols-2 gap-4 items-start">
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-bold text-ink mb-1">Upload Local Image (JPG, PNG, WebP — max 3MB)</label>
                    <input
                      type="file"
                      accept="image/jpeg,image/png,image/webp,image/jpg"
                      onChange={(e) => handleImageFileChange(e, setArticleForm)}
                      disabled={uploadingImage}
                      className="w-full text-xs border border-line bg-white p-2 file:mr-3 file:py-1 file:px-3 file:border-0 file:bg-green file:text-white file:text-xs file:font-bold"
                    />
                    {uploadingImage && <span className="text-xs text-green font-bold block mt-1">Compressing &amp; uploading image...</span>}
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-ink mb-1">Or Direct Image URL</label>
                    <input
                      type="url"
                      value={articleForm.featuredImage}
                      onChange={(e) => setArticleForm({ ...articleForm, featuredImage: e.target.value })}
                      className="w-full border border-line p-2 bg-white text-xs focus:border-green"
                      placeholder="https://careerdost.blog/images/... or /api/uploads/img_..."
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-ink mb-1">Image Alt Text (SEO)</label>
                    <input
                      type="text"
                      value={articleForm.imageAlt}
                      onChange={(e) => setArticleForm({ ...articleForm, imageAlt: e.target.value })}
                      className="w-full border border-line p-2 bg-white text-xs focus:border-green"
                      placeholder="Descriptive ALT text for accessibility & image search"
                    />
                  </div>

                  {articleForm.featuredImage && (
                    <button
                      type="button"
                      onClick={() => setArticleForm({ ...articleForm, featuredImage: '', imageAlt: '' })}
                      className="text-xs text-brick hover:underline font-bold"
                    >
                      🗑️ Remove Image (Use Category Fallback)
                    </button>
                  )}
                </div>

                {/* Aspect 16:9 Image Preview */}
                <div>
                  <label className="block text-xs font-bold text-ink mb-1">Live Card Banner Preview (16:9)</label>
                  <div className="relative aspect-[16/9] w-full bg-slate-900 border border-line rounded-xs overflow-hidden shadow-xs">
                    {articleForm.featuredImage ? (
                      <img
                        src={articleForm.featuredImage}
                        alt={articleForm.imageAlt || 'Featured preview'}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <CategoryFallbackImage category={articleForm.category} title={articleForm.title || 'CareerDost Opportunity'} />
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* 5. SEO METADATA SECTION */}
            <div className="border border-line p-5 rounded-xs bg-paper/30 space-y-4">
              <div className="flex items-center justify-between border-b border-line pb-2">
                <h3 className="font-serif text-base font-bold text-ink">5. SEO Meta &amp; Social Graph</h3>
                <button
                  type="button"
                  onClick={() => handleAutoSeoSuggestions(articleForm, setArticleForm, true)}
                  className="bg-emerald-800 hover:bg-emerald-900 text-white px-3 py-1 text-xs font-bold rounded-xs transition-colors"
                >
                  ✨ Auto-Generate SEO Suggestions
                </button>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-ink font-bold">SEO Title Tag</label>
                    <span className={`text-[10px] ${articleForm.seoTitle.length > 60 ? 'text-brick font-bold' : 'text-inksoft'}`}>
                      {articleForm.seoTitle.length} / 60 chars
                    </span>
                  </div>
                  <input
                    type="text"
                    value={articleForm.seoTitle}
                    onChange={(e) => setArticleForm({ ...articleForm, seoTitle: e.target.value })}
                    className="w-full border border-line p-2 bg-white text-xs focus:border-green"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-ink font-bold">Focus Keyword</label>
                    <span className="text-[10px] text-inksoft">e.g. FPSC Assistant Director 2026</span>
                  </div>
                  <input
                    type="text"
                    value={articleForm.focusKeyword}
                    onChange={(e) => setArticleForm({ ...articleForm, focusKeyword: e.target.value })}
                    className="w-full border border-line p-2 bg-white text-xs focus:border-green"
                    placeholder="Primary target search phrase"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-ink font-bold">Meta Description</label>
                  <span className={`text-[10px] ${articleForm.metaDescription.length > 155 ? 'text-brick font-bold' : 'text-inksoft'}`}>
                    {articleForm.metaDescription.length} / 155 chars
                  </span>
                </div>
                <textarea
                  value={articleForm.metaDescription}
                  onChange={(e) => setArticleForm({ ...articleForm, metaDescription: e.target.value })}
                  className="w-full border border-line p-2 bg-white text-xs h-16 focus:border-green"
                  placeholder="Compelling search snippet summary"
                />
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-ink font-bold mb-1">Canonical URL</label>
                  <input
                    type="url"
                    value={articleForm.canonicalUrl}
                    onChange={(e) => setArticleForm({ ...articleForm, canonicalUrl: e.target.value })}
                    className="w-full border border-line p-2 bg-white text-xs focus:border-green font-mono"
                  />
                </div>

                <div>
                  <label className="block text-ink font-bold mb-1">OG Social Title</label>
                  <input
                    type="text"
                    value={articleForm.ogTitle}
                    onChange={(e) => setArticleForm({ ...articleForm, ogTitle: e.target.value })}
                    className="w-full border border-line p-2 bg-white text-xs focus:border-green"
                  />
                </div>
              </div>
            </div>

            {/* ACTION BUTTONS */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-t border-line pt-6">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() =>
                    setPreviewArticle({
                      ...articleForm,
                      content: articleForm.content.split('\n\n').filter((p) => p.trim()),
                    })
                  }
                  className="border border-line bg-paper text-ink px-4 py-2.5 text-xs font-bold hover:border-green"
                >
                  👁️ Interactive Preview
                </button>
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="featuredToggleArticle"
                    checked={articleForm.featured}
                    onChange={(e) => setArticleForm({ ...articleForm, featured: e.target.checked })}
                    className="w-4 h-4 text-green"
                  />
                  <label htmlFor="featuredToggleArticle" className="text-ink font-bold">
                    ⭐ Mark as Featured
                  </label>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => handleSaveArticle('draft')}
                  className="border border-gold bg-gold/10 text-gold-dark px-5 py-2.5 text-xs font-bold hover:bg-gold hover:text-slate-950 transition-colors"
                >
                  💾 Save Draft
                </button>
                <button
                  type="button"
                  onClick={() => handleSaveArticle('published')}
                  className="bg-green text-white px-6 py-2.5 text-xs font-bold hover:bg-green-dark transition-all shadow-xs"
                >
                  🚀 Publish Article Now
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* CREATE / EDIT CATEGORY FORM */}
      {activeTab === 'categoryForm' && (
        <div className="border border-line bg-white p-6 max-w-2xl shadow-sm rounded-xs">
          <div className="flex items-center justify-between border-b border-line pb-3 mb-6">
            <h2 className="font-serif text-xl font-bold text-ink">
              {editingCategory ? 'Edit Category' : 'Create New Category'}
            </h2>
            <button
              onClick={() => setActiveTab('categories')}
              className="text-xs text-inksoft hover:text-ink font-bold border border-line px-3 py-1.5"
            >
              ← Cancel
            </button>
          </div>

          {formMsg && (
            <div
              className={`p-3 mb-6 text-xs font-bold border rounded-xs ${
                formMsg.includes('Error')
                  ? 'bg-brick-light text-brick border-brick/30'
                  : 'bg-green-light text-green border-green/30'
              }`}
            >
              {formMsg}
            </div>
          )}

          <form onSubmit={handleSaveCategory} className="space-y-4 text-xs font-sans">
            <div>
              <label className="block text-ink font-bold mb-1">Category Label *</label>
              <input
                type="text"
                value={categoryForm.label}
                onChange={(e) => {
                  const val = e.target.value
                  setCategoryForm((prev) => ({
                    ...prev,
                    label: val,
                    slug: prev.slug || generateSlug(val),
                  }))
                }}
                className="w-full border border-line p-2.5 bg-white"
                required
              />
            </div>

            <div>
              <label className="block text-ink font-bold mb-1">Category Slug *</label>
              <input
                type="text"
                value={categoryForm.slug}
                onChange={(e) => setCategoryForm({ ...categoryForm, slug: generateSlug(e.target.value) })}
                className="w-full border border-line p-2.5 bg-white font-mono"
                required
              />
            </div>

            <button type="submit" className="bg-green text-white px-5 py-2.5 text-xs font-bold shadow-xs">
              Save Category
            </button>
          </form>
        </div>
      )}

      {/* LIVE PREVIEW MODAL FOR DAILY UPDATE */}
      {previewUpdate && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white border border-line max-w-3xl w-full p-6 rounded-xs shadow-xl relative max-h-[90vh] overflow-y-auto font-sans">
            <div className="flex items-center justify-between border-b border-line pb-3 mb-4">
              <span className="text-xs font-bold text-green uppercase tracking-wider">Live Daily Update Preview</span>
              <button
                onClick={() => setPreviewUpdate(null)}
                className="text-inksoft hover:text-ink text-sm font-bold border border-line px-3 py-1"
              >
                ✕ Close Preview
              </button>
            </div>

            <div className="mb-6">
              <span className="text-xs font-bold text-inksoft block mb-2">Card Display Preview:</span>
              <div className="max-w-sm mx-auto">
                <UpdateCard updateItem={previewUpdate} />
              </div>
            </div>

            <div className="border-t border-line pt-4">
              <span className="text-xs font-bold text-inksoft block mb-2">Article Detail View Preview:</span>
              <h2 className="font-serif text-2xl font-bold text-ink mb-2">{previewUpdate.title}</h2>
              <p className="text-sm text-inksoft mb-4">{previewUpdate.shortDescription}</p>
              <SafeContent content={previewUpdate.content} />
            </div>
          </div>
        </div>
      )}

      {/* LIVE PREVIEW MODAL FOR JOB ARTICLE */}
      {previewArticle && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white border border-line max-w-3xl w-full p-6 rounded-xs shadow-xl relative max-h-[90vh] overflow-y-auto font-sans">
            <div className="flex items-center justify-between border-b border-line pb-3 mb-4">
              <span className="text-xs font-bold text-green uppercase tracking-wider">Live Job Article Preview</span>
              <button
                onClick={() => setPreviewArticle(null)}
                className="text-inksoft hover:text-ink text-sm font-bold border border-line px-3 py-1"
              >
                ✕ Close Preview
              </button>
            </div>

            <div className="mb-4 border-b border-line pb-4">
              <h1 className="font-serif text-2xl font-bold text-ink mb-2">{previewArticle.title}</h1>
              <div className="text-xs text-inksoft">Organization: <strong>{previewArticle.organization}</strong> | Location: <strong>{previewArticle.location || 'Pakistan'}</strong></div>
            </div>

            <SafeContent content={previewArticle.content} />
          </div>
        </div>
      )}
    </div>
  )
}
