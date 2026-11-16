# ASSETS — первая волна

Все файлы — в `public/media/`. Исходники генерации сохраняются как `*-src.png`/`*.mp4` вне сборки или удаляются после конвертации.
Финальные форматы: AVIF + WebP (`srcset` 640/1080/1600/2400), вырезанные фигуры — с альфой.

## Общий стилевой блок (добавлять в КОНЕЦ каждого промпта)

```
STYLE: black and white only, fully desaturated, no color cast. Harsh high contrast, crushed deep blacks with
no shadow detail, blown-out paper-white highlights. Looks like a 1990s editorial photograph run through a
cheap office photocopier: heavy ISO 3200 film grain, toner streaks, slightly smeared edges, coarse halftone
dots visible in the midtones. Raw, analog, tactile, expensive-magazine art direction.
NEGATIVE: no text, no letters, no logos, no watermarks, no brand marks, no color, no gradients, no glossy
CGI look, no smiling at camera, no stock-photo poses, no bokeh blobs, no lens flare, no recognisable celebrity.
```

Обозначения: **M** — must-have, **N** — nice-to-have. Статус: `todo` / `generated` / `processed`.

---

### 1. `hero-object.webp` — M — todo
- Страница: Home, hero, центр композиции (под WebGL-дисторшн, нужна альфа).
- Модель: FLUX.2 Pro. AR 1:1, 2048px.
- Промпт:
```
A single sculptural object isolated on a flat pure white background: an old open laptop fused with a heavy
CRT monitor, tilted 20 degrees in three-quarter perspective, cables hanging down like roots, screen showing
only static noise. Hard single light from top left, long black cast shadow to the right. Studio still life,
centered, entire object visible with generous white margin for clean cut-out. [STYLE]
```

### 2. `float-01.webp` — M — todo
- Home, hero, плавающее фото слева сверху. Вырезанная фигура, альфа.
- Модель: Seedream 5.5. AR 3:4.
- Промпт:
```
Full-body figure in a long black hooded coat standing still, face hidden in the shadow of the hood, seen
from a low angle, on a plain white background for cut-out. Sharp silhouette edges, fabric folds rendered
as pure black shapes. [STYLE]
```

### 3. `float-02.webp` — M — todo
- Home, hero, плавающее фото справа снизу.
- Модель: FLUX.2 Pro. AR 4:5.
- Промпт:
```
Close-up of two hands holding a sheet of paper against a photocopier glass plate, bright scanner light
leaking between the fingers, paper edges overexposed, deep black background. Tight editorial crop. [STYLE]
```

### 4. `float-03.webp` — N — todo
- Home, hero, третье плавающее фото (только ≥1440).
- Модель: Recraft V4.1 (raster, photo style). AR 1:1.
- Промпт:
```
Brutalist concrete staircase seen from directly above, spiral geometry, a tiny lone figure in black at the
bottom, strong diagonal shadow cutting the frame in half. Architectural photograph. [STYLE]
```

### 5. `about-portrait.webp` — M — todo
- About, главный портрет (stand-in, не Артём). Canvas-halftone проявление.
- Модель: FLUX.2 Pro. AR 4:5, 2048px.
- Промпт:
```
Anonymous young man around twenty seen from behind and slightly to the side, short dark hair, oversized
black jacket, standing in front of a wall covered with pinned paper sketches and printed layouts, face not
visible. Single hard window light, half of the frame lost in black. Editorial portrait. [STYLE]
```

### 6. `about-space.webp` — N — todo
- About, секция «Подход», фоновая вставка.
- Модель: Seedream 5.5. AR 16:9.
- Промпт:
```
Empty underground pedestrian passage with raw concrete walls and a row of fluorescent tubes, one tube
flickering out, perfect one-point perspective, wet floor reflecting light. Wide architectural frame. [STYLE]
```

### 7. `work-null-archive-cover.webp` — M — todo
- Works + Project «NULL/ARCHIVE» (CONCEPT), обложка.
- Модель: FLUX.2 Pro. AR 16:9.
- Промпт:
```
Monumental brutalist concrete building photographed from street level with an extreme upward wide-angle
perspective, repeating rectangular windows, dramatic sky blown to white, a single small figure walking
past the base. [STYLE]
```

### 8. `work-null-archive-detail.webp` — N — todo
- Project «NULL/ARCHIVE», вторичное изображение.
- Модель: FLUX.2 Pro. AR 4:5.
- Промпт:
```
Macro detail of weathered raw concrete with formwork wood-grain imprint and a sharp shadow edge from a
balcony slab, abstract and tactile. [STYLE]
```

### 9. `work-toner-cover.webp` — M — todo
- Works + Project «TONER» (CONCEPT), обложка.
- Модель: Seedream 5.5. AR 4:5.
- Промпт:
```
A blank smartphone with a pure white screen lying on a messy pile of photocopied zine pages, top-down view,
torn edges, staples, folded corners, harsh flash from above with hard black shadows under each page.
Screen must stay completely blank and white. [STYLE]
```

### 10. `work-toner-detail.webp` — N — todo
- Project «TONER», процесс.
- Модель: FLUX.2 Pro. AR 16:9.
- Промпт:
```
Side view of an old office photocopier mid-copy, bright light bar sweeping under the lid, motion streaks
of light, dark room, a hand resting on the lid. [STYLE]
```

### 11. `work-signal-cover.webp` — M — todo
- Works + Project «SIGNAL 0» (CONCEPT), обложка.
- Модель: FLUX.2 Pro. AR 4:5.
- Промпт:
```
Figure in a black balaclava and headphones sitting at a cluttered radio desk with a vintage microphone,
face mostly in deep shadow, single hard side light, wires and knobs as graphic black shapes. [STYLE]
```

### 12. `work-concrete-cover.webp` — M — todo
- Works + Project «CONCRETE.DEV» (CONCEPT), обложка.
- Модель: Recraft V4.1 (raster, photo style). AR 16:9.
- Промпт:
```
A row of three old laptops standing open on a raw concrete floor in an empty warehouse, each screen glowing
blank white, long parallel shadows across the floor, high window light from the left. [STYLE]
```

### 13. `tex-services.webp` — M — todo
- Services, фоновая фактура (repeat-friendly), opacity в вёрстке 0.3–0.6.
- Модель: Recraft V4.1. AR 1:1, 2048px.
- Промпт:
```
Seamless tileable texture of a photocopied blank sheet of paper: toner dust, faint streaks, uneven grey
patches, coarse halftone noise, scanner edge shadow. Flat, even, no objects. [STYLE]
```

### 14. `contact-crowd.webp` — M — todo
- Contact, панорама под чёрной плашкой (как в референсе — собственная версия). Силуэт, альфа по небу.
- Модель: FLUX.2 Pro. AR 21:9 (или 16:9 с кропом).
- Промпт:
```
Panoramic photograph of a crowd of people in dark hooded jackets seen from behind, standing among ruins
of a concrete structure, pale empty sky above, nobody facing the camera, silhouettes merging into one
dark mass. [STYLE]
```

### 15. `contact-figure.webp` — M — todo
- Contact, вертикальная вырезанная фигура рядом с блоком `;INFO`. Альфа.
- Модель: Seedream 5.5. AR 3:4.
- Промпт:
```
Full-body figure in a long dark trench coat walking away, holding a large blank sheet of paper under the
arm, plain white background for cut-out, hard shadow on the ground. [STYLE]
```

### 16. `process-loop.mp4` → `frames/process-####.webp` — M — todo
- Home, секция Process, видеоскролл (scrub по кадрам, §7.3 DESIGN.md).
- Модель: Veo 3.1 (основная), Kling 3.0 Pro (резерв), Seedance 2.5 / Wan 3.0 (запас).
- AR 16:9, 1080p, **10 сек**, 24 fps, без звука.
- Промпт:
```
A single slow continuous camera move, no cuts. The camera glides forward at walking pace through a dim
empty design studio built from raw concrete: past a table covered with photocopied layouts, past a glowing
CRT monitor showing static, past a hanging sheet of paper fluttering slightly, ending framed on an open
window flooded with white light. Smooth dolly, constant speed, no shake, no zoom jumps. The first and last
frames share similar exposure and composition rhythm so the clip can loop. No people in close-up, no faces,
no readable text on any surface. [STYLE]
```
- Обработка: `ffmpeg` → 120 кадров 1280px WebP (desktop), 60 кадров 640px (mobile), q≈70.

### 17. `process-poster-01..03.webp` — M — todo
- Home, Process: фолбэк reduced-motion / слабые устройства + `poster`.
- Источник: кадры 0%, 50%, 100% из `process-loop.mp4`. Если видео не сгенерировано — те же три сцены
  моделью FLUX.2 Pro (AR 16:9) по описанию промпта №16, разделённому на три кадра, и честная пометка в PROGRESS.

---

Итого: 17 позиций (13 must-have, 4 nice-to-have — №4, 6, 8, 10). Порядок генерации:
1 → 2 → 3 → 5 → 7, 9, 11, 12 → 14, 15 → 13 → 16 → 17 → nice-to-have.
