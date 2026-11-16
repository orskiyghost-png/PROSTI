# AGENTS — постоянные инструкции

## Перед работой
1. Прочитать `BRIEF.md` (источник истины), `REFERENCE.md`, `AGENTS.md`, `PROGRESS.md`, затем `DESIGN.md` и `ASSETS.md`.
2. Свериться с «Следующий шаг» в `PROGRESS.md`.

## Жёсткие запреты
- **Не открывать изображения инструментом read** (jpg, png, webp, avif, скриншоты Playwright). Провайдер обрывает сессию. Визуал — через `REFERENCE.md` и DOM-замеры (`getBoundingClientRect`, `scrollWidth`, computed styles).
- Не выдумывать клиентов, компании, отзывы, награды, статистику, контакты. Концепты помечать `CONCEPT`.
- Не имитировать отправку формы без настроенной доставки.
- Не использовать цвет, градиенты, стекло, мягкие тени, скругления (см. `DESIGN.md` §1).
- Не делать force push и не переписывать историю.
- Не менять `BRIEF.md` без прямого указания заказчика.

## Git
- Репозиторий `orskiyghost-png/PROSTI`, ветка `main`, remote `origin`.
- После каждого логического этапа: проверить → обновить `PROGRESS.md` → commit → `git push origin main`.
- Сообщения коммитов: Conventional Commits на английском (`feat:`, `fix:`, `docs:`, `chore:`).
- `git status` после push должен быть чистым.

## Код
- Vite + React + TypeScript (strict). GSAP + ScrollTrigger, Lenis, OGL. Подробно — `DESIGN.md` §10.
- Токены только из `src/styles/tokens.css`. Никаких «магических» цветов и отступов.
- CSS Modules на компонент. Именование компонентов PascalCase, хуков `useX`.
- Анимации: только `transform`/`opacity`/`clip-path`/uniform'ы. ScrollTrigger — `scrub` или `toggleActions: "play reverse play reverse"`. Каждая анимация обратима.
- Каждый эффект имеет ветку `prefers-reduced-motion` и фолбэк без WebGL.
- Чистить GSAP-контексты (`gsap.context().revert()`) при размонтировании.
- Данные заказчика — только в `src/config.ts`. Проекты — в `src/content/projects.ts`.

## Ассеты
- Медиа: `public/media/` (фото, кадры видео `public/media/frames/`, постеры). Шрифты: `public/fonts/`.
- Промпты и статус — `ASSETS.md`. Имена файлов строго по `ASSETS.md`.
- Пути в коде через `import.meta.env.BASE_URL`, никогда не `/media/...` от корня.

## Команды
```
npm install
npm run dev       # локальная разработка
npm run build     # production-сборка в dist/
npm run preview   # проверка сборки с base /PROSTI/
```

## Критерии проверки этапа
- `npm run build` без ошибок и предупреждений TS.
- Консоль браузера без ошибок на всех роутах.
- 375 / 390 / 768 / 1024 / 1440: `scrollWidth <= innerWidth`, тап-цели ≥ 44px, body ≥ 16px.
- Скролл вниз и обратно вверх: все анимации идут назад.
- Reduced-motion: контент доступен, без движения.
- Прямой заход на вложенный роут (`/PROSTI/works/toner`) работает после деплоя.
- Все ссылки и кнопки выполняют действие.
