# Zolla Favorites Page

Адаптивная страница «Избранное» интернет-магазина Zolla. Реализована на TypeScript + SCSS c использованием Bootstrap 5 и jQuery, собирается связкой Gulp + Webpack.

## Возможности
- загрузка списка избранных товаров из моковых данных;
- карточки товаров с выбором размера, отображением скидок и рейтинга;
- имитация добавления в корзину и удаления из избранного;
- модальное окно подписки на уведомление о поступлении товара;
- пустое состояние, когда список избранного пуст;
- адаптивная верстка (desktop и mobile макеты из Figma).

## Быстрый старт
```bash
npm install
npm run dev
```
После запуска dev-режима страница доступна по адресу `http://localhost:3000/pages/personal/favorites.html`.

## Скрипты npm
| Скрипт | Назначение |
| --- | --- |
| `npm run dev` | запуск режима разработки с live reload |
| `npm run build` | production-сборка (результат в `dist/`) |
| `npm run clean` | очистка артефактов сборки |
| `npm run lint:js` | проверка TypeScript ESLint-ом |
| `npm run lint:css` | проверка SCSS Stylelint-ом |
| `npm run format` | форматирование исходников Prettier-ом |
| `npm run deploy` | сборка и подготовка `docs/` для деплоя на GitHub Pages |

## Развёртывание на GitHub Pages
1. Выполните `npm run deploy`.
2. Закоммитьте содержимое папки `docs/` и запушьте изменения.
3. В настройках репозитория GitHub включите Pages и укажите источник `main` → `/docs`.

## Структура проекта
```
markup/
  pages/personal/favorites.{html,scss,ts}
  components/
    product-card/
    empty-state/
    subscribe-modal/
  styles/_utilities.scss
  mock/favorites.json
  assets/images/

scripts/           вспомогательные ноды-скрипты (prepare-gh-pages.js)
webpack.config.js  настройки бандлера
gulpfile.js        пайплайн сборки
```

## Макеты
- [Desktop](https://www.figma.com/design/MYRHZmUgTqKS7eCsqYRlTQ/Zolla-v3?node-id=3218-25522&t=mh2MfsGm80LyT1yt-0)
- [Mobile](https://www.figma.com/design/MYRHZmUgTqKS7eCsqYRlTQ/Zolla-v3?node-id=3248-48344&t=mh2MfsGm80LyT1yt-0)

## Контроль качества
- TypeScript и SCSS проходят lint (`npm run lint:js`, `npm run lint:css`).
- В проекте обеспечены базовые требования доступности (aria-атрибуты, focus-styles).
- Код оформлен согласно настройкам `.eslintrc.cjs`, `stylelint.config.cjs`, `.prettierrc`.

## Автор
Разработка в рамках тестового задания. EOF
