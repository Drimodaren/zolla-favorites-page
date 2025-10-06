
interface JQuery<TElement = HTMLElement> {
  html(html: string): JQuery<TElement>;
  clone(): JQuery<TElement>;
  addClass(className: string): JQuery<TElement>;
  removeClass(className: string): JQuery<TElement>;
  attr(attributeName: string, value: string | number | boolean): JQuery<TElement>;
  attr(attributeName: string): string;
  append(content: JQuery<HTMLElement> | string): JQuery<TElement>;
  prepend(content: JQuery<HTMLElement> | string): JQuery<TElement>;
  on(eventType: string, handler: (event: Event) => void): JQuery<TElement>;
  on(eventType: string, selector: string, handler: (event: Event) => void): JQuery<TElement>;
  off(eventType: string, handler?: (event: Event) => void): JQuery<TElement>;
  val(): string | undefined;
  val(value: string | number | string[]): JQuery<TElement>;
  text(): string;
  text(text: string | number): JQuery<TElement>;
  prop(propertyName: string): string | number | boolean | undefined;
  prop(propertyName: string, value: string | number | boolean): JQuery<TElement>;
  data(key: string): string | number | object | undefined;
  find(selector: string): JQuery<TElement>;
  closest(selector: string): JQuery<TElement>;
  fadeOut(duration: number, complete?: () => void): JQuery<TElement>;
  animate(properties: object, duration?: number): JQuery<TElement>;
  offset(): { top: number, left: number };
  remove(): JQuery<TElement>;
  each(callback: (index: number, element: TElement) => void): JQuery<TElement>;
  empty(): JQuery<TElement>;
  ready(handler: () => void): JQuery<TElement>;
}

interface JQueryStatic {
  (selector: string): JQuery<HTMLElement>;
  (readyCallback: () => void): JQuery<HTMLElement>;
  (element: HTMLElement): JQuery<HTMLElement>;
  (elementArray: HTMLElement[]): JQuery<HTMLElement>;
  (object: object): JQuery<HTMLElement>;
  (html: string, ownerDocument?: Document): JQuery<HTMLElement>;
  <T>(collection: T[]): JQuery<HTMLElement>;
  getJSON<T>(url: string): JQuery.jqXHR<T>;
}

namespace JQuery {
  interface TypeToTriggeredEventMap<TDelegateTarget, TData, TCurrentTarget, TTarget> {
    click: ClickEvent<TDelegateTarget, TData, TCurrentTarget, TTarget>;
    change: ChangeEvent<TDelegateTarget, TData, TCurrentTarget, TTarget>;
  }

  type ClickEvent<TDelegateTarget = any, TData = any, TCurrentTarget = any, TTarget = any> = Event<TDelegateTarget, TData, TCurrentTarget, TTarget>

  type ChangeEvent<TDelegateTarget = any, TData = any, TCurrentTarget = any, TTarget = any> = Event<TDelegateTarget, TData, TCurrentTarget, TTarget>

  interface Event<TDelegateTarget = any, TData = any, TCurrentTarget = any, TTarget = any> {
    currentTarget: TCurrentTarget;
    data: TData;
    delegateTarget: TDelegateTarget;
    target: TTarget;
    type: string;
    preventDefault(): void;
    isDefaultPrevented(): boolean;
    stopPropagation(): void;
    isPropagationStopped(): boolean;
  }

  interface jqXHR<T> extends Promise<T> {
    done(callback: (data: T) => void): JQuery.jqXHR<T>;
    fail(callback: (error: any) => void): JQuery.jqXHR<T>;
  }
}

declare global {
  interface Window {
    $: JQueryStatic;
    jQuery: JQueryStatic;
    bootstrap: {
      Modal: {
        getInstance(element: Element): {
          hide(): void;
          show(): void;
        };
      };
      Dropdown: {
        getInstance(element: Element): {
          hide(): void;
          show(): void;
        } | null;
        getOrCreateInstance(element: Element): {
          hide(): void;
          show(): void;
        };
      };
    };
  }
}

export {};
