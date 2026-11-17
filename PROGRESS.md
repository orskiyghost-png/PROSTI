# PROGRESS — журнал работы

## Текущий этап
**7 — аудит unslop и удаление декоративной нумерации.** Правки внесены, сборка проходит.
Сайт live: https://orskiyghost-png.github.io/PROSTI/

## Удаление цифр, скобок и слешей + аудит unslop (2026-11-17)
- Аудит по `unslop`: тяжёлого визуального слопа нет. Монохром, ксерокс-фактура, коллаж
  и дисторшн соответствуют характеру. Проблема была в шумном интерфейсном хроме:
  повторяющиеся `[ 01 ] / Section`, индексы, счётчики, edition-номера.
- Направление: персональное портфолио; тактильное, техническое, редакционное; мир —
  бумага, тушь, ксерокс; акценты — hero-объект и обложки концептов; подписи — названия
  секций без декоративной нумерации.
- Удалены из видимого интерфейса: квадратные скобки,slash-разделители, индексы секций
  и пунктов меню, счётчики фильтров,edition-номера, индексы этапов, номера кадров,
  годы в подписях, копирайт-год, возраст. `SIGNAL 0` → `SIGNAL ZERO`, `NULL/ARCHIVE` →
  `NULL ARCHIVE`, `404` → `LOST` (заголовок и title — «Not found»). `UI/UX` → `UI UX`.
- Сетки populations components обновлены под исчезнувшие индексы: WorkIndex, ProcessScroll,
  About (principles), Services (trigger). Сборка `npm run build` проходит.
- Проверка видимого текста в production-бандле: цифры, `[`, `]`, `/` в пользовательских
  строках отсутствуют. Остались только технические значения (пути, `ratio`, `slug`, года
  в данных, `id` этапов) и служебные строки библиотек.
- Tech: браузер в этом окружении недоступен (`Chromium distribution 'chrome' is not found`),
  поэтому DOM-замеры не повторены. Следующий шаг: commit, push, проверить Actions.

## Повторная проверка — типографика и контент (2026-11-17)
- Уточнено: слитого текста «Дизайн, который помнят руками» нет. В DOM есть явный `<br>`;
  проблема была в слишком отрицательном трекинге и высокой жирности.
- Фильтр Works работает на live и preview: выбор Web Design оставляет одну карточку NULL/ARCHIVE,
  переключает `aria-pressed` и меняет счётчик на `01 / 04`.
- Типографика облегчена: жирность display-заголовков снижена с 900 до 700, текстовых акцентов —
  с 600 до 500; отрицательный трекинг ослаблен на 0.02em, базовый — расширен до 0.015em.
- `ASSETS.md`: актуализированы статусы must-have; 120 desktop и 60 mobile кадров найдены.
  Указаны фактические 8 секунд ролика (ffprobe недоступен, метаданные взяты из журнала).
- Проверка: `npm run build` проходит. DOM на 375 / 390 / 768 / 1024 / 1440:
  `scrollWidth === innerWidth`, один `h1`, body 16px; filter buttons высотой 44px.
- Изменены CSS типографики, `ASSETS.md` и этот журнал. Следующий шаг: commit и push.

## Этап 5–6 — деплой и финальный аудит (сделано)
- `npm run build` проходит без ошибок TS. Сборка: JS 428.96 kB (gzip 144.15 kB), CSS 72.89 kB (gzip 23.67 kB).
- GitHub Actions run `43977722799` на коммите `1e820ca` — success, Pages обновлён.
- Live-проверка: `/PROSTI/`, `/about`, `/works`, `/works/toner`, `/works/signal-0`, `/works/null-archive`,
  `/works/concrete-dev`, `/services`, `/contact` — HTTP 200; прямой заход на вложенный роут работает.
  `/PROSTI/nope` — HTTP 404, при этом отдаётся SPA-страница 404. Ожидаемая консольная ошибка браузера
  относится к загрузке самого документа, а не к приложению.
- Ширины 375 / 390 / 768 / 1024 / 1280 / 1440: `scrollWidth === innerWidth`, один `h1`, body 16px,
  тап-цели ≥ 44px на всех маршрутах. Битых изображений нет; после прокрутки все изображения загружены.
- Проверено на live и preview: фильтр Works (`aria-pressed`, счётчик, мобильный tap), аккордеон Services
  (мышь и клавиатура, `aria-expanded`, `role="region"`), валидация Contact (фокус на первом поле,
  `aria-invalid`, `aria-describedby`), честный статус при пустом `formEndpoint`, переход Works → Project →
  следующий проект, мобильное меню (focus trap, `Esc`, блокировка скролла, закрытие при переходе),
  route veil и возврат назад, hover-превью WorkIndex, ленивые кадры ProcessScroll (до подхода к секции — 0
  запросов, после — загружаются батчами), обратный скролл возвращает reveal-блоки и кадры.
- Reduced-motion: без canvas на Works / Project / 404, статичный halftone на About / Contact, все
  reveal-блоки видимы, навигация мгновенная, intro не показывается.
- Исправлено в аудите: skip-link ≥ 44px; `useReducedMotion` работает; импорт HeroVisual; поля Contact ≥ 46px;
  обложка Project ≤ 78svh; `key={project.slug}` для ProjectCover; `config.ts` без `as const`;
  ProcessScroll грузит кадры только при подходе к секции.
- Известные ограничения: intro в headless Chromium ~2.9 s (software WebGL); WebGL-обложка Project на
  software-GPU появляется ~1.5 s, до этого виден `<img>`; `/PROSTI/nope` законно отдаёт HTTP 404.

## Этап 4 — About, Works, Project, Services, Contact, 404 (сделано)
- **About**: мега `ABOUT`, анонимный портрет-стенд-ин с canvas-halftone (scrub, точки крупнее → мельче),
  fallback `<img>`, четыре принципа rule-rows, инструменты Mono-списком на чёрной плашке, переход к Works.
- **Works**: мега `WORKS (04)`, пять фильтров (Все / UI/UX / Web Design / Web Development / App Design) с
  реальной фильтрацией и `aria-pressed`, коллаж 12 колонок со сдвигами и разными пропорциями, SVG
  `feTurbulence + feDisplacementMap` на hover и tap, подписи `CONCEPT`.
- **Project**: полноширинная обложка с OGL-дисторшном и fallback, паспорт (год, роль, направление, статус),
  задача → решение, экран-схема в коде, система, следующий проект. Неизвестный slug → 404. Reveal-блоки
  `play reverse play reverse`.
- **Services**: четыре направления, аккордеон с `aria-expanded` и `role="region"`, текст «что делаю /
  что получаете / формат», фоновая фактура `tex-services`, без цен, CTA в Contact.
- **Contact**: `;INFO` из `config.ts` (пустые значения не выдумываются, видна пометка «будет добавлено»),
  фигура-стенд-ин и панорама-плашка на halftone, форма с валидацией, `aria-invalid`, `aria-describedby`,
  `aria-live`. При пустом `formEndpoint` форма честно сообщает, что приём не настроен; при наличии email
  открывает `mailto:`; при endpoint — POST. Ложной отправки нет.
- **404**: мега `404` с SVG-displacement на hover, ссылка на главную.
- Мета: у каждого маршрута свой `document.title` (`useDocumentTitle`).
- Проверки (Chromium + preview): 1440 / 1280 / 1024 / 768 / 390 / 375 — `scrollWidth === innerWidth`,
  один `h1`, body 16px, тап-цели ≥ 44px; фильтр Works, аккордеон Services, валидация и фокус формы,
  переход Works → Project → следующий проект, 404 — работают; консоль без ошибок; reduced-motion —
  без canvas на Works/Project/404, статичный halftone на About/Contact, все reveal-блоки видимы.
- Исправлено: `config.ts` больше не сужает пустые строки до `never`; поля Contact ≥ 46px; обложка Project
  ограничена 78svh; ProjectCover получает `key` при смене slug, чтобы не переиспользовать потерянный
  WebGL-контекст.
- Известное ограничение: WebGL-обложка Project на software-GPU появляется ~1.5 s; до этого виден `<img>`.
- Коммиты: этим коммитом.

## Этап 3 — Home (сделано)
- Hero: мега `SURKOV` с intro-плашкой (`PRINT ERROR`, один раз за сессию), плавающие фото,
  позиция «Дизайн, который помнят руками», cue на Works.
- `HeroVisual`: OGL-плоскость с noise-дисторшном, grayscale-текстурой, scrub по hero;
  fallback `<img>` при reduced-motion и при ошибке WebGL.
- `WorkIndex`: 3 избранных концепта, rule-rows, черная плашка-подсветка, hover-превью под курсором,
  мобильные миниатюры; ссылки на `/works/:slug`.
- `ProcessScroll`: sticky-секция 300svh, canvas-кадры 120 desktop / 60 mobile, прогрессивная загрузка
  батчами, poster-fallback, 4 этапа, обратимость scrub; кадры грузятся только при подходе к секции.
- Manifest: split-reveal по scrub (строки в масках, `aria-label` на h2).
- Close: `LET'S TALK` → `/contact`.
- Тесты (Chromium + preview, 1440/1280/1024/768/390/375): `scrollWidth === innerWidth`; hero 900px;
  canvas рисует; этапы 35% → 80% → назад переключаются; reduced-motion — 3 статичных кадра, без canvas и intro;
  hover-превью видно; WorkIndex lazy-обложки загружаются на мобильном; консоль без ошибок.
- Исправлено: `useReducedMotion` (файл был пустым), путь импорта HeroVisual, skip-link теперь ≥ 44px.
- Известное ограничение: в headless Chromium intro занимает ~2.9 s из-за software WebGL; на обычном GPU короче.
- Коммиты: этим коммитом.

## Этап 2 — motion-инфраструктура (сделано)
- `src/motion/lenis.ts`: Lenis только для `(pointer: fine)` и без `prefers-reduced-motion`; `ScrollTrigger.update`
  на scroll, кадр Lenis из `gsap.ticker`, безопасный teardown и реакция на смену media queries.
- `src/components/RouteTransition.tsx`: общий переход между маршрутами. Плашка `--void` поднимается снизу
  (550 ms), затем маршрут меняется и плашка уходит вверх (550 ms); `transform` + GSAP, уникальные переходы,
  блокировка повторных кликов во время перехода.
- Обработка ссылок: внешние, `target`, `download`, `rel="external"`, изменённые клики и hash-only ссылки
  не перехватываются. Back/Forward приводят URL и экран к выбранной записи истории.
- Reduced motion: Lenis не создаётся, плашка `display: none`, навигация мгновенная; scrollTop сбрасывается.
- Проверки (Chromium 157 + preview): прямой вход `/PROSTI/works/toner` — 200; переход Home → Works и
  Back/Forward дают правильные заголовки, плашка возвращается за экран; 375 / 390 / 768 / 1024 / 1440 —
  `scrollWidth === innerWidth`; body 16px; внешних/битых ссылок нет.
- Известное ограничение: skip-link высотой 38px (<44px) — исправлено в этапе 3 (теперь ≥ 44px).
- `public/favicon.svg` + link в `index.html` — убран 404 favicon из консоли.
- Коммиты: `5c327bf`, `cc4978a`, `4d8595f`, `34d8aec`, favicon — этим коммитом.

## Этап 0B — каркас (сделано)
- Vite 8 + React 18 + TypeScript strict; react-router-dom, gsap, @gsap/react, lenis, ogl.
- Шрифты self-hosted: `@fontsource-variable/inter-tight`, `@fontsource/jetbrains-mono` (latin + cyrillic в сборке).
- `src/config.ts` (placeholder + TODO), `src/content/projects.ts` (4 концепта, `concept: true`).
- `src/styles/tokens.css`, `global.css` — токены по DESIGN.md, без цвета/скруглений/теней.
- BrowserRouter, basename из `BASE_URL`; маршруты `/`, `/about`, `/works`, `/works/:slug`, `/services`, `/contact`, `*`.
- Оболочка: навигация по 4 углам на ≥1024, `[ SURKOV ]` сверху по центру; на <1024 кнопка `MENU` снизу справа,
  полноэкранная `--void` панель (Esc, клик по ссылке, смена роута закрывают; скролл блокируется; ловушка фокуса).
  Футер с микротипографикой, глобальное зерно (статично при reduced-motion), курсор-метка только `pointer: fine`, skip-link.
- Страницы — оформленные заглушки (`PageStub`: номер раздела, мега-заголовок, линия, ссылка назад, rule-rows).
- Деплой: `.github/workflows/deploy.yml` (Actions → Pages), `public/.nojekyll`.
  `scripts/spa-fallback.mjs`: `404.html` + копии `index.html` для известных маршрутов (`works/toner.html` и т.д.) — прямой заход отдаёт 200.
- Проверки после деплоя: `/`, `/about`, `/works`, `/works/toner`, `/services`, `/contact`, JS, CSS — 200; `/nope` — 404 с SPA-страницей 404.
- Не проверено: DOM-замеры в браузере (Playwright: нет Chrome в окружении). Сделать на этапе аудита.
- Коммиты: `04f8a7f` (scaffold), `9947279` (SPA 200 fallback), далее — docs-коммит этого журнала.

## Аудит репозитория (старт)
- В репозитории только: `IMG_6558.jpeg` (референс), `BRIEF.md`, `REFERENCE.md`.
- README.md удалён заказчиком ранее (коммит `b92e478`).
- GitHub Pages не включён. GitHub Actions нет. CNAME нет, пользовательского домена нет.
- Ветка `main`, remote `origin`.

## Завершено
- [x] Изучены BRIEF и REFERENCE.
- [x] `DESIGN.md` — дизайн-система, дисторшн, движение, адаптив, a11y, архитектура, страницы.
- [x] `AGENTS.md` — постоянные инструкции.
- [x] `ASSETS.md` — промпты первой волны (17 ассетов).
- [x] `README.md`.

## Изменённые файлы
- `DESIGN.md`, `AGENTS.md`, `PROGRESS.md`, `ASSETS.md`, `README.md` — созданы.

## Коммиты
- `docs: add design system, agent rules, asset prompts and progress log` (этап 0A).

## Осталось
Нет. Все этапы BRIEF закрыты. Перед публикацией реальных данных заполнить `src/config.ts` (контакты,
фото, endpoint формы) — см. раздел ниже.

## Известные ограничения
- Изображения нельзя открывать инструментом read (обрыв сессии). Визуальный контроль — DOM-замеры.
- Доступность видеомоделей и моделей изображений не проверена. Если видео не сгенерировать — сообщить и сделать альтернативу из кадров изображений, не выдавая её за видео.
- Финальный «аудит на скриншотах» из BRIEF §11 ограничен: скриншоты нельзя смотреть самому агенту.

## Неизвестные данные заказчика (заполнить в `src/config.ts`)
- Email — нет.
- Телефон — нет.
- Telegram / соцсети / Behance / Dribbble / GitHub — нет.
- Город — нет (известно: Россия).
- Фото Артёма — нет (используется анонимный stand-in).
- Реальные кейсы — нет (4 концепта, помечены `CONCEPT`).
- Endpoint для формы (Formspree и т.п.) — нет.
- Цены услуг — нет (не публикуются).

## Следующий шаг
Заполнить реальные данные заказчика в `src/config.ts` (email, Telegram, телефон, город, фото, endpoint
формы) и заменить stand-in фото. После этого — `npm run build`, commit, push.
