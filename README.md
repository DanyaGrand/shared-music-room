# Shared Music Room — только владелец загружает музыку

Публичная страница: `/`
Админка владельца: `/admin.html`

## Настройка

1. В Supabase открой Authentication → Users → Add user и создай свой аккаунт email/password.
2. Скопируй User UID этого пользователя.
3. Открой `supabase.sql`, замени `YOUR_ADMIN_USER_UUID` на этот UID и выполни SQL в Supabase SQL Editor.
4. В `app.js` и `admin.js` замени `ТВОЙ_PUBLISHABLE_KEY` на свой Publishable key.
5. Убедись, что Storage bucket называется `music`.
6. Залей файлы проекта в GitHub Pages.
7. Для загрузки открывай `https://danyagrand.github.io/shared-music-room/admin.html` и входи своим аккаунтом.

Обычная общая ссылка `/` не содержит формы загрузки. Посетители могут только выбирать и слушать песни.

Важно: в браузере/GitHub можно использовать только Publishable key. Secret key никогда не вставляй в JS.
