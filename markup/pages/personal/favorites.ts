import $ from 'jquery';
import { renderFavoritesGrid, type Product } from '../../components/product-card/product-card';
import { renderEmptyState } from '../../components/empty-state/empty-state';
import { renderSubscribeModal } from '../../components/subscribe-modal/subscribe-modal';
import { renderSuccessModal } from '../../components/subscribe-modal/success-modal';
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
    $('#subscribeModalContainer').html(renderSubscribeModal() + renderSuccessModal());

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
    this.$favoritesContent.on('change', '.size-select .form-select', (e: JQuery.TriggeredEvent) => {
      this.updateSizeSelectState($(e.currentTarget));
    });

    $(document).on('click', '[data-bs-target="#subscribeModal"]', (e: JQuery.TriggeredEvent) =>
      this.handleOpenSubscribeModal(e as JQuery.ClickEvent)
    );
    $('#submitSubscribe').on('click', () => this.handleSubmitSubscribe());
  }

  private renderFavoritesPage(): void {
    if (!this.products || this.products.length === 0) {
      this.$favoritesContent.html(renderEmptyState());
      return;
    }

    const productsHtml = renderFavoritesGrid(this.products);
    this.$favoritesContent.html(productsHtml);

    this.$favoritesContent.find('.size-select .form-select').each((_, element) => {
      this.updateSizeSelectState($(element));
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

    const $sizeSelect = $button.closest('.card-body').find('.form-select');
    const selectedSizeValue = $sizeSelect.val() as string | null;

    if (!selectedSizeValue) {
      $sizeSelect.addClass('is-invalid');
      setTimeout(() => $sizeSelect.removeClass('is-invalid'), 2000);
      return;
    }

    const sizeInfo = product.sizes.find(size => size.value === selectedSizeValue);

    if (!sizeInfo || !sizeInfo.available) {
      $sizeSelect.addClass('is-invalid');
      setTimeout(() => $sizeSelect.removeClass('is-invalid'), 2000);
      console.info(`Размер ${selectedSizeValue} недоступен для товара ${product.title}`);
      return;
    }

    this.updateSizeSelectState($sizeSelect);

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

  private handleOpenSubscribeModal(event: JQuery.ClickEvent): void {
    const $button = $(event.currentTarget);
    const productId = parseInt($button.data('product-id') as string);
    const product = this.findProductById(productId);

    if (!product) return;

    $('#modal-product-id').val(product.id);
    $('#modal-product-brand').text(product.brand);
    $('#modal-product-title').text(product.title);
    $('#modal-product-price').text(new Intl.NumberFormat('ru-RU').format(product.price) + ' ₽');
    $('#modal-product-image').attr('src', product.image).attr('alt', product.title);

    const $sizeSelect = $('#subscribeSize');
    $sizeSelect.empty().append('<option value="" selected disabled>Выберите размер</option>');

    product.sizes.forEach(size => {
      const optionLabel = size.available ? size.value : `${size.value} — нет в наличии`;
      $sizeSelect.append(`<option value="${size.value}">${optionLabel}</option>`);
    });

    const form = document.getElementById('subscribeForm') as HTMLFormElement | null;
    if (form) {
      form.reset();
      $(form).removeClass('was-validated');
    }

    console.info(
      `Открыто модальное окно подписки для товара "${product.title}" (ID: ${product.id})`
    );
  }

  private handleSubmitSubscribe(): void {
    const form = document.getElementById('subscribeForm') as HTMLFormElement;

    if (!form.checkValidity()) {
      $(form).addClass('was-validated');
      return;
    }

    const productId = $('#modal-product-id').val();
    const size = $('#subscribeSize').val();
    const phone = $('#subscribePhone').val();
    const agreeTerms = $('#agreeTerms').prop('checked');

    if (!agreeTerms) {
      return;
    }

    console.info('Подписка на товар:', {
      productId,
      size,
      phone,
    });

    const subscribeModalElement = document.getElementById('subscribeModal');
    if (subscribeModalElement) {
      const subscribeModal = window.bootstrap.Modal.getInstance(subscribeModalElement);
      if (subscribeModal) subscribeModal.hide();
    }

    setTimeout(() => {
      const successModalElement = document.getElementById('successModal');
      if (successModalElement && window.bootstrap) {
        const ModalClass = window.bootstrap.Modal as unknown as {
          new (element: Element): { show(): void; hide(): void };
        };
        const successModal = new ModalClass(successModalElement);
        successModal.show();
      }
    }, 500);
  }

  private findProductById(productId: number): Product | undefined {
    return this.products.find(product => product.id === productId);
  }

  private updateSizeSelectState($select: JQuery): void {
    const hasValue = Boolean($select.val());
    const $wrapper = $select.closest('.size-select');

    if (hasValue) {
      $wrapper.addClass('size-select--filled');
    } else {
      $wrapper.removeClass('size-select--filled');
    }
  }
}

$(() => {
  new FavoritesManager();
});
