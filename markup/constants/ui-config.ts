export const RATING_CONFIG = {
  MAX_RATING: 5,
  HALF_STAR_THRESHOLD: 0.5,
  COLORS: {
    FULL_STAR: '#FFB170',
    EMPTY_STAR: '#E0E4EF',
  },
} as const;

export const TIMING_CONFIG = {
  FADE_OUT_DURATION: 300,
  BUTTON_RESET_DELAY: 2000,
  SIZE_SELECT_ERROR_DURATION: 2000,
} as const;

export const SELECTORS = {
  FAVORITES_COUNT: '#favoritesCount',
  CART_COUNT: '#cartCount',
  FAVORITES_CONTENT: '#favoritesContent',
  BACK_BUTTON: '.favorites__back-button',
  PRODUCT_CARD: '.product-card',
  SIZE_SELECT_WRAPPER: '.product-card__size-select',
  SIZE_SELECT: '.product-card__size-select select',
} as const;

export const DATA_ATTRIBUTES = {
  PRODUCT_ID: 'product-id',
  GTM_ADD_TO_CART: 'add-to-cart',
  GTM_REMOVE_FAVORITE: 'remove-favorite',
  FAVORITES_SRC: 'data-favorites-src',
} as const;

export const CSS_CLASSES = {
  PRODUCT_CARD: 'product-card card',
  PRODUCT_CARD_OUT_OF_STOCK: 'product-card card out-of-stock',
  SIZE_SELECT_FILLED: 'product-card__size-select--filled',
  DROPDOWN_FILLED: 'btn-dropdown--filled',
  DROPDOWN_INVALID: 'is-invalid',
} as const;
