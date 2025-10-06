interface ProductSize {
  value: string;
  available: boolean;
}

export interface Product {
  id: number;
  title: string;
  brand: string;
  price: number;
  oldPrice: number | null;
  discount: number | null;
  rating?: number | null;
  reviewsCount?: number;
  image: string;
  inStock: boolean;
  sizes: ProductSize[];
  colorHex?: string;
}

const renderRating = (
  productId: number,
  rating?: number | null,
  reviewsCount?: number
): string => {
  const safeRating = typeof rating === 'number' ? rating : null;

  if (safeRating === null || Number.isNaN(safeRating) || safeRating <= 0) {
    return '';
  }

  const fullStars = Math.floor(safeRating);
  const halfStar = safeRating % 1 >= 0.5;
  const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);
  const starPath =
    "M6.09194 0.968665C6.44936 0.193793 7.55064 0.193793 7.90806 0.968665L9.02264 3.38508C9.16831 3.70089 9.4676 3.91833 9.81296 3.95928L12.4555 4.2726C13.3029 4.37307 13.6432 5.42046 13.0167 5.99983L11.063 7.80658C10.8077 8.0427 10.6934 8.39454 10.7611 8.73565L11.2798 11.3457C11.4461 12.1827 10.5551 12.83 9.8105 12.4132L7.48844 11.1134C7.18497 10.9435 6.81503 10.9435 6.51156 11.1134L4.1895 12.4132C3.44489 12.83 2.55393 12.1827 2.72024 11.3457L3.23885 8.73565C3.30663 8.39454 3.19232 8.0427 2.93698 7.80658L0.983254 5.99983C0.356754 5.42046 0.697071 4.37307 1.54446 4.2726L4.18704 3.95928C4.5324 3.91833 4.83169 3.70089 4.97736 3.38508L6.09194 0.968665Z";

  const createStarSvg = (fill: string): string => `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 14 13" aria-hidden="true"  >
        <path d="${starPath}" fill="${fill}" />
      </svg>
    `;

  const createHalfStarSvg = (gradientId: string): string => `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 14 13" aria-hidden="true">
        <defs>
          <linearGradient id="${gradientId}" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="50%" stop-color="#FFB170" />
            <stop offset="50%" stop-color="#E0E4EF" />
            <stop offset="100%" stop-color="#E0E4EF" />
          </linearGradient>
        </defs>
        <path d="${starPath}" fill="url(#${gradientId})" />
      </svg>
    `;

  const stars: Array<'full' | 'half' | 'empty'> = [];
  for (let i = 0; i < fullStars; i++) {
    stars.push('full');
  }
  if (halfStar) {
    stars.push('half');
  }
  for (let i = 0; i < emptyStars; i++) {
    stars.push('empty');
  }

  const starsHtml = stars
    .map((type, index) => {
      if (type === 'full') {
        return `<span class="star star--full" aria-hidden="true">${createStarSvg(
          '#FFB170'
        )}</span>`;
      }

      if (type === 'half') {
        const gradientId = `star-grad-${productId}-${index}`;
        return `<span class="star star--half" aria-hidden="true">${createHalfStarSvg(
          gradientId
        )}</span>`;
      }

      return `<span class="star star--empty" aria-hidden="true">${createStarSvg('#E0E4EF')}</span>`;
    })
    .join('');

  const reviewsLabel =
    typeof reviewsCount === 'number' ? reviewsCount.toLocaleString('ru-RU') : null;

  return `
      <div class="rating" role="img" aria-label="Рейтинг ${safeRating.toFixed(1)} из 5">
        <div class="stars">${starsHtml}</div>
        ${
          reviewsLabel
            ? `<span class="reviews-count" aria-label="Количество отзывов">${reviewsLabel}</span>`
            : ''
        }
      </div>
    `;
};

const renderSizeSelect = (productId: number, sizes: ProductSize[], inStock: boolean): string => {
  if (sizes.length === 0) return '';

  const selectId = `product-${productId}-size`;

  const options = sizes
    .map(size => {
      const availabilityLabel = size.available ? '' : ' — нет в наличии';
      return `<option value="${size.value}" data-available="${size.available}" ${
        size.available ? '' : 'disabled'
      }>${size.value}${availabilityLabel}</option>`;
    })
    .join('');

  const dropdownItems = sizes
    .map(size => {
      const availabilityLabel = size.available ? '' : ' — нет в наличии';
      const classes = ['dropdown-item'];
      if (!size.available) {
        classes.push('dropdown-item--unavailable', 'disabled');
      }
      const attributes = [
        `type="button"`,
        `class="${classes.join(' ')}"`,
        `data-value="${size.value}"`,
        `data-available="${size.available}"`,
        !size.available ? 'tabindex="-1" aria-disabled="true" disabled' : 'aria-disabled="false"'
      ].join(' ');

      return `<li><button ${attributes}>${size.value}${availabilityLabel}</button></li>`;
    })
    .join('');

  return `
      <div class="size-select">
        <label class="size-select__label" for="${selectId}">Размер</label>
        <div class="dropdown form-select-dropdown">
          <button
            class="btn btn-dropdown form-select dropdown-toggle"
            type="button"
            id="${selectId}-dropdown"
            aria-expanded="false"
            data-product-available="${inStock}"
            data-placeholder="Размер"
            data-bs-toggle="dropdown"
            ${inStock ? '' : 'disabled'}
          >
            <span class="form-select__placeholder">Размер</span>
          </button>
          <ul class="dropdown-menu" aria-labelledby="${selectId}-dropdown">
            ${dropdownItems}
          </ul>
          <select id="${selectId}" class="visually-hidden" aria-label="Выберите размер" ${
            inStock ? '' : 'disabled'
          }>
            <option value="" selected disabled>Размер</option>
            ${options}
          </select>
        </div>
      </div>
    `;
};

const formatPrice = (price: number): string => new Intl.NumberFormat('ru-RU').format(price) + ' ₽';

const renderPriceBlock = (product: Product): string => `
  <div class="card-price">
    <span class="card-price__current">${formatPrice(product.price)}</span>
    ${
      product.oldPrice
        ? `<span class="card-price__old">${formatPrice(product.oldPrice)}</span>`
        : ''
    }
    ${product.discount ? `<span class="card-price__discount">-${product.discount}%</span>` : ''}
  </div>
`;

const renderColorDot = (product: Product): string => {
  if (!product.colorHex) return '';
  return `<div class="color-dot" style="background-color: ${product.colorHex};" aria-label="Цвет товара"></div>`;
};

const TRASH_ICON_SRC = '../../assets/images/trash.svg';
const HEART_ICON_INLINE = `
  <svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <path
      d="M16.6377 3.66553C18.162 3.60265 19.6698 4.36751 20.5938 5.77686C22.4088 8.54564 22.074 14.1389 13.9873 20.8325C12.8408 21.7813 11.1592 21.7813 10.0127 20.8325C1.92597 14.1389 1.59125 8.54562 3.40625 5.77686C4.33017 4.36754 5.83798 3.60265 7.3623 3.66553C8.87299 3.72792 10.4689 4.60882 11.5596 6.63623L12 7.45459L12.4404 6.63623C13.5311 4.60878 15.127 3.72793 16.6377 3.66553Z"
      fill="currentColor"
    />
  </svg>
`;

const renderRemoveButton = (productId: number): string => `
  <button type="button" class="btn-remove" aria-label="Удалить из избранного" data-gtm="remove-favorite" data-product-id="${productId}">
    <img src="${TRASH_ICON_SRC}" alt="Удалить из избранного" />
  </button>
`;
const renderFavoriteButton = (productId: number): string => `
  <button type="button" class="btn-favorite" aria-label="Добавить в избранное" data-gtm="add-favorite" data-product-id="${productId}">
    ${HEART_ICON_INLINE}
  </button>
`;

const renderActionButton = (product: Product): string => {
  if (product.inStock) {
    return `<button type="button" class="btn btn-primary" data-gtm="add-to-cart" data-product-id="${product.id}">В корзину</button>`;
  }

  return `<button type="button" class="btn btn-outline-primary" data-gtm="subscribe" data-product-id="${product.id}" data-bs-toggle="modal" data-bs-target="#subscribeModal">Подписаться</button>`;
};

const renderCardBody = (product: Product): string => {
  const ratingHtml = renderRating(product.id, product.rating, product.reviewsCount);
  const ratingBlock = ratingHtml
    ? `<div class="card-rating">${ratingHtml}</div>`
    : `<div class="card-rating card-rating--empty" aria-hidden="true"></div>`;

  return `
    <div class="card-body">
    ${renderFavoriteButton(product.id)}
      <div class="card-price-name-color">
        <div class="card-price-row">
          ${renderPriceBlock(product)}
          ${renderRemoveButton(product.id)}
        </div>
        <h3 class="card-title">${product.title}</h3>
      ${renderColorDot(product)}
      ${ratingBlock}
      </div>
      ${renderSizeSelect(product.id, product.sizes, product.inStock)}
      <div class="card-buttons">
        ${renderActionButton(product)}
      </div>
    </div>
  `;
};

export const renderProductCard = (product: Product): string => {
  const cardClasses = product.inStock ? 'product-card card' : 'product-card card out-of-stock';

  return `
    <div class="${cardClasses}" data-product-id="${product.id}">
      <div class="card-img-container">
        <img src="${product.image}" class="card-img-top" alt="${product.title}" loading="lazy">
      </div>
      ${renderCardBody(product)}
    </div>
  `;
};

export const renderFavoritesGrid = (products: Product[]): string => {
  if (products.length === 0) {
    return '<div class="favorites-grid"></div>';
  }

  const cards = products.map(renderProductCard).join('');
  return `<div class="favorites-grid">${cards}</div>`;
};
