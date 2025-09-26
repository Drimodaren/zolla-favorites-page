export function renderSubscribeModal(): string {
  return `
    <div class="modal fade subscribe-modal" id="subscribeModal" tabindex="-1" aria-labelledby="subscribeModalLabel" aria-hidden="true">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="subscribeModalLabel">Подписаться на товар</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Закрыть"></button>
          </div>
          <div class="modal-body">
            <div class="product-info">
              <img src="" alt="" class="product-image" id="modal-product-image">
              <div class="product-details">
                <div class="product-brand" id="modal-product-brand"></div>
                <h6 class="product-title" id="modal-product-title"></h6>
                <div class="product-price" id="modal-product-price"></div>
              </div>
            </div>

            <form id="subscribeForm" novalidate>
              <input type="hidden" id="modal-product-id" value="">

              <div class="form-group">
                <label for="subscribeSize">Размер</label>
                <select class="form-select" id="subscribeSize" required>
                  <option value="" selected disabled>Выберите размер</option>
                </select>
                <div class="invalid-feedback">Пожалуйста, выберите размер</div>
              </div>

              <div class="form-group">
                <label for="subscribePhone">Телефон</label>
                <input type="tel" class="form-control" id="subscribePhone" placeholder="+7 (999) 123-45-67" required>
                <div class="form-text">Мы отправим вам SMS о поступлении товара</div>
                <div class="invalid-feedback">Пожалуйста, введите корректный номер телефона</div>
              </div>

              <div class="form-check">
                <input class="form-check-input" type="checkbox" id="agreeTerms" required>
                <label class="form-check-label" for="agreeTerms">
                  Я согласен с <a href="/terms" target="_blank">условиями обработки персональных данных</a>
                </label>
                <div class="invalid-feedback">Необходимо согласие с условиями</div>
              </div>
            </form>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-outline-secondary" data-bs-dismiss="modal" data-gtm="cancel-subscribe">Отмена</button>
            <button type="button" class="btn btn-primary" id="submitSubscribe" data-gtm="submit-subscribe">Подписаться</button>
          </div>
        </div>
      </div>
    </div>
  `;
}
