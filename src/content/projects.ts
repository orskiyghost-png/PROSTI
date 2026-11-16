export type Project = {
  slug: string
  title: string
  direction: 'UI/UX' | 'Web Design' | 'Web Development' | 'App Design'
  year: string
  summary: string
  cover: string
  concept: true
}

export const projects: Project[] = [
  {
    slug: 'null-archive',
    title: 'NULL/ARCHIVE',
    direction: 'Web Design',
    year: '2026',
    summary: 'Веб-архив брутальной архитектуры.',
    cover: 'media/work-null-archive-cover.webp',
    concept: true,
  },
  {
    slug: 'toner',
    title: 'TONER',
    direction: 'App Design',
    year: '2026',
    summary: 'Мобильное приложение для печати и сканирования зинов.',
    cover: 'media/work-toner-cover.webp',
    concept: true,
  },
  {
    slug: 'signal-0',
    title: 'SIGNAL 0',
    direction: 'UI/UX',
    year: '2026',
    summary: 'Дизайн-система и UI для независимого радио.',
    cover: 'media/work-signal-cover.webp',
    concept: true,
  },
  {
    slug: 'concrete-dev',
    title: 'CONCRETE.DEV',
    direction: 'Web Development',
    year: '2026',
    summary: 'Сайт-манифест фронтенд-студии с WebGL.',
    cover: 'media/work-concrete-cover.webp',
    concept: true,
  },
]

export const findProject = (slug?: string) => projects.find((p) => p.slug === slug)
