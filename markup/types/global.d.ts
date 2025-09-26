declare module 'jquery' {
  export = jQuery;
}

declare module 'bootstrap' {
  export interface Modal {
    show(): void;
    hide(): void;
    toggle(): void;
    dispose(): void;
    handleUpdate(): void;
  }

  export interface ModalStatic {
    new (element: HTMLElement, options?: Record<string, unknown>): Modal;
    getInstance(element: HTMLElement): Modal | null;
  }

  export const Modal: ModalStatic;
}

interface JQueryStatic {
  getJSON<T>(url: string): JQuery.jqXHR<T>;
  (selector: string | Element | Document | JQuery): JQuery;
  (readyCallback: ($: JQueryStatic) => void): void;
}

interface JQuery<TElement = HTMLElement> {
  modal(options?: string | object): JQuery<TElement>;
  animate(
    properties: object,
    duration?: number,
    easing?: string,
    complete?: () => void
  ): JQuery<TElement>;
  fadeOut(duration?: number, complete?: () => void): JQuery<TElement>;
  empty(): JQuery<TElement>;
  text(text?: string): JQuery<TElement> | string;
  html(htmlString?: string): JQuery<TElement> | string;
  val(value?: string | string[] | number): JQuery<TElement> | string | string[] | number;
  addClass(className: string): JQuery<TElement>;
  removeClass(className: string): JQuery<TElement>;
  hasClass(className: string): boolean;
  toggleClass(className: string, state?: boolean): JQuery<TElement>;
  append(content: string | JQuery): JQuery<TElement>;
  prepend(content: string | JQuery): JQuery<TElement>;
  appendTo(target: string | JQuery): JQuery<TElement>;
  prependTo(target: string | JQuery): JQuery<TElement>;
  show(): JQuery<TElement>;
  hide(): JQuery<TElement>;
  prop(propertyName: string): unknown;
  prop(propertyName: string, value: unknown): JQuery<TElement>;
  attr(attributeName: string): string | undefined;
  attr(attributeName: string, value: string): JQuery<TElement>;
  data(key: string): unknown;
  data(key: string, value: unknown): JQuery<TElement>;
  on<K extends keyof HTMLElementEventMap>(
    events: K,
    handler: (this: TElement, ev: HTMLElementEventMap[K]) => void | boolean
  ): JQuery<TElement>;
  on<K extends keyof HTMLElementEventMap>(
    events: K,
    selector: string,
    handler: (this: TElement, ev: HTMLElementEventMap[K]) => void | boolean
  ): JQuery<TElement>;
  on(
    events: string,
    handler: (this: TElement, ev: JQuery.TriggeredEvent) => void | boolean
  ): JQuery<TElement>;
  on(
    events: string,
    selector: string,
    handler: (this: TElement, ev: JQuery.TriggeredEvent) => void | boolean
  ): JQuery<TElement>;
  find(selector: string): JQuery<TElement>;
  closest(selector: string): JQuery<TElement>;
  each(fn: (i: number, el: TElement) => void): JQuery<TElement>;
  remove(): JQuery<TElement>;
  offset(): { top: number; left: number } | undefined;
}

declare namespace JQuery {
  interface TriggeredEvent extends Event {
    currentTarget: Element;
  }

  interface jqXHR<T> extends Promise<T> {
    done(callback: (data: T) => void): jqXHR<T>;
    fail(
      callback: (jqXHR: jqXHR<unknown>, textStatus: string, errorThrown: string) => void
    ): jqXHR<T>;
  }

  interface ClickEvent extends TriggeredEvent {
    readonly type: 'click';
  }

  interface ChangeEvent extends TriggeredEvent {
    readonly type: 'change';
  }
}

declare const $: JQueryStatic;
declare const jQuery: JQueryStatic;
declare const bootstrap: {
  Modal: bootstrap.ModalStatic;
};

declare global {
  interface Window {
    bootstrap: typeof bootstrap;
  }
}
