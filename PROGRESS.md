# PROGRESS — журнал работы

## Текущий этап
**2 — motion-инфраструктура.** Готово. Сайт: https://orskiyghost-png.github.io/PROSTI/

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
- Известное ограничение: skip-link высотой 38px (<44px) — исправить в этапе аудита.
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
1. 0B — генерация ассетов по `ASSETS.md` (must-have первыми), обработка: альфа-маски, AVIF/WebP, нарезка кадров видео.
2. 1 — каркас: Vite + React + TS, роутинг basename `/PROSTI/`, 404 fallback, токены, шрифты, зерно.
3. 2 — навигация, переходы страниц, Lenis + ScrollTrigger.
4. 3 — Home (hero, index, видеоскролл, manifest, close).
5. 4 — About, Works, Project, Services, Contact, 404.
6. 5 — GitHub Actions + Pages, проверка на реальном адресе.
7. 6 — аудит: адаптив, reduced-motion, консоль, производительность; циклы улучшений.

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
Этап 3: Home — hero с мега-именем и плавающими фото, index избранных работ, видеоскролл `process` по кадрам,
manifest и close-плашка. Затем About, Works, Project, Services, Contact.
