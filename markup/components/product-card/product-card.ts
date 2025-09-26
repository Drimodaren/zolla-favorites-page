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
  rating: number;
  reviewsCount?: number;
  image: string;
  inStock: boolean;
  sizes: ProductSize[];
  colorHex?: string;
}

const renderRating = (productId: number, rating: number, reviewsCount?: number): string => {
  const fullStars = Math.floor(rating);
  const halfStar = rating % 1 >= 0.5;
  const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);
  const starPath =
    'M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z';
  const createStarSvg = (fill: string): string => `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" aria-hidden="true">
        <path d="${starPath}" fill="${fill}" />
      </svg>
    `;

  const createHalfStarSvg = (gradientId: string): string => `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" aria-hidden="true">
        <defs>
          <linearGradient id="${gradientId}" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="50%" stop-color="#FDB022" />
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
          '#FDB022'
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
      <div class="rating" role="img" aria-label="Рейтинг ${rating.toFixed(1)} из 5">
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
      return `<option value="${size.value}" data-available="${size.available}">${size.value}${availabilityLabel}</option>`;
    })
    .join('');

  return `
      <div class="size-select">
        <label class="size-select__label" for="${selectId}">Размер</label>
        <select id="${selectId}" class="form-select" aria-label="Выберите размер" data-product-available="${inStock}" ${
    inStock ? '' : 'disabled'
  }>
          <option value="" selected disabled>Размер</option>
          ${options}
        </select>
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

const renderRemoveButton = (productId: number): string => `
  <button type="button" class="btn-remove" aria-label="Удалить из избранного" data-gtm="remove-favorite" data-product-id="${productId}">
    <img src="../../assets/images/trash.svg" alt="Удалить из избранного" />
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

  return `
    <div class="card-body">
      <div class="card-price-row">
        ${renderPriceBlock(product)}
        ${renderRemoveButton(product.id)}
      </div>
      <h3 class="card-title">${product.title}</h3>
      ${renderColorDot(product)}
      <div class="card-rating">${ratingHtml}</div>
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
        ${product.discount ? `<div class="discount-badge">-${product.discount}%</div>` : ''}
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
