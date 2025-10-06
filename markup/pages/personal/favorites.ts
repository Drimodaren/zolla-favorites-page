import $ from 'jquery';
import { renderFavoritesGrid, type Product } from '../../components/product-card/product-card';
import { renderEmptyState } from '../../components/empty-state/empty-state';
import {
  initializeSizeSelectInteractions,
  markSizeSelectInvalid,
  updateSizeSelectState,
} from '../../components/product-card/size-select';
import 'bootstrap';

interface FavoritesData {
  items: Product[];
}

const fetchFavorites = (url: string) => $.getJSON<FavoritesData>(url);

class FavoritesManager {
  private products: Product[] = [];
  private $favoritesContent: JQuery;

  constructor() {
    this.$favoritesContent = $('#favoritesContent');

    this.init();
  }

  public init(): void {
    this.loadFavorites();

    this.bindEvents();
  }

  private loadFavorites(): void {
    const body = document.querySelector('body');
    const dataUrl = body?.getAttribute('data-favorites-src') ?? 'mock/favorites.json';

    fetchFavorites(dataUrl)
      .done(data => {
        this.products = data.items;
        const totalFavorites = data.items.length;
        $('#favoritesCount').text(totalFavorites.toString());

        this.renderFavoritesPage();
      })
      .fail(() => {
        console.error('Ошибка при загрузке данных избранных товаров');
        this.$favoritesContent.html(`
          <div class="alert alert-danger" role="alert">
            Произошла ошибка при загрузке избранных товаров. Пожалуйста, попробуйте обновить страницу.
          </div>
        `);
      });
  }

  private bindEvents(): void {
    this.$favoritesContent.on('click', '.btn-remove', (e: JQuery.TriggeredEvent) =>
      this.handleRemoveProduct(e as JQuery.ClickEvent)
    );
    this.$favoritesContent.on('click', '[data-gtm="add-to-cart"]', (e: JQuery.TriggeredEvent) =>
      this.handleAddToCart(e as JQuery.ClickEvent)
    );
    initializeSizeSelectInteractions(this.$favoritesContent);

    $('.favorites-back').on('click', () => {
      if (window.history.length > 1) {
        window.history.back();
      } else {
        window.location.assign('/');
      }
    });
  }

  private renderFavoritesPage(): void {
    if (!this.products || this.products.length === 0) {
      this.$favoritesContent.html(renderEmptyState());
      return;
    }

    const productsHtml = renderFavoritesGrid(this.products);
    this.$favoritesContent.html(productsHtml);

    this.$favoritesContent.find('.size-select select').each((_, element) => {
      updateSizeSelectState($(element));
    });
  }

  private handleRemoveProduct(event: JQuery.ClickEvent): void {
    event.preventDefault();
    const $button = $(event.currentTarget);
    const productId = parseInt($button.data('product-id') as string);
    const productTitle = this.findProductById(productId)?.title || 'Товар';

    this.products = this.products.filter(product => product.id !== productId);

    $('#favoritesCount').text(this.products.length.toString());

    const $productCard = $button.closest('.product-card');
    $productCard.fadeOut(300, () => {
      $productCard.remove();

      if (this.products.length === 0) {
        this.$favoritesContent.html(renderEmptyState());
      }
    });

    console.info(`Товар "${productTitle}" (ID: ${productId}) удален из избранного`);
  }

  private handleAddToCart(event: JQuery.ClickEvent): void {
    event.preventDefault();
    const $button = $(event.currentTarget);
    const productId = parseInt($button.data('product-id') as string);
    const product = this.findProductById(productId);

    if (!product) return;

    const $sizeSelectWrapper = $button.closest('.card-body').find('.size-select');
    const $sizeSelect = $sizeSelectWrapper.find('select');
    const selectedSizeValue = $sizeSelect.val() as string | null;

    if (!selectedSizeValue) {
      markSizeSelectInvalid($sizeSelectWrapper);
      return;
    }

    const sizeInfo = product.sizes.find(size => size.value === selectedSizeValue);

    if (!sizeInfo || !sizeInfo.available) {
      markSizeSelectInvalid($sizeSelectWrapper);
      console.info(`Размер ${selectedSizeValue} недоступен для товара ${product.title}`);
      return;
    }

    updateSizeSelectState($sizeSelect);

    $button.prop('disabled', true).text('Добавлено ✓');
    setTimeout(() => {
      $button.prop('disabled', false).text('В корзину');
    }, 2000);

    const $cartCount = $('#cartCount');
    const currentCount = parseInt($cartCount.text() as string, 10) || 0;
    $cartCount.text((currentCount + 1).toString());

    console.info(
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
