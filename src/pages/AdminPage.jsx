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
} from '../api/client'
import { useSeo } from '../lib/useSeo'

export default function AdminPage() {
  useSeo({
    title: 'Admin Dashboard — CareerDost',
    description: 'Manage articles, draft/publish states, and categories.',
    noIndex: true,
  })

  const [token, setToken] = useState(() => localStorage.getItem('careerdost_admin_token') || '')
  const [usernameInput, setUsernameInput] = useState('admin')
  const [passwordInput, setPasswordInput] = useState('admin123')
  const [loginError, setLoginError] = useState('')
  const [loading, setLoading] = useState(false)

  const [stats, setStats] = useState(null)
  const [activeTab, setActiveTab] = useState('articles') // 'articles' | 'categories' | 'articleForm' | 'categoryForm'
  const [articleFilter, setArticleFilter] = useState('all') // 'all' | 'published' | 'draft'
  
  const [articles, setArticles] = useState([])
  const [categories, setCategories] = useState([])
  
  const [editingArticle, setEditingArticle] = useState(null)
  const [editingCategory, setEditingCategory] = useState(null)
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

  // Category form state
  const [categoryForm, setCategoryForm] = useState({
    slug: '',
    label: '',
    short: '',
    tone: 'slate',
    description: '',
  })

  useEffect(() => {
    if (!token) return
    loadDashboardData()
  }, [token, articleFilter])

  const loadDashboardData = async () => {
    try {
      const statsRes = await adminGetStats(token)
      if (statsRes.success) setStats(statsRes.data)

      const catsRes = await getCategoriesFromDb()
      if (catsRes) setCategories(catsRes)

      const filterValue = articleFilter === 'all' ? '' : articleFilter
      const artsRes = await adminGetArticles(token, filterValue)
      if (artsRes.success) setArticles(artsRes.data)
    } catch (err) {
      if (err.message.includes('401') || err.message.includes('Unauthorized')) {
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
      } else {
        setLoginError(res.error || 'Login failed')
      }
    } catch (err) {
      setLoginError(err.message || 'Login error')
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('careerdost_admin_token')
    setToken('')
    setStats(null)
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

  const handleSaveArticle = async (e, forcedStatus = null) => {
    if (e) e.preventDefault()
    setFormMsg('')

    const targetStatus = forcedStatus || articleForm.status

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
            ? 'Article published successfully! It is now live on the public website.'
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

  const handleToggleStatus = async (slug, currentStatus) => {
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
    if (!window.confirm(`Are you sure you want to delete category "${slug}"? Articles in this category will be deleted.`)) return
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

  // Auto-generate slug from title
  const generateSlug = (text) => {
    return text
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '')
  }

  if (!token) {
    return (
      <div className="container-x py-12 max-w-md">
        <div className="border border-line bg-white p-6 shadow-sm">
          <h1 className="font-serif text-2xl text-ink mb-2">Admin Login</h1>
          <p className="font-sans text-xs text-inksoft mb-6">
            Sign in to manage CareerDost database articles and categories.
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
            Default credentials: <code className="bg-paper px-1 py-0.5 border border-line">admin</code> / <code className="bg-paper px-1 py-0.5 border border-line">admin123</code>
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
          <p className="text-xs text-inksoft mt-1">Cloudflare D1 / SQLite Database Management</p>
        </div>
        <button
          onClick={handleLogout}
          className="border border-line text-inksoft hover:text-brick px-3 py-1.5 text-xs"
        >
          Sign Out
        </button>
      </div>

      {stats && (
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-6">
          <div className="border border-line bg-white p-4">
            <span className="block text-xs text-inksoft uppercase tracking-wider">Total Articles</span>
            <span className="font-serif text-2xl text-ink">{stats.totalArticles}</span>
          </div>
          <div className="border border-line bg-white p-4">
            <span className="block text-xs text-inksoft uppercase tracking-wider">Published</span>
            <span className="font-serif text-2xl text-green">{stats.publishedArticles}</span>
          </div>
          <div className="border border-line bg-white p-4">
            <span className="block text-xs text-inksoft uppercase tracking-wider">Drafts</span>
            <span className="font-serif text-2xl text-gold">{stats.draftArticles}</span>
          </div>
          <div className="border border-line bg-white p-4">
            <span className="block text-xs text-inksoft uppercase tracking-wider">Categories</span>
            <span className="font-serif text-2xl text-ink">{stats.totalCategories}</span>
          </div>
          <div className="border border-line bg-white p-4">
            <span className="block text-xs text-inksoft uppercase tracking-wider">Featured</span>
            <span className="font-serif text-2xl text-green">{stats.featuredArticles}</span>
          </div>
        </div>
      )}

      {/* Navigation tabs */}
      <div className="flex flex-wrap items-center justify-between border-b border-line mb-6 font-sans text-sm gap-2">
        <div className="flex gap-2">
          <button
            onClick={() => setActiveTab('articles')}
            className={`px-4 py-2 border-b-2 -mb-px font-medium ${
              activeTab === 'articles' ? 'border-green text-green' : 'border-transparent text-inksoft hover:text-ink'
            }`}
          >
            Articles
          </button>
          <button
            onClick={() => setActiveTab('categories')}
            className={`px-4 py-2 border-b-2 -mb-px font-medium ${
              activeTab === 'categories' ? 'border-green text-green' : 'border-transparent text-inksoft hover:text-ink'
            }`}
          >
            Categories ({categories.length})
          </button>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => handleOpenArticleForm()}
            className="border border-green bg-green text-white px-3 py-1.5 text-xs font-medium hover:bg-green-dark"
          >
            + Create Article
          </button>
          <button
            onClick={() => handleOpenCategoryForm()}
            className="border border-line bg-white text-ink px-3 py-1.5 text-xs font-medium hover:bg-paper"
          >
            + Create Category
          </button>
        </div>
      </div>

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
                        <span className="text-xs bg-gold-light text-gold px-2 py-0.5 border border-gold/30">
                          Draft
                        </span>
                      )}
                    </td>
                    <td className="p-3 text-inksoft">{art.lastDate}</td>
                    <td className="p-3">
                      {art.featured ? (
                        <span className="text-xs text-green font-medium">Yes</span>
                      ) : (
                        <span className="text-xs text-inksoft">No</span>
                      )}
                    </td>
                    <td className="p-3 text-right space-x-2 whitespace-nowrap">
                      <button
                        onClick={() => handleToggleStatus(art.slug, art.status)}
                        className={`text-xs px-2 py-0.5 border ${
                          art.status === 'published'
                            ? 'border-line text-inksoft hover:bg-paper'
                            : 'border-green bg-green/10 text-green hover:bg-green/20'
                        }`}
                      >
                        {art.status === 'published' ? 'Unpublish' : 'Publish'}
                      </button>
                      <button
                        onClick={() => handleOpenArticleForm(art)}
                        className="text-xs text-green hover:underline"
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
                {articles.length === 0 && (
                  <tr>
                    <td colSpan={6} className="p-6 text-center text-inksoft">
                      No articles found for this filter.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* CATEGORIES LIST */}
      {activeTab === 'categories' && (
        <div className="border border-line bg-white overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-line bg-paper text-inksoft text-xs">
              <tr>
                <th className="p-3">Label</th>
                <th className="p-3">Slug</th>
                <th className="p-3">Short</th>
                <th className="p-3">Tone</th>
                <th className="p-3">Description</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {categories.map((cat) => (
                <tr key={cat.slug} className="hover:bg-paper/50">
                  <td className="p-3 font-medium text-ink">{cat.label}</td>
                  <td className="p-3 text-inksoft">{cat.slug}</td>
                  <td className="p-3 text-inksoft">{cat.short}</td>
                  <td className="p-3 text-inksoft capitalize">{cat.tone}</td>
                  <td className="p-3 text-xs text-inksoft max-w-xs truncate">{cat.description}</td>
                  <td className="p-3 text-right space-x-2">
                    <button
                      onClick={() => handleOpenCategoryForm(cat)}
                      className="text-xs text-green hover:underline"
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
      )}

      {/* ARTICLE FORM */}
      {activeTab === 'articleForm' && (
        <div className="border border-line bg-white p-6 max-w-3xl">
          <div className="flex items-center justify-between mb-4 border-b border-line pb-3">
            <h2 className="font-serif text-xl text-ink">
              {editingArticle ? `Edit Article: ${editingArticle.title}` : 'Create Article'}
            </h2>
            <div className="flex items-center gap-2">
              <span className="text-xs text-inksoft">Publication Status:</span>
              <select
                value={articleForm.status}
                onChange={(e) => setArticleForm((f) => ({ ...f, status: e.target.value }))}
                className="border border-line bg-paper text-xs px-2 py-1"
              >
                <option value="published">Published (Live on site)</option>
                <option value="draft">Draft (Hidden from public)</option>
              </select>
            </div>
          </div>

          {formMsg && (
            <div className={`p-3 text-sm mb-4 border ${formMsg.startsWith('Error') ? 'bg-brick-light text-brick border-brick/30' : 'bg-green-light text-green border-green/30'}`}>
              {formMsg}
            </div>
          )}

          <form onSubmit={(e) => handleSaveArticle(e)} className="space-y-4 text-sm">
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-inksoft mb-1">Title *</label>
                <input
                  type="text"
                  value={articleForm.title}
                  onChange={(e) => {
                    const title = e.target.value
                    setArticleForm((f) => ({
                      ...f,
                      title,
                      slug: editingArticle ? f.slug : generateSlug(title),
                    }))
                  }}
                  className="w-full border border-line p-2 bg-paper"
                  required
                />
              </div>

              <div>
                <label className="block text-inksoft mb-1">Slug *</label>
                <input
                  type="text"
                  value={articleForm.slug}
                  onChange={(e) => setArticleForm((f) => ({ ...f, slug: e.target.value }))}
                  className="w-full border border-line p-2 bg-paper"
                  required
                />
              </div>
            </div>

            <div className="grid sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-inksoft mb-1">Category *</label>
                <select
                  value={articleForm.category}
                  onChange={(e) => setArticleForm((f) => ({ ...f, category: e.target.value }))}
                  className="w-full border border-line p-2 bg-paper"
                  required
                >
                  {categories.map((c) => (
                    <option key={c.slug} value={c.slug}>{c.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-inksoft mb-1">Organization *</label>
                <input
                  type="text"
                  value={articleForm.organization}
                  onChange={(e) => setArticleForm((f) => ({ ...f, organization: e.target.value }))}
                  className="w-full border border-line p-2 bg-paper"
                  required
                />
              </div>

              <div>
                <label className="block text-inksoft mb-1">Job Type</label>
                <input
                  type="text"
                  value={articleForm.jobType}
                  onChange={(e) => setArticleForm((f) => ({ ...f, jobType: e.target.value }))}
                  className="w-full border border-line p-2 bg-paper"
                />
              </div>
            </div>

            <div className="grid sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-inksoft mb-1">Location</label>
                <input
                  type="text"
                  value={articleForm.location}
                  onChange={(e) => setArticleForm((f) => ({ ...f, location: e.target.value }))}
                  className="w-full border border-line p-2 bg-paper"
                />
              </div>

              <div>
                <label className="block text-inksoft mb-1">Salary / Scale</label>
                <input
                  type="text"
                  value={articleForm.salary}
                  onChange={(e) => setArticleForm((f) => ({ ...f, salary: e.target.value }))}
                  className="w-full border border-line p-2 bg-paper"
                />
              </div>

              <div>
                <label className="block text-inksoft mb-1">Last Date to Apply</label>
                <input
                  type="date"
                  value={articleForm.lastDate}
                  onChange={(e) => setArticleForm((f) => ({ ...f, lastDate: e.target.value }))}
                  className="w-full border border-line p-2 bg-paper"
                />
              </div>
            </div>

            <div className="grid sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-inksoft mb-1">Publish Date</label>
                <input
                  type="date"
                  value={articleForm.publishDate}
                  onChange={(e) => setArticleForm((f) => ({ ...f, publishDate: e.target.value }))}
                  className="w-full border border-line p-2 bg-paper"
                />
              </div>

              <div>
                <label className="block text-inksoft mb-1">Official Link</label>
                <input
                  type="url"
                  value={articleForm.officialLink}
                  onChange={(e) => setArticleForm((f) => ({ ...f, officialLink: e.target.value }))}
                  className="w-full border border-line p-2 bg-paper"
                />
              </div>

              <div>
                <label className="block text-inksoft mb-1">Logo Initial (2 chars)</label>
                <input
                  type="text"
                  maxLength={4}
                  value={articleForm.logoInitial}
                  onChange={(e) => setArticleForm((f) => ({ ...f, logoInitial: e.target.value }))}
                  className="w-full border border-line p-2 bg-paper"
                />
              </div>
            </div>

            <div>
              <label className="block text-inksoft mb-1">Qualification</label>
              <input
                type="text"
                value={articleForm.qualification}
                onChange={(e) => setArticleForm((f) => ({ ...f, qualification: e.target.value }))}
                className="w-full border border-line p-2 bg-paper"
              />
            </div>

            <div className="flex items-center gap-2 py-2">
              <input
                type="checkbox"
                id="featured"
                checked={articleForm.featured}
                onChange={(e) => setArticleForm((f) => ({ ...f, featured: e.target.checked }))}
                className="h-4 w-4 text-green"
              />
              <label htmlFor="featured" className="text-ink font-medium">Feature this article on Homepage</label>
            </div>

            <div>
              <label className="block text-inksoft mb-1">Excerpt</label>
              <textarea
                value={articleForm.excerpt}
                onChange={(e) => setArticleForm((f) => ({ ...f, excerpt: e.target.value }))}
                className="w-full border border-line p-2 bg-paper h-20"
              />
            </div>

            <div>
              <label className="block text-inksoft mb-1">Content (Separate paragraphs with double newlines)</label>
              <textarea
                value={articleForm.content}
                onChange={(e) => setArticleForm((f) => ({ ...f, content: e.target.value }))}
                className="w-full border border-line p-2 bg-paper h-40 font-mono text-xs"
                required
              />
            </div>

            <div className="border-t border-line pt-4 grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-inksoft mb-1">SEO Title</label>
                <input
                  type="text"
                  value={articleForm.seoTitle}
                  onChange={(e) => setArticleForm((f) => ({ ...f, seoTitle: e.target.value }))}
                  className="w-full border border-line p-2 bg-paper"
                />
              </div>

              <div>
                <label className="block text-inksoft mb-1">Meta Description</label>
                <input
                  type="text"
                  value={articleForm.metaDescription}
                  onChange={(e) => setArticleForm((f) => ({ ...f, metaDescription: e.target.value }))}
                  className="w-full border border-line p-2 bg-paper"
                />
              </div>
            </div>

            <div className="flex flex-wrap justify-end gap-3 pt-4 border-t border-line">
              <button
                type="button"
                onClick={() => setActiveTab('articles')}
                className="border border-line px-4 py-2 text-inksoft hover:text-ink"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={(e) => handleSaveArticle(e, 'draft')}
                className="border border-line bg-paper text-ink px-4 py-2 hover:bg-white font-medium"
              >
                Save as Draft
              </button>
              <button
                type="button"
                onClick={(e) => handleSaveArticle(e, 'published')}
                className="bg-green text-white px-6 py-2 hover:bg-green-dark font-medium"
              >
                Publish Article Now
              </button>
            </div>
          </form>
        </div>
      )}

      {/* CATEGORY FORM */}
      {activeTab === 'categoryForm' && (
        <div className="border border-line bg-white p-6 max-w-xl">
          <h2 className="font-serif text-xl text-ink mb-4">
            {editingCategory ? `Edit Category: ${editingCategory.label}` : 'Create New Category'}
          </h2>

          {formMsg && (
            <div className={`p-3 text-sm mb-4 border ${formMsg.startsWith('Error') ? 'bg-brick-light text-brick border-brick/30' : 'bg-green-light text-green border-green/30'}`}>
              {formMsg}
            </div>
          )}

          <form onSubmit={handleSaveCategory} className="space-y-4 text-sm">
            <div>
              <label className="block text-inksoft mb-1">Label *</label>
              <input
                type="text"
                value={categoryForm.label}
                onChange={(e) => {
                  const label = e.target.value
                  setCategoryForm((f) => ({
                    ...f,
                    label,
                    slug: editingCategory ? f.slug : generateSlug(label),
                  }))
                }}
                className="w-full border border-line p-2 bg-paper"
                required
              />
            </div>

            <div>
              <label className="block text-inksoft mb-1">Slug *</label>
              <input
                type="text"
                value={categoryForm.slug}
                onChange={(e) => setCategoryForm((f) => ({ ...f, slug: e.target.value }))}
                className="w-full border border-line p-2 bg-paper"
                required
              />
            </div>

            <div>
              <label className="block text-inksoft mb-1">Short Name *</label>
              <input
                type="text"
                value={categoryForm.short}
                onChange={(e) => setCategoryForm((f) => ({ ...f, short: e.target.value }))}
                className="w-full border border-line p-2 bg-paper"
                required
              />
            </div>

            <div>
              <label className="block text-inksoft mb-1">Tone Color Pair</label>
              <select
                value={categoryForm.tone}
                onChange={(e) => setCategoryForm((f) => ({ ...f, tone: e.target.value }))}
                className="w-full border border-line p-2 bg-paper"
              >
                <option value="slate">Slate (Default)</option>
                <option value="green">Green (Government/Schemes)</option>
                <option value="gold">Gold (Banking/Results)</option>
                <option value="brick">Brick (Scholarships/Admissions)</option>
              </select>
            </div>

            <div>
              <label className="block text-inksoft mb-1">Description</label>
              <textarea
                value={categoryForm.description}
                onChange={(e) => setCategoryForm((f) => ({ ...f, description: e.target.value }))}
                className="w-full border border-line p-2 bg-paper h-24"
              />
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-line">
              <button
                type="button"
                onClick={() => setActiveTab('categories')}
                className="border border-line px-4 py-2 text-inksoft hover:text-ink"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-green text-white px-6 py-2 hover:bg-green-dark font-medium"
              >
                Save Category
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  )
}
