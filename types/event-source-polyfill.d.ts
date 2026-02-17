declare module "event-source-polyfill" {
  export interface EventSourcePolyfillInit {
    withCredentials?: boolean;
    headers?: Record<string, string>;
  }

  export interface EventSourcePolyfillInstance {
    readyState: number;
    close(): void;
    addEventListener(
      type: string,
      listener: (event: MessageEvent) => void
    ): void;
    onerror: ((this: EventSource, ev: Event) => void) | null;
  }

  export class EventSourcePolyfill implements EventSourcePolyfillInstance {
    readyState: number;
    constructor(url: string, eventSourceInitDict?: EventSourcePolyfillInit);
    close(): void;
    addEventListener(
      type: string,
      listener: (event: MessageEvent) => void
    ): void;
    onerror: ((this: EventSource, ev: Event) => void) | null;
  }

  export const NativeEventSource: typeof globalThis.EventSource | undefined;
}
