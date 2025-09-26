export function renderSuccessModal(): string {
  return `
    <div class="modal fade success-modal" id="successModal" tabindex="-1" aria-labelledby="successModalLabel" aria-hidden="true">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Закрыть"></button>
          </div>
          <div class="modal-body text-center">
            <div class="success-icon mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <path d="M8 12l2 2 6-6"></path>
              </svg>
            </div>
            <h5 class="mb-4">Вы подписались!</h5>
            <p class="mb-4">Мы сообщим о поступлении товара в наш магазин.</p>
            <button type="button" class="btn btn-primary" data-bs-dismiss="modal">Вернуться в избранное</button>
          </div>
        </div>
      </div>
    </div>
  `;
}
