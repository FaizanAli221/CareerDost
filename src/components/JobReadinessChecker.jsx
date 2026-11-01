import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'

const INITIAL_STATE = {
  cnic: false,
  domicile: false,
  education: false,
  experience: 'unset', // 'unset' | 'available' | 'not_required' | 'missing'
  ageChecked: false,
  registration: 'unset', // 'unset' | 'checked' | 'not_required' | 'missing'
  adReviewed: false,
}

export default function JobReadinessChecker({ compact = false, showGuideLinks = true }) {
  const [state, setState] = useState(INITIAL_STATE)

  const toggleBoolean = (key) => {
    setState((prev) => ({ ...prev, [key]: !prev[key] }))
  }

  const setChoice = (key, value) => {
    setState((prev) => ({ ...prev, [key]: value }))
  }

  const handleReset = () => {
    setState(INITIAL_STATE)
  }

  const handlePrint = () => {
    if (typeof window !== 'undefined') {
      window.print()
    }
  }

  const evaluation = useMemo(() => {
    const items = [
      {
        id: 'cnic',
        label: 'CNIC available',
        ready: state.cnic,
        statusText: state.cnic ? 'Ready' : 'Not confirmed',
        advice: 'Verify that your 13-digit NADRA CNIC is valid (not expired) and matches the spelling of your name and father’s name on your Matric certificate.',
      },
      {
        id: 'domicile',
        label: 'Domicile available',
        ready: state.domicile,
        statusText: state.domicile ? 'Ready' : 'Not confirmed',
        advice: 'Ensure your district Domicile Certificate (and Form-D PRC where required, such as Sindh provincial quotas) was issued before the application closing date.',
      },
      {
        id: 'education',
        label: 'Required educational documents available',
        ready: state.education,
        statusText: state.education ? 'Ready' : 'Not confirmed',
        advice: 'Confirm your degree/certificate and final transcript/DMC showing result declaration on or before the closing date (plus HEC/IBCC attestation if required by the notice).',
      },
      {
        id: 'experience',
        label: 'Experience certificate available, if required',
        ready: state.experience === 'available' || state.experience === 'not_required',
        statusText:
          state.experience === 'available'
            ? 'Available'
            : state.experience === 'not_required'
            ? 'Not required for target post'
            : state.experience === 'missing'
            ? 'Required — still needed'
            : 'Select applicability',
        advice: 'If the post requires post-qualification experience, arrange signed experience letters on official employer letterhead with exact joining and leaving dates.',
      },
      {
        id: 'ageChecked',
        label: 'Age eligibility checked',
        ready: state.ageChecked,
        statusText: state.ageChecked ? 'Checked' : 'Not checked',
        advice: 'Calculate your exact age as of the advertisement’s closing date and check whether general or category-specific age relaxation applies to that recruitment body.',
      },
      {
        id: 'registration',
        label: 'Relevant professional registration checked, if required',
        ready: state.registration === 'checked' || state.registration === 'not_required',
        statusText:
          state.registration === 'checked'
            ? 'Valid & verified'
            : state.registration === 'not_required'
            ? 'Not required for target post'
            : state.registration === 'missing'
            ? 'Required — renewal/registration pending'
            : 'Select applicability',
        advice: 'Regulated roles (engineers, doctors, nurses, pharmacists, lawyers) typically require valid PEC, PMDC, PNC, PPC, or Bar Council registration before the closing date.',
      },
      {
        id: 'adReviewed',
        label: 'Advertisement requirements reviewed',
        ready: state.adReviewed,
        statusText: state.adReviewed ? 'Reviewed' : 'Not reviewed',
        advice: 'Read the official job advertisement carefully for provincial/regional quota seats, bank challan/PSID fee rules, online portal instructions, and the exact closing date.',
      },
    ]

    const completedCount = items.filter((i) => i.ready).length
    const totalCount = items.length
    const percentage = Math.round((completedCount / totalCount) * 100)
    const pendingItems = items.filter((i) => !i.ready)

    let tier = 'prepare'
    let headline = 'Preparation Stage — Key Items Pending'
    let summaryColor = 'border-amber-300 bg-amber-50 text-amber-950'
    let barColor = 'bg-gold'
    let summaryMessage =
      'Select or check each requirement above as you verify your documents. Address the pending items below before submitting your online application.'

    if (completedCount === totalCount) {
      tier = 'ready'
      headline = 'Application Readiness Complete (7 / 7 Verified)'
      summaryColor = 'border-emerald-300 bg-emerald-50 text-emerald-950'
      barColor = 'bg-green'
      summaryMessage =
        'All 7 preparation checks are marked ready. Perform one final spelling and date check on the official recruitment portal before clicking submit, and save your submission confirmation or roll-number receipt.'
    } else if (completedCount >= 5) {
      tier = 'almost'
      headline = `Almost Ready (${completedCount} / ${totalCount} Complete) — Resolve Remaining ${pendingItems.length === 1 ? 'Item' : 'Items'}`
      summaryColor = 'border-sky-300 bg-sky-50 text-sky-950'
      barColor = 'bg-green'
      summaryMessage =
        'Most of your application file is in order, but one or two items still need verification before you submit.'
    } else if (completedCount === 0) {
      headline = 'Start Your Pre-Application Readiness Check (0 / 7)'
    }

    return {
      items,
      completedCount,
      totalCount,
      percentage,
      pendingItems,
      tier,
      headline,
      summaryColor,
      barColor,
      summaryMessage,
    }
  }, [state])

  return (
    <section
      aria-labelledby="readiness-checker-heading"
      className="printable-section border-2 border-green/30 bg-white rounded-xs shadow-xs p-5 sm:p-7 my-8 font-sans"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 border-b border-line pb-4 mb-5">
        <div>
          <div className="inline-flex items-center gap-1.5 bg-green-light border border-green/25 text-green text-[11px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider mb-2">
            <span>✓ Interactive CareerDost Tool</span>
          </div>
          <h2
            id="readiness-checker-heading"
            className="font-serif text-xl sm:text-2xl font-bold text-ink leading-snug"
          >
            Government Job Application Readiness Checker
          </h2>
          <p className="text-xs sm:text-sm text-inksoft mt-1 leading-relaxed max-w-2xl">
            Verify your core documents, eligibility dates, and advertisement rules before submitting an application on NJP, FPSC, PPSC, SPSC, KPPSC, BPSC, or departmental portals.
          </p>
        </div>

        <div className="no-print flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={handlePrint}
            className="border border-line bg-paper hover:border-green hover:text-green text-ink px-3 py-1.5 text-xs font-semibold rounded-xs transition-colors"
          >
            🖨️ Print Summary
          </button>
          <button
            type="button"
            onClick={handleReset}
            className="border border-line bg-white hover:border-brick hover:text-brick text-inksoft px-3 py-1.5 text-xs font-semibold rounded-xs transition-colors"
          >
            Reset
          </button>
        </div>
      </div>

      {/* Mandatory Disclaimer Banner */}
      <div
        role="note"
        className="border-l-4 border-amber-500 bg-amber-50/80 px-4 py-3 mb-5 rounded-xs text-xs sm:text-sm text-amber-950"
      >
        <p className="font-semibold">
          This checklist helps you prepare your application. It does not guarantee eligibility or acceptance.
        </p>
        <p className="text-[11px] text-amber-900/90 mt-1">
          Privacy Notice: This tool runs entirely in your browser. CareerDost does not ask for, collect, or store CNIC numbers, personal documents, or sensitive data.
        </p>
      </div>

      {/* Progress Bar */}
      <div className="mb-6">
        <div className="flex items-center justify-between text-xs font-semibold mb-1.5">
          <span className="text-ink">
            Readiness Progress: {evaluation.completedCount} of {evaluation.totalCount} items verified
          </span>
          <span className="text-green font-bold">{evaluation.percentage}%</span>
        </div>
        <div className="w-full h-2.5 bg-paper border border-line rounded-full overflow-hidden">
          <div
            className={`h-full transition-all duration-300 ${evaluation.barColor}`}
            style={{ width: `${evaluation.percentage}%` }}
          />
        </div>
      </div>

      {/* Checklist Controls */}
      <div className="space-y-3">
        {/* 1. CNIC */}
        <label className="flex items-start gap-3 p-3.5 border border-line rounded-xs bg-paper/40 hover:bg-paper/80 cursor-pointer transition-colors">
          <input
            type="checkbox"
            checked={state.cnic}
            onChange={() => toggleBoolean('cnic')}
            className="mt-0.5 w-4 h-4 accent-[#0B3D2E] rounded shrink-0"
          />
          <div className="flex-1 text-xs sm:text-sm">
            <span className="font-bold text-ink block">1. CNIC available</span>
            <span className="text-inksoft text-xs">
              Original NADRA CNIC / Smart Card is valid (unexpired) and personal spellings match academic certificates.
            </span>
          </div>
        </label>

        {/* 2. Domicile */}
        <label className="flex items-start gap-3 p-3.5 border border-line rounded-xs bg-paper/40 hover:bg-paper/80 cursor-pointer transition-colors">
          <input
            type="checkbox"
            checked={state.domicile}
            onChange={() => toggleBoolean('domicile')}
            className="mt-0.5 w-4 h-4 accent-[#0B3D2E] rounded shrink-0"
          />
          <div className="flex-1 text-xs sm:text-sm">
            <span className="font-bold text-ink block">2. Domicile available</span>
            <span className="text-inksoft text-xs">
              Valid District Domicile Certificate is issued (plus Form-D PRC where required by provincial rules such as Sindh).
            </span>
          </div>
        </label>

        {/* 3. Educational Documents */}
        <label className="flex items-start gap-3 p-3.5 border border-line rounded-xs bg-paper/40 hover:bg-paper/80 cursor-pointer transition-colors">
          <input
            type="checkbox"
            checked={state.education}
            onChange={() => toggleBoolean('education')}
            className="mt-0.5 w-4 h-4 accent-[#0B3D2E] rounded shrink-0"
          />
          <div className="flex-1 text-xs sm:text-sm">
            <span className="font-bold text-ink block">3. Required educational documents available</span>
            <span className="text-inksoft text-xs">
              Relevant degrees/certificates and transcripts/DMCs are in hand with result declared on or before the closing date.
            </span>
          </div>
        </label>

        {/* 4. Experience Certificate (Conditional) */}
        <div className="p-3.5 border border-line rounded-xs bg-paper/40">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="text-xs sm:text-sm">
              <span className="font-bold text-ink block">4. Experience certificate available, if required</span>
              <span className="text-inksoft text-xs">
                Post-qualification experience letters with exact dates (or mark &ldquo;Not Required&rdquo; for fresh-entry posts).
              </span>
            </div>
            <div className="flex flex-wrap gap-1.5 shrink-0" role="group" aria-label="Experience certificate status">
              {[
                { val: 'available', label: '✓ Available' },
                { val: 'not_required', label: 'Not Required' },
                { val: 'missing', label: 'Still Needed' },
              ].map((opt) => (
                <button
                  key={opt.val}
                  type="button"
                  onClick={() => setChoice('experience', opt.val)}
                  className={`px-2.5 py-1 text-xs font-semibold border rounded-xs transition-colors ${
                    state.experience === opt.val
                      ? opt.val === 'missing'
                        ? 'bg-brick text-white border-brick'
                        : 'bg-green text-white border-green'
                      : 'bg-white text-ink border-line hover:border-green'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* 5. Age Eligibility Checked */}
        <label className="flex items-start gap-3 p-3.5 border border-line rounded-xs bg-paper/40 hover:bg-paper/80 cursor-pointer transition-colors">
          <input
            type="checkbox"
            checked={state.ageChecked}
            onChange={() => toggleBoolean('ageChecked')}
            className="mt-0.5 w-4 h-4 accent-[#0B3D2E] rounded shrink-0"
          />
          <div className="flex-1 text-xs sm:text-sm">
            <span className="font-bold text-ink block">5. Age eligibility checked</span>
            <span className="text-inksoft text-xs">
              Verified minimum/maximum age limit on the closing date, including applicable upper-age relaxation rules.
            </span>
          </div>
        </label>

        {/* 6. Professional Registration (Conditional) */}
        <div className="p-3.5 border border-line rounded-xs bg-paper/40">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="text-xs sm:text-sm">
              <span className="font-bold text-ink block">
                6. Relevant professional registration checked, if required
              </span>
              <span className="text-inksoft text-xs">
                PEC, PMDC, PNC, Pharmacy Council, or Bar Council registration active where mandated by the post.
              </span>
            </div>
            <div className="flex flex-wrap gap-1.5 shrink-0" role="group" aria-label="Professional registration status">
              {[
                { val: 'checked', label: '✓ Active & Checked' },
                { val: 'not_required', label: 'Not Required' },
                { val: 'missing', label: 'Pending / Expired' },
              ].map((opt) => (
                <button
                  key={opt.val}
                  type="button"
                  onClick={() => setChoice('registration', opt.val)}
                  className={`px-2.5 py-1 text-xs font-semibold border rounded-xs transition-colors ${
                    state.registration === opt.val
                      ? opt.val === 'missing'
                        ? 'bg-brick text-white border-brick'
                        : 'bg-green text-white border-green'
                      : 'bg-white text-ink border-line hover:border-green'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* 7. Advertisement Requirements Reviewed */}
        <label className="flex items-start gap-3 p-3.5 border border-line rounded-xs bg-paper/40 hover:bg-paper/80 cursor-pointer transition-colors">
          <input
            type="checkbox"
            checked={state.adReviewed}
            onChange={() => toggleBoolean('adReviewed')}
            className="mt-0.5 w-4 h-4 accent-[#0B3D2E] rounded shrink-0"
          />
          <div className="flex-1 text-xs sm:text-sm">
            <span className="font-bold text-ink block">7. Advertisement requirements reviewed</span>
            <span className="text-inksoft text-xs">
              Reviewed official advertisement for provincial/regional seat quota, fee challan instructions, NOC rules, and submission mode.
            </span>
          </div>
        </label>
      </div>

      {/* Dynamic Readiness Summary Output */}
      <div className={`mt-6 border p-4 sm:p-5 rounded-xs ${evaluation.summaryColor}`} aria-live="polite">
        <div className="flex items-center justify-between gap-2 flex-wrap mb-2">
          <h3 className="font-serif text-base sm:text-lg font-bold">{evaluation.headline}</h3>
          <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-0.5 bg-white/80 border border-current/20 rounded-full">
            Readiness Summary
          </span>
        </div>
        <p className="text-xs sm:text-sm leading-relaxed mb-3">{evaluation.summaryMessage}</p>

        {evaluation.pendingItems.length > 0 && (
          <div className="bg-white/90 border border-line p-3.5 rounded-xs mt-3">
            <div className="text-xs font-bold text-ink uppercase tracking-wider mb-2">
              Recommended Next Steps Before Submitting ({evaluation.pendingItems.length}):
            </div>
            <ul className="space-y-2 text-xs text-inksoft">
              {evaluation.pendingItems.map((item) => (
                <li key={item.id} className="flex items-start gap-2">
                  <span className="text-amber-700 font-bold mt-0.5">→</span>
                  <span>
                    <strong className="text-ink">{item.label} ({item.statusText}):</strong> {item.advice}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Helpful Cross-Links */}
      {showGuideLinks && !compact && (
        <div className="no-print mt-5 pt-4 border-t border-line flex flex-wrap items-center justify-between gap-3 text-xs">
          <span className="text-inksoft font-medium">Related CareerDost Preparation Guides:</span>
          <div className="flex flex-wrap gap-3">
            <Link
              to="/jobs/njp-application-rejection-12-common-mistakes-avoid"
              className="text-green font-semibold hover:underline"
            >
              12 Common NJP Application Mistakes →
            </Link>
            <Link
              to="/jobs/government-jobs-documents-checklist-pakistan-2026"
              className="text-green font-semibold hover:underline"
            >
              Government Jobs Documents Checklist 2026 →
            </Link>
          </div>
        </div>
      )}
    </section>
  )
}
