# 🎵 Shared Music Room — Supabase + GitHub Pages

Это версия, где песню загружает один человек, а **все посетители одной GitHub Pages-ссылки видят её и могут слушать**.

## 1. Создай Supabase

Открой https://supabase.com/ → создай проект.

После создания:
**Project Settings → API**

Скопируй:
- Project URL
- Publishable/anon public key (не service_role)

Открой `script.js` и замени:
`YOUR_SUPABASE_URL`
`YOUR_SUPABASE_ANON_KEY`

## 2. Создай таблицу

Supabase → **SQL Editor → New query**.

Скопируй содержимое `supabase.sql` и нажми **Run**.

## 3. Создай хранилище

Supabase → **Storage → New bucket**.

Название:
`music`

Сделай bucket **Public**.

Затем Storage → Policies создай:
- SELECT: разрешить `anon` и `authenticated` для bucket `music`
- INSERT: разрешить `anon` и `authenticated` для bucket `music`

Для учебного/личного проекта это простой вариант. Если сайт станет публичным, лучше добавить авторизацию, ограничения размера файлов и более строгие политики.

## 4. GitHub

Создай Public repository, например `shared-music`.

Загрузи:
- index.html
- style.css
- script.js

`supabase.sql` можно тоже загрузить — он не нужен сайту, но пригодится для настройки.

GitHub → **Settings → Pages**
→ Source: **Deploy from a branch**
→ Branch: **main**
→ Folder: **/(root)**
→ Save.

Через некоторое время GitHub выдаст ссылку.

## Как это работает

Пользователь A загружает MP3 → файл попадает в Supabase Storage → ссылка сохраняется в таблице `tracks`.

Пользователь B открывает ту же GitHub Pages-ссылку → сайт читает таблицу → песня появляется у него → он нажимает ▶ и слушает.

Новые загрузки появляются у уже открытых пользователей через Supabase Realtime.
