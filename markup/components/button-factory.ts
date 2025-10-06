import type { ButtonConfig, Product } from '../types';
import { HEART_ICON_INLINE } from '../components/icons/svg-icons';

export class ButtonFactory {
  static createActionButton(product: Product): string {
    const config: ButtonConfig = product.inStock
      ? {
          text: 'В корзину',
          type: 'primary',
          dataAttributes: {
            gtm: 'add-to-cart',
            'product-id': product.id,
          },
        }
      : {
          text: 'Нет в наличии',
          type: 'outline-primary',
          disabled: true,
          dataAttributes: {
            gtm: 'subscribe',
            'product-id': product.id,
          },
        };

    return this.createButton(config);
  }

  static createRemoveButton(productId: number): string {
    const iconSrc = '../../assets/images/trash.svg';
    const dataAttrs = this.formatDataAttributes({
      gtm: 'remove-favorite',
      'product-id': productId,
    });

    return `
      <button type="button" class="product-card__remove-button" aria-label="Удалить из избранного" ${dataAttrs}>
        <img src="${iconSrc}" alt="Удалить из избранного" />
      </button>
    `;
  }

  static createFavoriteButton(productId: number): string {
    const dataAttrs = this.formatDataAttributes({
      gtm: 'remove-favorite',
      'product-id': productId,
    });

    return `
      <button type="button" class="btn-favorite" aria-label="Убрать из избранного" ${dataAttrs}>
        ${HEART_ICON_INLINE}
      </button>
    `;
  }

  private static createButton(config: ButtonConfig): string {
    const { text, type, disabled = false, dataAttributes = {}, ariaLabel } = config;

    const dataAttrs = this.formatDataAttributes(dataAttributes);
    const disabledAttr = disabled ? 'disabled' : '';
    const ariaLabelAttr = ariaLabel ? `aria-label="${ariaLabel}"` : '';

    return `
      <button type="button" class="btn btn-${type}" ${dataAttrs} ${disabledAttr} ${ariaLabelAttr}>
        ${text}
      </button>
    `;
  }

  private static formatDataAttributes(attributes: Record<string, string | number>): string {
    return Object.entries(attributes)
      .map(([key, value]) => `data-${key}="${value}"`)
      .join(' ');
  }
}
