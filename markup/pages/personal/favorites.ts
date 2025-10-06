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
    this.$favoritesContent.on('change', '.size-select select', (e: JQuery.TriggeredEvent) => {
      this.updateSizeSelectState($(e.currentTarget));
    });

    this.$favoritesContent.on('click', '.size-select .dropdown-item', (e: JQuery.TriggeredEvent) => {
      const $item = $(e.currentTarget);
      const isDisabled = $item.hasClass('disabled') || $item.attr('aria-disabled') === 'true';
      if (isDisabled) {
        e.preventDefault();
        return;
      }

      const value = $item.data('value') as string;
      const $select = $item.closest('.size-select').find('select');
      $select.val(value).trigger('change');

      const dropdownButton = $item.closest('.size-select').find('.btn-dropdown')[0];
      if (dropdownButton && window.bootstrap?.Dropdown) {
        const dropdownInstance = window.bootstrap.Dropdown.getOrCreateInstance(dropdownButton as Element);
        dropdownInstance.hide();
      }

      $item.closest('.dropdown-menu').find('.dropdown-item').removeClass('active');
      $item.addClass('active');
    });

    $(document).on('click', '[data-bs-target="#subscribeModal"]', (e: JQuery.TriggeredEvent) =>
      this.handleOpenSubscribeModal(e as JQuery.ClickEvent)
    );
    $('#submitSubscribe').on('click', () => this.handleSubmitSubscribe());

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

    const $sizeSelectWrapper = $button.closest('.card-body').find('.size-select');
    const $sizeSelect = $sizeSelectWrapper.find('select');
    const $dropdownButton = $sizeSelectWrapper.find('.btn-dropdown');
    const selectedSizeValue = $sizeSelect.val() as string | null;

    if (!selectedSizeValue) {
      $dropdownButton.addClass('is-invalid');
      setTimeout(() => $dropdownButton.removeClass('is-invalid'), 2000);
      return;
    }

    const sizeInfo = product.sizes.find(size => size.value === selectedSizeValue);

    if (!sizeInfo || !sizeInfo.available) {
      $dropdownButton.addClass('is-invalid');
      setTimeout(() => $dropdownButton.removeClass('is-invalid'), 2000);
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
    const $button = $wrapper.find('.btn-dropdown');
    const placeholderText = ($button.data('placeholder') as string) || 'Размер';
    const selectedText = hasValue
      ? ($select.find('option:selected').text() || placeholderText)
      : placeholderText;
    $wrapper.find('.form-select__placeholder').text(selectedText.trim());

    if (hasValue) {
      $wrapper.addClass('size-select--filled');
      $button.addClass('btn-dropdown--filled');
      const selectedValue = $select.val() as string;
      const $items = $wrapper.find('.dropdown-item');
      $items.removeClass('active');
      $items
        .filter((_, element) => $(element).data('value') === selectedValue)
        .addClass('active');
    } else {
      $wrapper.removeClass('size-select--filled');
      $button.removeClass('btn-dropdown--filled');
      $wrapper.find('.dropdown-item').removeClass('active');
    }
  }
}

$(() => {
  new FavoritesManager();
});
