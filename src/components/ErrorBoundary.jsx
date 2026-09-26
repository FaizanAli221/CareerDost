import { Component } from 'react'
import { Link } from 'react-router-dom'

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, errorInfo) {
    console.error('CareerDost Uncaught Error Boundary caught an error:', error, errorInfo)
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null })
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="container-x py-16 flex flex-col items-center justify-center text-center font-sans min-h-[60vh]">
          <div className="w-16 h-16 bg-brick-light text-brick rounded-full flex items-center justify-center text-2xl font-bold mb-4">
            ⚠️
          </div>
          <h1 className="font-serif text-3xl font-bold text-ink mb-3">
            Something Went Wrong
          </h1>
          <p className="text-sm text-inksoft max-w-md mb-6 leading-relaxed">
            We encountered an unexpected rendering issue. Don&rsquo;t worry, your data is safe. Please try refreshing or returning home.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={() => {
                this.handleReset()
                window.location.reload()
              }}
              className="border border-green bg-green text-white px-5 py-2.5 text-sm font-semibold hover:bg-green-dark transition-colors"
            >
              Refresh Page
            </button>
            <Link
              to="/"
              onClick={this.handleReset}
              className="border border-line bg-white text-ink px-5 py-2.5 text-sm font-semibold hover:bg-paper transition-colors"
            >
              Return to Home
            </Link>
          </div>
          {process.env.NODE_ENV !== 'production' && this.state.error && (
            <pre className="mt-8 p-4 bg-paper border border-line text-left text-xs text-brick overflow-x-auto max-w-xl">
              {this.state.error.toString()}
            </pre>
          )}
        </div>
      )
    }

    return this.props.children
  }
}
