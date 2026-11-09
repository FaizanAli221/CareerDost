import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { useEffect, lazy, Suspense } from 'react'
import { trackPageView } from './lib/analytics'
import Header from './components/Header'
import Footer from './components/Footer'
import ErrorBoundary from './components/ErrorBoundary'
import Home from './pages/Home'
import DailyUpdatesPage from './pages/DailyUpdatesPage'
import UpdateDetailPage from './pages/UpdateDetailPage'
import CategoryPage from './pages/CategoryPage'
import ArticlePage from './pages/ArticlePage'
import SearchPage from './pages/SearchPage'
import About from './pages/About'
import Contact from './pages/Contact'
import Privacy from './pages/Privacy'
import Disclaimer from './pages/Disclaimer'
import Terms from './pages/Terms'
import JobReadinessToolPage from './pages/JobReadinessToolPage'
import SindhGovJobsPillarPage from './pages/SindhGovJobsPillarPage'
import NotFound from './pages/NotFound'

const AdminPage = lazy(() => import('./pages/AdminPage'))

function ScrollToTop() {
  const location = useLocation()
  useEffect(() => {
    window.scrollTo(0, 0)
    trackPageView(location.pathname + location.search)
  }, [location])
  return null
}

export default function App() {
  return (
    <div className="min-h-screen flex flex-col bg-paper">
      <ScrollToTop />
      <Header />
      <main className="flex-1">
        <ErrorBoundary>
          <Suspense fallback={<div className="container-x py-16 text-center font-sans text-sm text-inksoft">Loading page...</div>}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/daily-updates" element={<DailyUpdatesPage />} />
              <Route path="/daily-updates/:slug" element={<UpdateDetailPage />} />
              <Route path="/category/:slug" element={<CategoryPage />} />
              <Route path="/jobs" element={<Navigate to="/" replace />} />
              <Route path="/jobs/sindh-government-jobs-2026" element={<SindhGovJobsPillarPage />} />
              <Route path="/jobs/spsc-combined-competitive-exam-guide-2026" element={<Navigate to="/jobs/spsc-exam-preparation-screening-challan-guide" replace />} />
              <Route path="/jobs/njp-balochistan-quota-federal-jobs-november-2026" element={<Navigate to="/jobs/economic-affairs-division-jobs-balochistan-2026" replace />} />
              <Route path="/jobs/:slug" element={<ArticlePage />} />
              <Route path="/tools/job-readiness-checker" element={<JobReadinessToolPage />} />
              <Route path="/search" element={<SearchPage />} />
              <Route path="/about" element={<About />} />
              <Route path="/editorial-policy" element={<Navigate to="/about#editorial-policy" replace />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/privacy" element={<Navigate to="/privacy-policy" replace />} />
              <Route path="/privacy-policy" element={<Privacy />} />
              <Route path="/disclaimer" element={<Disclaimer />} />
              <Route path="/terms" element={<Navigate to="/terms-and-conditions" replace />} />
              <Route path="/terms-and-conditions" element={<Terms />} />
              <Route path="/admin" element={<AdminPage />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </ErrorBoundary>
      </main>
      <Footer />
    </div>
  )
}
