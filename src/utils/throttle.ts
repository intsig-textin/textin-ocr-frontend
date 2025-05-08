import { Cancelable, debounce } from "./debounce";

interface ThrottleOptions {
  /**
   * 是否在节流开始前调用
   * @default true
   */
  leading?: boolean;
  /**
   * 是否在节流结束后调用
   * @default true
   */
  trailing?: boolean;
  /**
   * 最大等待时间 (毫秒)
   */
  maxWait?: number;
}

export function throttle<T extends (...args: any[]) => any>(
  func: T,
  wait: number = 0,
  options: ThrottleOptions = {}
): T & Cancelable {
  type FuncParams = Parameters<T>;
  type FuncReturn = ReturnType<T>;

  let lastArgs: FuncParams | null = null;
  let lastThis: any;
  let result: FuncReturn;

  const { leading = true, trailing = true, maxWait } = options;
  const throttled = debounce(func, wait, {
    leading,
    trailing,
    maxWait: typeof maxWait === "number" ? Math.max(maxWait, wait) : undefined,
  }) as T & Cancelable;

  // 覆盖 flush 方法类型
  const originalFlush = throttled.flush;
  throttled.flush = (() => {
    const flushed = originalFlush();
    lastArgs = lastThis = null;
    return flushed;
  }) as typeof originalFlush;

  return throttled;
}
