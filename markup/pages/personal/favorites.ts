import $ from 'jquery';
import { renderFavoritesGrid, type Product } from '../../components/product-card/product-card';
import { renderEmptyState } from '../../components/empty-state/empty-state';
import {
  initializeSizeSelectInteractions,
  markSizeSelectInvalid,
  updateSizeSelectState,
} from '../../components/product-card/size-select';
import { FavoritesService } from '../../services/favorites-service';
import { SizeValidator } from '../../utils/size-validator';
import { DOMUtils, ErrorHandler } from '../../utils/dom-utils';
import { SELECTORS, TIMING_CONFIG } from '../../constants/ui-config';
import 'bootstrap';

class FavoritesManager {
  private products: Product[] = [];
  private $favoritesContent: JQuery;

  constructor() {
    this.$favoritesContent = $(SELECTORS.FAVORITES_CONTENT);
    this.init();
  }

  public init(): void {
    this.loadFavorites();

    this.bindEvents();
  }

  private async loadFavorites(): Promise<void> {
    try {
      const data = await FavoritesService.fetchFavorites();
      this.products = data.items;
      DOMUtils.updateCounter(SELECTORS.FAVORITES_COUNT, data.items.length);
      this.renderFavoritesPage();
    } catch (error) {
      ErrorHandler.logError('Ошибка при загрузке данных избранных товаров', error as Error);
      ErrorHandler.showErrorMessage(
        SELECTORS.FAVORITES_CONTENT,
        'Произошла ошибка при загрузке избранных товаров. Пожалуйста, попробуйте обновить страницу.'
      );
    }
  }

  private bindEvents(): void {
    this.$favoritesContent.on('click', '.product-card__remove-button', (e: JQuery.TriggeredEvent) =>
      this.handleRemoveProduct(e as JQuery.ClickEvent)
    );
    this.$favoritesContent.on('click', '[data-gtm="add-to-cart"]', (e: JQuery.TriggeredEvent) =>
      this.handleAddToCart(e as JQuery.ClickEvent)
    );
    initializeSizeSelectInteractions(this.$favoritesContent);

    $(SELECTORS.BACK_BUTTON).on('click', () => {
      DOMUtils.handleBackNavigation();
    });
  }

  private renderFavoritesPage(): void {
    if (!this.products || this.products.length === 0) {
      this.$favoritesContent.html(renderEmptyState());
      return;
    }

    const productsHtml = renderFavoritesGrid(this.products);
    this.$favoritesContent.html(productsHtml);

    this.$favoritesContent.find(SELECTORS.SIZE_SELECT).each((_, element) => {
      updateSizeSelectState($(element));
    });
  }

  private handleRemoveProduct(event: JQuery.ClickEvent): void {
    event.preventDefault();
    const $button = $(event.currentTarget);
    const productId = DOMUtils.getProductIdFromElement($button);
    const productTitle = this.findProductById(productId)?.title || 'Товар';

    this.products = this.products.filter(product => product.id !== productId);
    DOMUtils.updateCounter(SELECTORS.FAVORITES_COUNT, this.products.length);

    const $productCard = $button.closest(SELECTORS.PRODUCT_CARD);
    DOMUtils.fadeOutAndRemove($productCard, TIMING_CONFIG.FADE_OUT_DURATION, () => {
      if (this.products.length === 0) {
        this.$favoritesContent.html(renderEmptyState());
      }
    });

    ErrorHandler.logInfo(`Товар "${productTitle}" (ID: ${productId}) удален из избранного`);
  }

  private handleAddToCart(event: JQuery.ClickEvent): void {
    event.preventDefault();
    const $button = $(event.currentTarget);
    const productId = DOMUtils.getProductIdFromElement($button);
    const product = this.findProductById(productId);

    if (!product) return;

    const $sizeSelectWrapper = $button
      .closest('.product-card__body')
      .find(SELECTORS.SIZE_SELECT_WRAPPER);
    const $sizeSelect = $sizeSelectWrapper.find('select');
    const selectedSizeValue = $sizeSelect.val() as string | null;

    const validation = SizeValidator.validateSizeSelection(product, selectedSizeValue);

    if (!validation.isValid) {
      markSizeSelectInvalid($sizeSelectWrapper);
      if (validation.message) {
        ErrorHandler.logInfo(validation.message);
      }
      return;
    }

    updateSizeSelectState($sizeSelect);
    DOMUtils.showTemporaryMessage($button, 'Добавлено ✓', TIMING_CONFIG.BUTTON_RESET_DELAY);
    DOMUtils.incrementCounter(SELECTORS.CART_COUNT);

    ErrorHandler.logInfo(
      `Товар "${product.title}" (ID: ${product.id}, размер: ${selectedSizeValue}) добавлен в корзину`
    );
  }

  private findProductById(productId: number): Product | undefined {
    return this.products.find(product => product.id === productId);
  }
}
$(() => {
  new FavoritesManager();
});
