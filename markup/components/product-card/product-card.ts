import type { Product, ProductSize, StarType } from '../../types';
import { RATING_CONFIG } from '../../constants/ui-config';
import { createStarSvg, createHalfStarSvg } from '../icons/svg-icons';
import { ButtonFactory } from '../button-factory';
import { SizeValidator } from '../../utils/size-validator';

export type { Product, ProductSize };

const renderRating = (productId: number, rating?: number | null, reviewsCount?: number): string => {
  const safeRating = typeof rating === 'number' ? rating : null;

  if (
    safeRating === null ||
    Number.isNaN(safeRating) ||
    safeRating <= 0 ||
    safeRating > RATING_CONFIG.MAX_RATING
  ) {
    return '';
  }

  const fullStars = Math.floor(safeRating);
  const halfStar = safeRating % 1 >= RATING_CONFIG.HALF_STAR_THRESHOLD;
  const emptyStars = RATING_CONFIG.MAX_RATING - fullStars - (halfStar ? 1 : 0);

  const stars: StarType[] = [];
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
          RATING_CONFIG.COLORS.FULL_STAR
        )}</span>`;
      }

      if (type === 'half') {
        const gradientId = `star-grad-${productId}-${index}`;
        return `<span class="star star--half" aria-hidden="true">${createHalfStarSvg(
          gradientId
        )}</span>`;
      }

      return `<span class="star star--empty" aria-hidden="true">${createStarSvg(RATING_CONFIG.COLORS.EMPTY_STAR)}</span>`;
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
      const formattedSize = SizeValidator.formatSizeOption(size);
      return `<option value="${size.value}" data-available="${size.available}" ${
        size.available ? '' : 'disabled'
      }>${formattedSize}</option>`;
    })
    .join('');

  const dropdownItems = sizes
    .map(size => {
      const formattedSize = SizeValidator.formatSizeOption(size);
      const classes = ['dropdown-item'];
      if (!size.available) {
        classes.push('dropdown-item--unavailable', 'disabled');
      }
      const attributes = [
        `type="button"`,
        `class="${classes.join(' ')}"`,
        `data-value="${size.value}"`,
        `data-available="${size.available}"`,
        !size.available ? 'tabindex="-1" aria-disabled="true" disabled' : 'aria-disabled="false"',
      ].join(' ');

      return `<li><button ${attributes}>${formattedSize}</button></li>`;
    })
    .join('');

  return `
      <div class="product-card__size-select">
        <label class="product-card__size-label" for="${selectId}">Размер</label>
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
  <div class="product-card__price">
    <span class="product-card__price-current">${formatPrice(product.price)}</span>
    ${
      product.oldPrice
        ? `<span class="product-card__price-old">${formatPrice(product.oldPrice)}</span>`
        : ''
    }
    ${product.discount ? `<span class="product-card__price-discount">-${product.discount}%</span>` : ''}
  </div>
`;

const renderColorDot = (product: Product): string => {
  if (!product.colorHex) return '';
  return `<div class="product-card__color-dot" style="background-color: ${product.colorHex};" aria-label="Цвет товара"></div>`;
};

const renderRemoveButton = (productId: number): string =>
  ButtonFactory.createRemoveButton(productId);

const renderActionButton = (product: Product): string => ButtonFactory.createActionButton(product);

const renderCardBody = (product: Product): string => {
  const ratingHtml = renderRating(product.id, product.rating, product.reviewsCount);
  const ratingBlock = ratingHtml
    ? `<div class="product-card__rating">${ratingHtml}</div>`
    : `<div class="product-card__rating product-card__rating--empty" aria-hidden="true"></div>`;

  return `
    <div class="product-card__body">
      <div class="product-card__content">
        <div class="product-card__price-row">
          ${renderPriceBlock(product)}
          ${renderRemoveButton(product.id)}
        </div>
        <h3 class="product-card__title">${product.title}</h3>
      ${renderColorDot(product)}
      ${ratingBlock}
      </div>
      ${renderSizeSelect(product.id, product.sizes, product.inStock)}
      <div class="product-card__buttons">
        ${renderActionButton(product)}
      </div>
      ${ButtonFactory.createFavoriteButton(product.id)}
    </div>
  `;
};

export const renderProductCard = (product: Product): string => {
  const cardClasses = product.inStock ? 'product-card card' : 'product-card card out-of-stock';

  return `
    <div class="${cardClasses}" data-product-id="${product.id}">
      <div class="product-card__image-container">
        <img src="${product.image}" class="product-card__image" alt="${product.title}" loading="lazy">
      </div>
      ${renderCardBody(product)}
    </div>
  `;
};

export const renderFavoritesGrid = (products: Product[]): string => {
  if (products.length === 0) {
    return '<div class="favorites__grid"></div>';
  }

  const cards = products.map(renderProductCard).join('');
  return `<div class="favorites__grid">${cards}</div>`;
};
