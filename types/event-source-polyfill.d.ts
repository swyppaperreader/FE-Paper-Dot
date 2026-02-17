declare module "event-source-polyfill" {
  export interface EventSourcePolyfillInit {
    withCredentials?: boolean;
    headers?: Record<string, string>;
    /** 응답 대기 타임아웃(ms). 기본 45000. 번역 파이프라인 대기 시 더 크게 설정 */
    heartbeatTimeout?: number;
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
