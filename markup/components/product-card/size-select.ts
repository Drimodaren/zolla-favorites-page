import $ from 'jquery';

const WRAPPER_SELECTOR = '.size-select';
const DROPDOWN_ITEM_SELECTOR = '.dropdown-item';
const DROPDOWN_BUTTON_SELECTOR = '.btn-dropdown';

const getDropdownInstance = (button: Element | null) => {
  if (!button || !window.bootstrap?.Dropdown) return null;
  const Dropdown = window.bootstrap.Dropdown;
  if (Dropdown.getOrCreateInstance) {
    return Dropdown.getOrCreateInstance(button);
  }
  const existing = Dropdown.getInstance?.(button);
  return existing ?? null;
};

const resetDropdownItems = ($wrapper: JQuery, value: string | null) => {
  const $items = $wrapper.find(DROPDOWN_ITEM_SELECTOR);
  $items.removeClass('active');

  if (!value) {
    return;
  }

  $items.each((_, element: HTMLElement) => {
    const $element = $(element);
    if ($element.data('value') === value) {
      $element.addClass('active');
    }
  });
};

export const updateSizeSelectState = ($select: JQuery): void => {
  const hasValue = Boolean($select.val());
  const $wrapper = $select.closest(WRAPPER_SELECTOR);
  const $button = $wrapper.find(DROPDOWN_BUTTON_SELECTOR);
  const placeholderText = ($button.data('placeholder') as string) || 'Размер';
  const selectedTextValue = hasValue
    ? $select.find('option:selected').text() || placeholderText
    : placeholderText;

  $wrapper.find('.form-select__placeholder').text(String(selectedTextValue).trim());

  if (hasValue) {
    $wrapper.addClass('size-select--filled');
    $button.addClass('btn-dropdown--filled');
    resetDropdownItems($wrapper, $select.val() as string);
  } else {
    $wrapper.removeClass('size-select--filled');
    $button.removeClass('btn-dropdown--filled');
    resetDropdownItems($wrapper, null);
  }

  $button.removeClass('is-invalid');
};

export const markSizeSelectInvalid = ($wrapper: JQuery): void => {
  const $button = $wrapper.find(DROPDOWN_BUTTON_SELECTOR);
  $button.addClass('is-invalid');
  window.setTimeout(() => {
    $button.removeClass('is-invalid');
  }, 2000);
};

export const initializeSizeSelectInteractions = (root: JQuery): void => {
  root.on('change', `${WRAPPER_SELECTOR} select`, (event: JQuery.TriggeredEvent) => {
    updateSizeSelectState($(event.currentTarget as HTMLElement));
  });

  root.on(
    'click',
    `${WRAPPER_SELECTOR} ${DROPDOWN_ITEM_SELECTOR}`,
    (event: JQuery.TriggeredEvent) => {
      const $item = $(event.currentTarget as HTMLElement);
      const isDisabled = $item.hasClass('disabled') || $item.attr('aria-disabled') === 'true';

      if (isDisabled) {
        event.preventDefault();
        return;
      }

      const value = $item.data('value') as string;
      const $wrapper = $item.closest(WRAPPER_SELECTOR);
      const $select = $wrapper.find('select');

      $select.val(value);
      ($select as JQuery<HTMLElement> & { trigger(event: string): void }).trigger('change');

      const dropdownButton =
        (
          $wrapper.find(DROPDOWN_BUTTON_SELECTOR) as JQuery<HTMLElement> & {
            get?(index: number): Element | undefined;
          }
        ).get?.(0) ?? null;
      const dropdown = getDropdownInstance(dropdownButton);
      dropdown?.hide?.();
    }
  );
};
