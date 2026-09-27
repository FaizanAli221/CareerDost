import { useState, useEffect } from 'react'
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
import { useSeo } from '../lib/useSeo'

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
]

export default function AdminPage() {
  useSeo({
    title: 'Admin Dashboard — CareerDost',
    description: 'Manage articles, daily updates, draft/publish states, and featured images.',
    noIndex: true,
  })

  const [token, setToken] = useState(() => localStorage.getItem('careerdost_admin_token') || '')
  const [usernameInput, setUsernameInput] = useState('')
  const [passwordInput, setPasswordInput] = useState('')
  const [loginError, setLoginError] = useState('')
  const [loading, setLoading] = useState(false)

  const [stats, setStats] = useState(null)
  const [activeTab, setActiveTab] = useState('articles') // 'articles' | 'updates' | 'categories' | 'articleForm' | 'updateForm' | 'categoryForm'
  const [articleFilter, setArticleFilter] = useState('all') // 'all' | 'published' | 'draft'
  const [updateFilter, setUpdateFilter] = useState('all') // 'all' | 'published' | 'draft'

  const [articles, setArticles] = useState([])
  const [updates, setUpdates] = useState([])
  const [categories, setCategories] = useState([])

  const [editingArticle, setEditingArticle] = useState(null)
  const [editingUpdate, setEditingUpdate] = useState(null)
  const [editingCategory, setEditingCategory] = useState(null)
  const [previewUpdate, setPreviewUpdate] = useState(null)
  const [uploadingImage, setUploadingImage] = useState(false)
  const [formMsg, setFormMsg] = useState('')

  // Article form state
  const [articleForm, setArticleForm] = useState({
    title: '',
    slug: '',
    category: '',
    organization: '',
    jobType: 'Full Time',
    location: '',
    qualification: '',
    salary: '',
    lastDate: '',
    publishDate: new Date().toISOString().split('T')[0],
    officialLink: '',
    featured: false,
    logoInitial: '',
    excerpt: '',
    content: '',
    seoTitle: '',
    metaDescription: '',
    status: 'published',
  })

  // Update form state
  const [updateForm, setUpdateForm] = useState({
    title: '',
    slug: '',
    category: 'Latest Jobs',
    shortDescription: '',
    content: '',
    featuredImage: '',
    imageAlt: '',
    officialLink: '',
    applyLink: '',
    deadline: '',
    publishDate: new Date().toISOString().slice(0, 16),
    seoTitle: '',
    metaDescription: '',
    status: 'published',
  })

  // Category form state
  const [categoryForm, setCategoryForm] = useState({
    slug: '',
    label: '',
    short: '',
    tone: 'slate',
    description: '',
  })

  useEffect(() => {
    if (token) {
      loadDashboardData()
    }
  }, [token, articleFilter, updateFilter])

  const loadDashboardData = async () => {
    try {
      const statsRes = await adminGetStats(token)
      if (statsRes.success) setStats(statsRes.data)

      const catsRes = await getCategoriesFromDb()
      if (catsRes) setCategories(catsRes)

      const filterValue = articleFilter === 'all' ? '' : articleFilter
      const artsRes = await adminGetArticles(token, filterValue)
      if (artsRes.success) setArticles(artsRes.data)

      const updFilterValue = updateFilter === 'all' ? '' : updateFilter
      const updsRes = await adminGetUpdates(token, updFilterValue)
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
        setLoginError(res.error || 'Login failed. Please check your credentials.')
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

  // Auto-generate slug helper
  const generateSlug = (text) => {
    return text
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '')
  }

  // Article handlers
  const handleOpenArticleForm = (art = null) => {
    setFormMsg('')
    if (art) {
      setEditingArticle(art)
      setArticleForm({
        title: art.title || '',
        slug: art.slug || '',
        category: art.category || (categories[0]?.slug || ''),
        organization: art.organization || '',
        jobType: art.jobType || 'Full Time',
        location: art.location || '',
        qualification: art.qualification || '',
        salary: art.salary || '',
        lastDate: art.lastDate || '',
        publishDate: art.publishDate || new Date().toISOString().split('T')[0],
        officialLink: art.officialLink || '',
        featured: Boolean(art.featured),
        logoInitial: art.logoInitial || '',
        excerpt: art.excerpt || '',
        content: Array.isArray(art.content) ? art.content.join('\n\n') : art.content || '',
        seoTitle: art.seoTitle || '',
        metaDescription: art.metaDescription || '',
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
        salary: '',
        lastDate: '',
        publishDate: new Date().toISOString().split('T')[0],
        officialLink: '',
        featured: false,
        logoInitial: '',
        excerpt: '',
        content: '',
        seoTitle: '',
        metaDescription: '',
        status: 'published',
      })
    }
    setActiveTab('articleForm')
  }

  const handleSaveArticle = async (targetStatus = 'published') => {
    setFormMsg('')
    try {
      const payload = {
        ...articleForm,
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
            : 'Article saved as draft successfully!'
        )
        await loadDashboardData()
        setTimeout(() => setActiveTab('articles'), 1200)
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
      if (res.success) {
        await loadDashboardData()
      } else {
        alert(res.error || 'Failed to update status')
      }
    } catch (err) {
      alert(err.message)
    }
  }

  const handleDeleteArticle = async (slug) => {
    if (!window.confirm(`Are you sure you want to delete article "${slug}"?`)) return
    try {
      const res = await adminDeleteArticle(token, slug)
      if (res.success) {
        loadDashboardData()
      } else {
        alert(res.error || 'Failed to delete article')
      }
    } catch (err) {
      alert(err.message)
    }
  }

  // Daily Updates handlers
  const handleOpenUpdateForm = (upd = null) => {
    setFormMsg('')
    if (upd) {
      setEditingUpdate(upd)
      setUpdateForm({
        title: upd.title || '',
        slug: upd.slug || '',
        category: upd.category || 'Latest Jobs',
        shortDescription: upd.shortDescription || '',
        content: Array.isArray(upd.content) ? upd.content.join('\n\n') : upd.content || '',
        featuredImage: upd.featuredImage || '',
        imageAlt: upd.imageAlt || '',
        officialLink: upd.officialLink || '',
        applyLink: upd.applyLink || '',
        deadline: upd.deadline || '',
        publishDate: upd.publishDate ? upd.publishDate.slice(0, 16) : new Date().toISOString().slice(0, 16),
        seoTitle: upd.seoTitle || '',
        metaDescription: upd.metaDescription || '',
        status: upd.status || 'published',
      })
    } else {
      setEditingUpdate(null)
      setUpdateForm({
        title: '',
        slug: '',
        category: 'Latest Jobs',
        shortDescription: '',
        content: '',
        featuredImage: '',
        imageAlt: '',
        officialLink: '',
        applyLink: '',
        deadline: '',
        publishDate: new Date().toISOString().slice(0, 16),
        seoTitle: '',
        metaDescription: '',
        status: 'published',
      })
    }
    setActiveTab('updateForm')
  }

  const handleImageFileChange = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploadingImage(true)
    setFormMsg('')

    try {
      const res = await adminUploadImage(token, file)
      if (res.success && res.data?.url) {
        setUpdateForm((prev) => ({
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

  const handleSaveUpdate = async (targetStatus = 'published') => {
    setFormMsg('')
    try {
      const payload = {
        ...updateForm,
        slug: updateForm.slug || generateSlug(updateForm.title),
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
            : 'Daily Update saved as draft successfully!'
        )
        await loadDashboardData()
        setTimeout(() => setActiveTab('updates'), 1200)
      } else {
        setFormMsg(`Error: ${res.error || 'Failed to save daily update'}`)
      }
    } catch (err) {
      setFormMsg(`Error: ${err.message}`)
    }
  }

  const handleToggleUpdateStatus = async (slug, currentStatus) => {
    const newStatus = currentStatus === 'published' ? 'draft' : 'published'
    try {
      const res = await adminToggleUpdateStatus(token, slug, newStatus)
      if (res.success) {
        await loadDashboardData()
      } else {
        alert(res.error || 'Failed to update status')
      }
    } catch (err) {
      alert(err.message)
    }
  }

  const handleDeleteUpdate = async (slug) => {
    if (!window.confirm(`Are you sure you want to delete daily update "${slug}"?`)) return
    try {
      const res = await adminDeleteUpdate(token, slug)
      if (res.success) {
        loadDashboardData()
      } else {
        alert(res.error || 'Failed to delete update')
      }
    } catch (err) {
      alert(err.message)
    }
  }

  // Category handlers
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
        setFormMsg(editingCategory ? 'Category updated successfully!' : 'Category created successfully!')
        await loadDashboardData()
        setTimeout(() => setActiveTab('categories'), 1200)
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
      if (res.success) {
        loadDashboardData()
      } else {
        alert(res.error || 'Failed to delete category')
      }
    } catch (err) {
      alert(err.message)
    }
  }

  if (!token) {
    return (
      <div className="container-x py-12 max-w-md">
        <div className="border border-line bg-white p-6 shadow-sm">
          <h1 className="font-serif text-2xl text-ink mb-2">Admin Login</h1>
          <p className="font-sans text-xs text-inksoft mb-6">
            Sign in to manage CareerDost database, articles, daily updates, and categories.
          </p>

          {loginError && (
            <div className="bg-brick-light text-brick text-sm p-3 mb-4 border border-brick/30">
              {loginError}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4 font-sans text-sm">
            <div>
              <label className="block text-inksoft mb-1">Username</label>
              <input
                type="text"
                value={usernameInput}
                onChange={(e) => setUsernameInput(e.target.value)}
                className="w-full border border-line p-2.5 bg-paper focus:bg-white"
                required
              />
            </div>
            <div>
              <label className="block text-inksoft mb-1">Password</label>
              <input
                type="password"
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                className="w-full border border-line p-2.5 bg-paper focus:bg-white"
                required
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-green text-white py-2.5 font-medium hover:bg-green-dark transition-colors disabled:opacity-50"
            >
              {loading ? 'Authenticating...' : 'Sign In'}
            </button>
          </form>

          <p className="font-sans text-xs text-inksoft mt-6 text-center border-t border-line pt-4">
            Authorized admin access only. Server-side HMAC JWT protected.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="container-x py-8 font-sans">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6 border-b border-line pb-4">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl text-ink">Admin Dashboard</h1>
          <p className="text-xs text-inksoft mt-1">CareerDost Content &amp; Daily Updates Portal</p>
        </div>
        <button
          onClick={handleLogout}
          className="border border-line text-inksoft hover:text-brick px-3 py-1.5 text-xs font-semibold"
        >
          Sign Out
        </button>
      </div>

      {stats && (
        <div className="grid grid-cols-2 sm:grid-cols-6 gap-3 mb-6">
          <div className="border border-line bg-white p-3">
            <span className="block text-[11px] text-inksoft uppercase tracking-wider">Total Updates</span>
            <span className="font-serif text-xl font-bold text-green">{stats.totalUpdates || 0}</span>
          </div>
          <div className="border border-line bg-white p-3">
            <span className="block text-[11px] text-inksoft uppercase tracking-wider">Pub. Updates</span>
            <span className="font-serif text-xl font-bold text-emerald-600">{stats.publishedUpdates || 0}</span>
          </div>
          <div className="border border-line bg-white p-3">
            <span className="block text-[11px] text-inksoft uppercase tracking-wider">Total Articles</span>
            <span className="font-serif text-xl text-ink">{stats.totalArticles}</span>
          </div>
          <div className="border border-line bg-white p-3">
            <span className="block text-[11px] text-inksoft uppercase tracking-wider">Pub. Articles</span>
            <span className="font-serif text-xl text-green">{stats.publishedArticles}</span>
          </div>
          <div className="border border-line bg-white p-3">
            <span className="block text-[11px] text-inksoft uppercase tracking-wider">Total Drafts</span>
            <span className="font-serif text-xl text-gold">{(stats.draftArticles || 0) + (stats.draftUpdates || 0)}</span>
          </div>
          <div className="border border-line bg-white p-3">
            <span className="block text-[11px] text-inksoft uppercase tracking-wider">Categories</span>
            <span className="font-serif text-xl text-ink">{stats.totalCategories}</span>
          </div>
        </div>
      )}

      {/* Navigation Tabs */}
      <div className="flex flex-wrap items-center justify-between border-b border-line mb-6 font-sans text-sm gap-2">
        <div className="flex gap-2">
          <button
            onClick={() => setActiveTab('updates')}
            className={`px-4 py-2 border-b-2 -mb-px font-semibold transition-colors ${
              activeTab === 'updates' ? 'border-green text-green bg-green/5' : 'border-transparent text-inksoft hover:text-ink'
            }`}
          >
            Daily Updates ({updates.length})
          </button>
          <button
            onClick={() => setActiveTab('articles')}
            className={`px-4 py-2 border-b-2 -mb-px font-semibold transition-colors ${
              activeTab === 'articles' ? 'border-green text-green bg-green/5' : 'border-transparent text-inksoft hover:text-ink'
            }`}
          >
            Job Articles ({articles.length})
          </button>
          <button
            onClick={() => setActiveTab('categories')}
            className={`px-4 py-2 border-b-2 -mb-px font-semibold transition-colors ${
              activeTab === 'categories' ? 'border-green text-green bg-green/5' : 'border-transparent text-inksoft hover:text-ink'
            }`}
          >
            Categories ({categories.length})
          </button>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => handleOpenUpdateForm()}
            className="border border-green bg-green text-white px-3.5 py-1.5 text-xs font-semibold hover:bg-green-dark shadow-xs"
          >
            + Add Daily Update
          </button>
          <button
            onClick={() => handleOpenArticleForm()}
            className="border border-line bg-white text-ink px-3.5 py-1.5 text-xs font-semibold hover:bg-paper hover:border-green"
          >
            + Create Job Article
          </button>
        </div>
      </div>

      {/* DAILY UPDATES TAB LIST */}
      {activeTab === 'updates' && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2 text-xs font-sans">
              <span className="text-inksoft font-medium">Filter Status:</span>
              <button
                onClick={() => setUpdateFilter('all')}
                className={`px-3 py-1 border font-semibold ${
                  updateFilter === 'all' ? 'border-green bg-green text-white' : 'border-line bg-white text-ink'
                }`}
              >
                All ({updates.length})
              </button>
              <button
                onClick={() => setUpdateFilter('published')}
                className={`px-3 py-1 border font-semibold ${
                  updateFilter === 'published' ? 'border-green bg-green text-white' : 'border-line bg-white text-ink'
                }`}
              >
                Published
              </button>
              <button
                onClick={() => setUpdateFilter('draft')}
                className={`px-3 py-1 border font-semibold ${
                  updateFilter === 'draft' ? 'border-green bg-green text-white' : 'border-line bg-white text-ink'
                }`}
              >
                Drafts
              </button>
            </div>
          </div>

          <div className="border border-line bg-white overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-line bg-paper text-inksoft text-xs">
                <tr>
                  <th className="p-3">Update Title</th>
                  <th className="p-3">Category</th>
                  <th className="p-3">Image</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Published Date</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {updates.map((upd) => (
                  <tr key={upd.slug} className="hover:bg-paper/50">
                    <td className="p-3 max-w-xs">
                      <div className="font-semibold text-ink leading-snug">{upd.title}</div>
                      <div className="text-xs text-inksoft truncate mt-0.5">{upd.slug}</div>
                    </td>
                    <td className="p-3">
                      <span className="text-xs font-semibold px-2 py-0.5 bg-paper border border-line">
                        {upd.category}
                      </span>
                    </td>
                    <td className="p-3">
                      {upd.featuredImage ? (
                        <span className="text-xs text-green font-semibold">✓ Uploaded</span>
                      ) : (
                        <span className="text-xs text-inksoft">Fallback</span>
                      )}
                    </td>
                    <td className="p-3">
                      {upd.status === 'published' ? (
                        <span className="text-xs bg-green-light text-green px-2 py-0.5 border border-green/20 font-semibold">
                          Published
                        </span>
                      ) : (
                        <span className="text-xs bg-gold/10 text-gold-dark px-2 py-0.5 border border-gold/20 font-semibold">
                          Draft
                        </span>
                      )}
                    </td>
                    <td className="p-3 text-xs text-inksoft">
                      {upd.publishDate ? new Date(upd.publishDate).toLocaleDateString() : '—'}
                    </td>
                    <td className="p-3 text-right space-x-2">
                      <button
                        onClick={() => handleToggleUpdateStatus(upd.slug, upd.status)}
                        className="text-xs text-inksoft hover:text-green underline"
                      >
                        {upd.status === 'published' ? 'Unpublish' : 'Republish'}
                      </button>
                      <button
                        onClick={() => handleOpenUpdateForm(upd)}
                        className="text-xs border border-line px-2.5 py-1 bg-white hover:border-green hover:text-green font-medium"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteUpdate(upd.slug)}
                        className="text-xs text-brick hover:underline"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ARTICLES LIST */}
      {activeTab === 'articles' && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2 text-xs font-sans">
              <span className="text-inksoft">Filter Status:</span>
              <button
                onClick={() => setArticleFilter('all')}
                className={`px-2.5 py-1 border ${
                  articleFilter === 'all' ? 'border-green bg-green text-white' : 'border-line bg-white text-ink'
                }`}
              >
                All ({articles.length})
              </button>
              <button
                onClick={() => setArticleFilter('published')}
                className={`px-2.5 py-1 border ${
                  articleFilter === 'published' ? 'border-green bg-green text-white' : 'border-line bg-white text-ink'
                }`}
              >
                Published
              </button>
              <button
                onClick={() => setArticleFilter('draft')}
                className={`px-2.5 py-1 border ${
                  articleFilter === 'draft' ? 'border-green bg-green text-white' : 'border-line bg-white text-ink'
                }`}
              >
                Drafts
              </button>
            </div>
          </div>

          <div className="border border-line bg-white overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-line bg-paper text-inksoft text-xs">
                <tr>
                  <th className="p-3">Title</th>
                  <th className="p-3">Category</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Last Date</th>
                  <th className="p-3">Featured</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {articles.map((art) => (
                  <tr key={art.slug} className="hover:bg-paper/50">
                    <td className="p-3">
                      <div className="font-medium text-ink">{art.title}</div>
                      <div className="text-xs text-inksoft">{art.organization} · {art.slug}</div>
                    </td>
                    <td className="p-3 text-inksoft">{art.category}</td>
                    <td className="p-3">
                      {art.status === 'published' ? (
                        <span className="text-xs bg-green-light text-green px-2 py-0.5 border border-green/20">
                          Published
                        </span>
                      ) : (
                        <span className="text-xs bg-gold/10 text-gold-dark px-2 py-0.5 border border-gold/20">
                          Draft
                        </span>
                      )}
                    </td>
                    <td className="p-3 text-inksoft text-xs">{art.lastDate || '—'}</td>
                    <td className="p-3 text-xs">{art.featured ? '⭐ Yes' : 'No'}</td>
                    <td className="p-3 text-right space-x-2">
                      <button
                        onClick={() => handleToggleArticleStatus(art.slug, art.status)}
                        className="text-xs text-inksoft hover:text-green underline"
                      >
                        {art.status === 'published' ? 'Unpublish' : 'Publish'}
                      </button>
                      <button
                        onClick={() => handleOpenArticleForm(art)}
                        className="text-xs border border-line px-2 py-1 bg-white hover:border-green hover:text-green"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteArticle(art.slug)}
                        className="text-xs text-brick hover:underline"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* CATEGORIES LIST */}
      {activeTab === 'categories' && (
        <div>
          <div className="border border-line bg-white overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-line bg-paper text-inksoft text-xs">
                <tr>
                  <th className="p-3">Label</th>
                  <th className="p-3">Slug</th>
                  <th className="p-3">Tone</th>
                  <th className="p-3">Description</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {categories.map((cat) => (
                  <tr key={cat.slug} className="hover:bg-paper/50">
                    <td className="p-3 font-medium text-ink">{cat.label}</td>
                    <td className="p-3 text-inksoft text-xs">{cat.slug}</td>
                    <td className="p-3 text-xs uppercase">{cat.tone}</td>
                    <td className="p-3 text-xs text-inksoft max-w-xs truncate">{cat.description}</td>
                    <td className="p-3 text-right space-x-2">
                      <button
                        onClick={() => handleOpenCategoryForm(cat)}
                        className="text-xs border border-line px-2 py-1 bg-white hover:border-green"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteCategory(cat.slug)}
                        className="text-xs text-brick hover:underline"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ADD / EDIT DAILY UPDATE FORM */}
      {activeTab === 'updateForm' && (
        <div className="border border-line bg-white p-6 max-w-4xl">
          <div className="flex items-center justify-between border-b border-line pb-3 mb-6">
            <h2 className="font-serif text-xl font-bold text-ink">
              {editingUpdate ? 'Edit Daily Update' : 'Add New Daily Update'}
            </h2>
            <button
              onClick={() => setActiveTab('updates')}
              className="text-xs text-inksoft hover:text-ink font-semibold"
            >
              ← Back to Updates List
            </button>
          </div>

          {formMsg && (
            <div
              className={`p-3 mb-6 text-sm font-semibold border ${
                formMsg.includes('Error') || formMsg.includes('❌')
                  ? 'bg-brick-light text-brick border-brick/30'
                  : 'bg-green-light text-green border-green/30'
              }`}
            >
              {formMsg}
            </div>
          )}

          <div className="space-y-6 text-sm">
            {/* Title & Slug */}
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-ink font-semibold mb-1">Update Title *</label>
                <input
                  type="text"
                  value={updateForm.title}
                  onChange={(e) => {
                    const titleVal = e.target.value
                    setUpdateForm((prev) => ({
                      ...prev,
                      title: titleVal,
                      slug: prev.slug || generateSlug(titleVal),
                    }))
                  }}
                  className="w-full border border-line p-2.5 bg-paper focus:bg-white"
                  placeholder="e.g. FPSC Consolidated Advertisement No. 09/2026 Released"
                  required
                />
              </div>

              <div>
                <label className="block text-ink font-semibold mb-1">URL Slug *</label>
                <input
                  type="text"
                  value={updateForm.slug}
                  onChange={(e) => setUpdateForm({ ...updateForm, slug: generateSlug(e.target.value) })}
                  className="w-full border border-line p-2.5 bg-paper focus:bg-white font-mono text-xs"
                  placeholder="fpsc-consolidated-ad-09-2026"
                  required
                />
              </div>
            </div>

            {/* Category & Publish Date */}
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-ink font-semibold mb-1">Category *</label>
                <select
                  value={updateForm.category}
                  onChange={(e) => setUpdateForm({ ...updateForm, category: e.target.value })}
                  className="w-full border border-line p-2.5 bg-paper focus:bg-white"
                >
                  {UPDATE_CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-ink font-semibold mb-1">Publish Date &amp; Time</label>
                <input
                  type="datetime-local"
                  value={updateForm.publishDate}
                  onChange={(e) => setUpdateForm({ ...updateForm, publishDate: e.target.value })}
                  className="w-full border border-line p-2.5 bg-paper focus:bg-white text-xs"
                />
              </div>
            </div>

            {/* Short Description */}
            <div>
              <label className="block text-ink font-semibold mb-1">Short Description / Summary *</label>
              <textarea
                value={updateForm.shortDescription}
                onChange={(e) => setUpdateForm({ ...updateForm, shortDescription: e.target.value })}
                className="w-full border border-line p-2.5 bg-paper focus:bg-white h-20 text-xs"
                placeholder="Short summary for card view and social meta tags (1-2 sentences)..."
                required
              />
            </div>

            {/* FEATURED IMAGE SECTION */}
            <div className="border border-line bg-paper p-4 rounded-xs">
              <label className="block text-ink font-bold mb-2">Featured Image System</label>
              <p className="text-xs text-inksoft mb-4">
                Upload a professional featured image (JPG, JPEG, PNG, WebP — max 3MB). Server-side type &amp; size verified. If omitted, category fallback image will be displayed.
              </p>

              <div className="grid sm:grid-cols-2 gap-4 items-start">
                <div>
                  <label className="block text-xs font-semibold text-inksoft mb-1">Upload Local Image File</label>
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp,image/jpg"
                    onChange={handleImageFileChange}
                    disabled={uploadingImage}
                    className="w-full text-xs text-inksoft border border-line bg-white p-2 file:mr-3 file:py-1 file:px-3 file:border-0 file:bg-green file:text-white file:text-xs file:font-semibold"
                  />
                  {uploadingImage && <span className="text-xs text-green font-semibold mt-1 block">Uploading &amp; compressing image...</span>}

                  <div className="mt-3">
                    <label className="block text-xs font-semibold text-inksoft mb-1">Or Direct Image URL</label>
                    <input
                      type="url"
                      value={updateForm.featuredImage}
                      onChange={(e) => setUpdateForm({ ...updateForm, featuredImage: e.target.value })}
                      className="w-full border border-line p-2 bg-white text-xs"
                      placeholder="https://example.com/image.jpg or /api/uploads/img_123"
                    />
                  </div>

                  <div className="mt-3">
                    <label className="block text-xs font-semibold text-inksoft mb-1">Image Alt Text</label>
                    <input
                      type="text"
                      value={updateForm.imageAlt}
                      onChange={(e) => setUpdateForm({ ...updateForm, imageAlt: e.target.value })}
                      className="w-full border border-line p-2 bg-white text-xs"
                      placeholder="Describe image for accessibility &amp; SEO"
                    />
                  </div>
                </div>

                {/* LIVE IMAGE PREVIEW THUMBNAIL */}
                <div>
                  <label className="block text-xs font-semibold text-inksoft mb-1">Live Card Image Preview</label>
                  <div className="relative aspect-[16/9] w-full bg-slate-900 border border-line rounded-xs overflow-hidden">
                    {updateForm.featuredImage ? (
                      <img
                        src={updateForm.featuredImage}
                        alt={updateForm.imageAlt || 'Preview'}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <CategoryFallbackImage category={updateForm.category} title={updateForm.title || 'Sample Title'} />
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Links & Deadline */}
            <div className="grid sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-ink font-semibold mb-1">Official / Source Link</label>
                <input
                  type="url"
                  value={updateForm.officialLink}
                  onChange={(e) => setUpdateForm({ ...updateForm, officialLink: e.target.value })}
                  className="w-full border border-line p-2.5 bg-paper focus:bg-white text-xs"
                  placeholder="https://fpsc.gov.pk"
                />
              </div>

              <div>
                <label className="block text-ink font-semibold mb-1">Apply Link (Optional)</label>
                <input
                  type="url"
                  value={updateForm.applyLink}
                  onChange={(e) => setUpdateForm({ ...updateForm, applyLink: e.target.value })}
                  className="w-full border border-line p-2.5 bg-paper focus:bg-white text-xs"
                  placeholder="https://online.fpsc.gov.pk"
                />
              </div>

              <div>
                <label className="block text-ink font-semibold mb-1">Deadline Date (Optional)</label>
                <input
                  type="date"
                  value={updateForm.deadline}
                  onChange={(e) => setUpdateForm({ ...updateForm, deadline: e.target.value })}
                  className="w-full border border-line p-2.5 bg-paper focus:bg-white text-xs"
                />
              </div>
            </div>

            {/* Full Content */}
            <div>
              <label className="block text-ink font-semibold mb-1">Full Content Body *</label>
              <textarea
                value={updateForm.content}
                onChange={(e) => setUpdateForm({ ...updateForm, content: e.target.value })}
                className="w-full border border-line p-3 bg-paper focus:bg-white h-48 text-sm font-sans"
                placeholder="Enter full details. Separate paragraphs with double newlines (Enter twice)."
                required
              />
            </div>

            {/* SEO Settings */}
            <div className="border-t border-line pt-4">
              <h3 className="font-semibold text-ink mb-3">SEO Meta Configuration</h3>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-inksoft mb-1">SEO Title</label>
                  <input
                    type="text"
                    value={updateForm.seoTitle}
                    onChange={(e) => setUpdateForm({ ...updateForm, seoTitle: e.target.value })}
                    className="w-full border border-line p-2 bg-paper text-xs"
                    placeholder="Custom title tag for Google search"
                  />
                </div>
                <div>
                  <label className="block text-xs text-inksoft mb-1">Meta Description</label>
                  <input
                    type="text"
                    value={updateForm.metaDescription}
                    onChange={(e) => setUpdateForm({ ...updateForm, metaDescription: e.target.value })}
                    className="w-full border border-line p-2 bg-paper text-xs"
                    placeholder="Custom meta description for search snippets"
                  />
                </div>
              </div>
            </div>

            {/* ACTION BUTTONS */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-t border-line pt-6">
              <button
                type="button"
                onClick={() =>
                  setPreviewUpdate({
                    ...updateForm,
                    content: updateForm.content.split('\n\n').filter((p) => p.trim()),
                  })
                }
                className="border border-line bg-paper text-ink px-4 py-2.5 text-xs font-semibold hover:border-green"
              >
                👁️ Live Preview
              </button>

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
                  className="bg-green text-white px-6 py-2.5 text-xs font-bold hover:bg-green-dark transition-colors shadow-xs"
                >
                  🚀 Publish Now
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* LIVE PREVIEW MODAL */}
      {previewUpdate && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white border border-line max-w-2xl w-full p-6 rounded-xs shadow-xl relative max-h-[90vh] overflow-y-auto font-sans">
            <div className="flex items-center justify-between border-b border-line pb-3 mb-4">
              <span className="text-xs font-bold text-green uppercase tracking-wider">Live Update Preview</span>
              <button
                onClick={() => setPreviewUpdate(null)}
                className="text-inksoft hover:text-ink text-sm font-bold"
              >
                ✕ Close Preview
              </button>
            </div>

            <div className="mb-6">
              <span className="text-xs font-semibold text-inksoft block mb-2">Card Display Preview:</span>
              <div className="max-w-sm mx-auto">
                <UpdateCard updateItem={previewUpdate} />
              </div>
            </div>

            <div className="border-t border-line pt-4">
              <span className="text-xs font-semibold text-inksoft block mb-2">Detail View Preview:</span>
              <h2 className="font-serif text-2xl font-bold text-ink mb-2">{previewUpdate.title}</h2>
              <p className="text-xs text-inksoft mb-4">{previewUpdate.shortDescription}</p>
              <div className="space-y-3 text-sm text-ink leading-relaxed">
                {previewUpdate.content.map((p, i) => (
                  <p key={i}>{p}</p>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ADD / EDIT ARTICLE FORM */}
      {activeTab === 'articleForm' && (
        <div className="border border-line bg-white p-6 max-w-4xl">
          <div className="flex items-center justify-between border-b border-line pb-3 mb-6">
            <h2 className="font-serif text-xl font-bold text-ink">
              {editingArticle ? 'Edit Job Article' : 'Create New Job Article'}
            </h2>
            <button
              onClick={() => setActiveTab('articles')}
              className="text-xs text-inksoft hover:text-ink font-semibold"
            >
              ← Back to Articles List
            </button>
          </div>

          {formMsg && (
            <div
              className={`p-3 mb-6 text-sm font-semibold border ${
                formMsg.includes('Error')
                  ? 'bg-brick-light text-brick border-brick/30'
                  : 'bg-green-light text-green border-green/30'
              }`}
            >
              {formMsg}
            </div>
          )}

          <form onSubmit={(e) => e.preventDefault()} className="space-y-6 text-sm">
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-ink font-semibold mb-1">Article Title *</label>
                <input
                  type="text"
                  value={articleForm.title}
                  onChange={(e) => {
                    const titleVal = e.target.value
                    setArticleForm((prev) => ({
                      ...prev,
                      title: titleVal,
                      slug: prev.slug || generateSlug(titleVal),
                    }))
                  }}
                  className="w-full border border-line p-2.5 bg-paper focus:bg-white"
                  required
                />
              </div>

              <div>
                <label className="block text-ink font-semibold mb-1">URL Slug *</label>
                <input
                  type="text"
                  value={articleForm.slug}
                  onChange={(e) => setArticleForm({ ...articleForm, slug: generateSlug(e.target.value) })}
                  className="w-full border border-line p-2.5 bg-paper focus:bg-white font-mono text-xs"
                  required
                />
              </div>
            </div>

            <div className="grid sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-ink font-semibold mb-1">Category *</label>
                <select
                  value={articleForm.category}
                  onChange={(e) => setArticleForm({ ...articleForm, category: e.target.value })}
                  className="w-full border border-line p-2.5 bg-paper focus:bg-white"
                >
                  {categories.map((c) => (
                    <option key={c.slug} value={c.slug}>
                      {c.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-ink font-semibold mb-1">Organization *</label>
                <input
                  type="text"
                  value={articleForm.organization}
                  onChange={(e) => setArticleForm({ ...articleForm, organization: e.target.value })}
                  className="w-full border border-line p-2.5 bg-paper focus:bg-white"
                  required
                />
              </div>

              <div>
                <label className="block text-ink font-semibold mb-1">Job Type</label>
                <input
                  type="text"
                  value={articleForm.jobType}
                  onChange={(e) => setArticleForm({ ...articleForm, jobType: e.target.value })}
                  className="w-full border border-line p-2.5 bg-paper focus:bg-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-ink font-semibold mb-1">Full Content *</label>
              <textarea
                value={articleForm.content}
                onChange={(e) => setArticleForm({ ...articleForm, content: e.target.value })}
                className="w-full border border-line p-3 bg-paper focus:bg-white h-48 text-sm"
                required
              />
            </div>

            <div className="flex items-center justify-end gap-3 border-t border-line pt-4">
              <button
                type="button"
                onClick={() => handleSaveArticle('draft')}
                className="border border-gold text-gold-dark px-4 py-2 text-xs font-bold"
              >
                Save Draft
              </button>
              <button
                type="button"
                onClick={() => handleSaveArticle('published')}
                className="bg-green text-white px-5 py-2 text-xs font-bold"
              >
                Publish Article
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ADD / EDIT CATEGORY FORM */}
      {activeTab === 'categoryForm' && (
        <div className="border border-line bg-white p-6 max-w-2xl">
          <div className="flex items-center justify-between border-b border-line pb-3 mb-6">
            <h2 className="font-serif text-xl font-bold text-ink">
              {editingCategory ? 'Edit Category' : 'Create New Category'}
            </h2>
            <button
              onClick={() => setActiveTab('categories')}
              className="text-xs text-inksoft hover:text-ink font-semibold"
            >
              ← Back to Categories List
            </button>
          </div>

          {formMsg && (
            <div
              className={`p-3 mb-6 text-sm font-semibold border ${
                formMsg.includes('Error')
                  ? 'bg-brick-light text-brick border-brick/30'
                  : 'bg-green-light text-green border-green/30'
              }`}
            >
              {formMsg}
            </div>
          )}

          <form onSubmit={handleSaveCategory} className="space-y-4 text-sm">
            <div>
              <label className="block text-ink font-semibold mb-1">Category Label *</label>
              <input
                type="text"
                value={categoryForm.label}
                onChange={(e) => {
                  const labelVal = e.target.value
                  setCategoryForm((prev) => ({
                    ...prev,
                    label: labelVal,
                    slug: prev.slug || generateSlug(labelVal),
                  }))
                }}
                className="w-full border border-line p-2.5 bg-paper focus:bg-white"
                required
              />
            </div>

            <div>
              <label className="block text-ink font-semibold mb-1">Category Slug *</label>
              <input
                type="text"
                value={categoryForm.slug}
                onChange={(e) => setCategoryForm({ ...categoryForm, slug: generateSlug(e.target.value) })}
                className="w-full border border-line p-2.5 bg-paper focus:bg-white font-mono text-xs"
                required
              />
            </div>

            <button type="submit" className="bg-green text-white px-5 py-2 text-xs font-bold">
              Save Category
            </button>
          </form>
        </div>
      )}
    </div>
  )
}
