import { Routes, Route, useLocation } from 'react-router-dom'
import { useEffect, lazy, Suspense } from 'react'
import { trackPageView } from './lib/analytics'
import Header from './components/Header'
import Footer from './components/Footer'
import ErrorBoundary from './components/ErrorBoundary'
import Home from './pages/Home'

const DailyUpdatesPage = lazy(() => import('./pages/DailyUpdatesPage'))
const UpdateDetailPage = lazy(() => import('./pages/UpdateDetailPage'))
const CategoryPage = lazy(() => import('./pages/CategoryPage'))
const ArticlePage = lazy(() => import('./pages/ArticlePage'))
const SearchPage = lazy(() => import('./pages/SearchPage'))
const About = lazy(() => import('./pages/About'))
const Contact = lazy(() => import('./pages/Contact'))
const Privacy = lazy(() => import('./pages/Privacy'))
const Disclaimer = lazy(() => import('./pages/Disclaimer'))
const Terms = lazy(() => import('./pages/Terms'))
const AdminPage = lazy(() => import('./pages/AdminPage'))
const NotFound = lazy(() => import('./pages/NotFound'))

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
              <Route path="/jobs/:slug" element={<ArticlePage />} />
              <Route path="/search" element={<SearchPage />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/privacy-policy" element={<Privacy />} />
              <Route path="/disclaimer" element={<Disclaimer />} />
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
