import { useState } from 'react'

const DOCUMENT_CHECKLIST_ITEMS = [
  {
    id: 'doc-cnic',
    title: 'Valid NADRA CNIC / Smart National Identity Card',
    detail: 'Front & back clear copies; verify expiry date and exact name/father’s name spelling.',
    stage: 'Required for almost all applications',
  },
  {
    id: 'doc-domicile',
    title: 'District Domicile Certificate (and PRC Form-D where applicable)',
    detail: 'Issued by District Administration; PRC Form-D is commonly required alongside Domicile in Sindh.',
    stage: 'Required for quota/provincial posts',
  },
  {
    id: 'doc-certificates',
    title: 'Educational Certificates & Degrees (Matric, Inter, Bachelor’s, Master’s)',
    detail: 'Provisional certificate or convocation degree for all claimed qualifications.',
    stage: 'As specified in advertisement',
  },
  {
    id: 'doc-transcripts',
    title: 'Detailed Marks Certificates (DMCs) / Official University Transcripts',
    detail: 'Must show result declaration date, CGPA/percentage, and division clearly.',
    stage: 'Required for merit/scrutiny verification',
  },
  {
    id: 'doc-attestation',
    title: 'HEC Degree Attestation / IBCC Certificate Verification (Where Required)',
    detail: 'Check whether required at initial submission or only at interview/joining stage.',
    stage: 'Conditional — check recruiting body rules',
  },
  {
    id: 'doc-experience',
    title: 'Post-Qualification Experience Certificates (Where Applicable)',
    detail: 'On official letterhead with exact start/end dates, designation, and nature of duties.',
    stage: 'Only if post requires experience',
  },
  {
    id: 'doc-photos',
    title: 'Recent Passport-Size Photographs (Blue or White Background)',
    detail: 'High-resolution digital scan (< 100–500 KB for portals) plus 4–6 printed copies for test/interview.',
    stage: 'Required on portals & admit slips',
  },
  {
    id: 'doc-noc',
    title: 'Departmental NOC / Proper Channel Permission (Government Employees Only)',
    detail: 'Mandatory for in-service regular/contract public servants applying to another government body.',
    stage: 'In-service government applicants only',
  },
  {
    id: 'doc-disability',
    title: 'Official Disability Certificate & Special CNIC Logo (Differently-Abled Quota)',
    detail: 'Issued by National/Provincial Council for Rehabilitation of Disabled Persons + NADRA Special CNIC.',
    stage: 'Disability quota applicants only',
  },
  {
    id: 'doc-registration',
    title: 'Valid Professional Council License / Registration (PEC, PMDC, PNC, PPC, PBC)',
    detail: 'Active registration certificate valid on or before the closing date for regulated professions.',
    stage: 'Regulated technical/clinical/legal posts only',
  },
]

export default function PrintableDocsChecklist() {
  const [checkedIds, setCheckedIds] = useState({})
  const [naIds, setNaIds] = useState({})

  const toggleReady = (id) => {
    setCheckedIds((prev) => ({ ...prev, [id]: !prev[id] }))
    setNaIds((prev) => ({ ...prev, [id]: false }))
  }

  const toggleNa = (id) => {
    setNaIds((prev) => ({ ...prev, [id]: !prev[id] }))
    setCheckedIds((prev) => ({ ...prev, [id]: false }))
  }

  const handlePrint = () => {
    if (typeof window !== 'undefined') {
      window.print()
    }
  }

  const readyCount = DOCUMENT_CHECKLIST_ITEMS.filter(
    (item) => checkedIds[item.id] || naIds[item.id]
  ).length

  return (
    <section
      aria-labelledby="printable-docs-checklist-title"
      className="printable-section border-2 border-line bg-white rounded-xs shadow-xs p-5 sm:p-7 my-8 font-sans"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-line pb-4 mb-4">
        <div>
          <span className="inline-block bg-paper border border-line text-ink text-[11px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider mb-1.5">
            📄 Save or Print as PDF
          </span>
          <h2
            id="printable-docs-checklist-title"
            className="font-serif text-xl sm:text-2xl font-bold text-ink"
          >
            Printable Government Jobs Documents Checklist (Pakistan 2026)
          </h2>
          <p className="text-xs text-inksoft mt-1">
            Mark items you have prepared (or mark &ldquo;N/A&rdquo; if not applicable to your post), then print or save as PDF for your physical application file.
          </p>
        </div>

        <div className="no-print flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={handlePrint}
            className="bg-green hover:bg-green-dark text-white px-4 py-2 text-xs font-bold rounded-xs transition-colors shadow-xs"
          >
            🖨️ Print / Save Checklist PDF
          </button>
          <button
            type="button"
            onClick={() => {
              setCheckedIds({})
              setNaIds({})
            }}
            className="border border-line bg-paper hover:border-brick hover:text-brick text-inksoft px-3 py-2 text-xs font-semibold rounded-xs transition-colors"
          >
            Clear
          </button>
        </div>
      </div>

      <div className="border-l-4 border-emerald-700 bg-paper px-4 py-2.5 mb-4 text-xs text-inksoft">
        <strong className="text-ink">Important Priority Rule:</strong> Not every government department requires every document listed below at the initial application stage. Always treat the <strong>official job advertisement and recruiting authority&rsquo;s instructions</strong> as the final requirement list.
      </div>

      <div className="text-xs font-semibold text-ink mb-3">
        Folder Status: <span className="text-green font-bold">{readyCount} / {DOCUMENT_CHECKLIST_ITEMS.length}</span> document categories accounted for
      </div>

      <div className="divide-y divide-line border border-line rounded-xs">
        {DOCUMENT_CHECKLIST_ITEMS.map((item, idx) => {
          const isReady = Boolean(checkedIds[item.id])
          const isNa = Boolean(naIds[item.id])
          return (
            <div
              key={item.id}
              className={`p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-colors ${
                isReady ? 'bg-emerald-50/50' : isNa ? 'bg-paper/60 opacity-80' : 'bg-white'
              }`}
            >
              <div className="flex items-start gap-3">
                <input
                  type="checkbox"
                  id={item.id}
                  checked={isReady}
                  onChange={() => toggleReady(item.id)}
                  className="mt-1 w-4 h-4 accent-[#0B3D2E] rounded shrink-0"
                />
                <label htmlFor={item.id} className="cursor-pointer">
                  <span className={`text-xs sm:text-sm font-bold block ${isNa ? 'line-through text-inksoft' : 'text-ink'}`}>
                    {idx + 1}. {item.title}
                  </span>
                  <span className="text-xs text-inksoft block mt-0.5">{item.detail}</span>
                </label>
              </div>

              <div className="flex items-center justify-between sm:justify-end gap-2 pl-7 sm:pl-0 shrink-0">
                <span className="text-[11px] bg-paper border border-line px-2 py-0.5 rounded text-inksoft">
                  {item.stage}
                </span>
                <button
                  type="button"
                  onClick={() => toggleNa(item.id)}
                  className={`no-print text-[11px] px-2 py-0.5 border rounded font-semibold transition-colors ${
                    isNa
                      ? 'bg-slate-700 text-white border-slate-700'
                      : 'bg-white text-inksoft border-line hover:border-ink'
                  }`}
                >
                  {isNa ? 'Marked N/A' : 'N/A'}
                </button>
              </div>
            </div>
          )
        })}
      </div>

      <div className="mt-3 flex items-center justify-between text-[11px] text-inksoft">
        <span>Prepared via CareerDost.blog — Pakistan Career Guides &amp; Resources</span>
        <span>Verify deadlines &amp; attestations on official portals</span>
      </div>
    </section>
  )
}
