export type Project = {
  slug: string
  title: string
  direction: 'UI/UX' | 'Web Design' | 'Web Development' | 'App Design'
  year: string
  summary: string
  cover: string
  ratio: string
  role: string
  task: string
  solution: string
  system: string[]
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
    ratio: '16 / 9',
    role: 'Web design / Art direction',
    task: 'Собрать архив брутальной архитектуры, который читается как печатный каталог, а не как очередная галерея.',
    solution: 'Жёсткая сетка, крупные планы бетона и навигация по эпохам. Карточки заменены каталожными строками с индексами и координатами.',
    system: [
      'Сетка 12 колонок, модуль 8px',
      'Inter Tight 900 + JetBrains Mono',
      'Hover: инверсия строки и displacement фото',
      'WebGL-переход между эпохами',
    ],
    concept: true,
  },
  {
    slug: 'toner',
    title: 'TONER',
    direction: 'App Design',
    year: '2026',
    summary: 'Мобильное приложение для печати и сканирования зинов.',
    cover: 'media/work-toner-cover.webp',
    ratio: '4 / 5',
    role: 'Product design / UI',
    task: 'Дать независимым издателям печатать зины с телефона без сложных настроек и лишних экранов.',
    solution: 'Один экран съёмки, живой предпросмотр печати и очередь заданий с понятными статусами. Ошибка объясняет, что делать дальше.',
    system: [
      'Поток из четырёх шагов',
      'Tap-зоны от 44px',
      'Монохромная тема, крупная типографика',
      'Очередь с повтором и отменой',
    ],
    concept: true,
  },
  {
    slug: 'signal-0',
    title: 'SIGNAL 0',
    direction: 'UI/UX',
    year: '2026',
    summary: 'Дизайн-система и UI для независимого радио.',
    cover: 'media/work-signal-cover.webp',
    ratio: '3 / 4',
    role: 'UI/UX / Design system',
    task: 'Собрать эфир, архив и редакцию независимого радио в одну систему, которая не мешает слушать.',
    solution: 'Состояние эфира стало главным индикатором. Модульная сетка держит плеер, расписание и архивные выпуски в одном ритме.',
    system: [
      'Токены, сетка, типографическая шкала',
      'Компоненты плеера и расписания',
      'Тёмная тема на --void',
      'Клавиатурная навигация и фокус',
    ],
    concept: true,
  },
  {
    slug: 'concrete-dev',
    title: 'CONCRETE.DEV',
    direction: 'Web Development',
    year: '2026',
    summary: 'Сайт-манифест фронтенд-студии с WebGL.',
    cover: 'media/work-concrete-cover.webp',
    ratio: '16 / 9',
    role: 'Web development / Motion',
    task: 'Показать инженерный характер студии без стоковых кейсов, графиков роста и слова «инновации».',
    solution: 'Манифест на первом экране, WebGL-бетон и скролл-сценарий из трёх актов. Каждый эффект привязан к действию.',
    system: [
      'OGL-шейдеры и монохромный дисторшн',
      'Lenis + GSAP ScrollTrigger',
      'Бюджет 60fps, fallback без WebGL',
      'Семантика и reduced-motion',
    ],
    concept: true,
  },
]

export const findProject = (slug?: string) => projects.find((p) => p.slug === slug)
export const projectDirections = ['All', 'UI/UX', 'Web Design', 'Web Development', 'App Design'] as const
