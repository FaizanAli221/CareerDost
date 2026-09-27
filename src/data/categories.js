// Category taxonomy. `tone` maps to a Tailwind color pairing used across
// tags, badges and category-page accents so each category reads distinctly
// at a glance without relying on decorative icons.
export const categories = [
  {
    slug: 'government-jobs',
    label: 'Government Jobs',
    short: 'Govt Jobs',
    tone: 'green',
    description:
      'Federal, provincial and departmental vacancies advertised in Pakistan — from BPS-05 clerical posts to BPS-20 management positions.',
  },
  {
    slug: 'private-jobs',
    label: 'Private Jobs',
    short: 'Private',
    tone: 'slate',
    description:
      'Openings from private companies, NGOs and multinationals operating in Pakistan across sales, operations, engineering and support roles.',
  },
  {
    slug: 'bank-jobs',
    label: 'Bank Jobs',
    short: 'Banking',
    tone: 'gold',
    description:
      'Teller, officer grade and management trainee positions from commercial banks, microfinance banks and the State Bank of Pakistan.',
  },
  {
    slug: 'it-jobs',
    label: 'IT Jobs',
    short: 'IT',
    tone: 'slate',
    description:
      'Software, QA, DevOps and IT-support roles from software houses and tech teams hiring across Pakistan and for remote work.',
  },
  {
    slug: 'scholarships',
    label: 'Scholarships',
    short: 'Scholarships',
    tone: 'brick',
    description:
      'Fully funded and partial scholarships for undergraduate, graduate and PhD study in Pakistan and abroad.',
  },
  {
    slug: 'internships',
    label: 'Internships',
    short: 'Internships',
    tone: 'slate',
    description:
      'Paid and unpaid internship openings for students and recent graduates across government departments and private organisations.',
  },
  {
    slug: 'admissions',
    label: 'Admissions',
    short: 'Admissions',
    tone: 'brick',
    description:
      'Open admissions, entry test schedules and merit-list dates for universities, colleges and professional institutes.',
  },
  {
    slug: 'government-schemes',
    label: 'Government Schemes',
    short: 'Schemes',
    tone: 'green',
    description:
      'Welfare, subsidy and support programmes launched by federal and provincial governments, including how to check eligibility.',
  },
  {
    slug: 'results',
    label: 'Results',
    short: 'Results',
    tone: 'gold',
    description:
      'Announced results and roll-number slips for board exams, entry tests and recruitment tests across Pakistan.',
  },
  {
    slug: 'career-guides',
    label: 'Career Guides',
    short: 'Career Guides',
    tone: 'green',
    description:
      'Evergreen educational guides on CV writing, interview preparation, career planning and job application strategies.',
  },
]

export const categoryBySlug = (slug) => categories.find((c) => c.slug === slug)

export const toneClasses = {
  green: {
    tag: 'bg-green-light text-green border-green/20',
    text: 'text-green',
    dot: 'bg-green',
  },
  gold: {
    tag: 'bg-gold-light text-gold border-gold/30',
    text: 'text-gold',
    dot: 'bg-gold',
  },
  brick: {
    tag: 'bg-brick-light text-brick border-brick/20',
    text: 'text-brick',
    dot: 'bg-brick',
  },
  slate: {
    tag: 'bg-slate-light text-slate border-slate/20',
    text: 'text-slate',
    dot: 'bg-slate',
  },
}
