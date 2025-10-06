import $ from 'jquery';

export class DOMUtils {
  static updateCounter(selector: string, count: number): void {
    $(selector).text(count.toString());
  }

  static incrementCounter(selector: string): void {
    const $counter = $(selector);
    const currentCount = parseInt(($counter.text() as string) || '0', 10);
    $counter.text((currentCount + 1).toString());
  }

  static fadeOutAndRemove($element: JQuery, duration = 300, callback?: () => void): void {
    $element.fadeOut(duration, () => {
      $element.remove();
      callback?.();
    });
  }

  static showTemporaryMessage(
    $button: JQuery,
    message: string,
    duration = 2000,
    originalText = 'В корзину'
  ): void {
    $button.prop('disabled', true).text(message);
    setTimeout(() => {
      $button.prop('disabled', false).text(originalText);
    }, duration);
  }

  static getProductIdFromElement($element: JQuery): number {
    return parseInt($element.data('product-id') as string, 10);
  }

  static handleBackNavigation(): void {
    if (window.history.length > 1) {
      window.history.back();
    } else {
      window.location.assign('/');
    }
  }
}

export class ErrorHandler {
  static logInfo(message: string): void {
    console.info(message);
  }

  static logError(message: string, error?: Error): void {
    console.error(message, error);
  }

  static showErrorMessage(selector: string, message: string): void {
    $(selector).html(`
      <div class="alert alert-danger" role="alert">
        ${message}
      </div>
    `);
  }
}
