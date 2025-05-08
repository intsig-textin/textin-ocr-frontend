interface DebounceOptions {
  /**
   * 是否在延迟开始前调用
   * @default false
   */
  leading?: boolean;
  /**
   * 是否在延迟结束后调用
   * @default true
   */
  trailing?: boolean;
  /**
   * 最大等待时间 (毫秒)
   */
  maxWait?: number;
}

export interface Cancelable {
  /**
   * 取消当前延迟调用
   */
  cancel: () => void;
  /**
   * 立即执行并取消后续调用
   */
  flush: () => void;
}

export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number = 0,
  options: DebounceOptions = {}
): T & Cancelable {
  type FuncParams = Parameters<T>;
  type FuncReturn = ReturnType<T>;

  let lastArgs: FuncParams | null = null;
  let lastThis: any;
  let result: FuncReturn;
  let timerId: ReturnType<typeof setTimeout> | null = null;
  let lastCallTime = 0;
  let lastInvokeTime = 0;

  const { leading = false, trailing = true, maxWait } = options;
  const maxing = typeof maxWait === "number";

  const invokeFunc = (time: number): FuncReturn => {
    const args = lastArgs!;
    const thisArg = lastThis;

    lastArgs = lastThis = null;
    lastInvokeTime = time;
    result = func.apply(thisArg, args);
    return result;
  };

  const remainingWait = (time: number): number => {
    const timeSinceLastCall = time - lastCallTime;
    const timeSinceLastInvoke = time - lastInvokeTime;

    const timeWaiting = wait - timeSinceLastCall;

    return maxing
      ? Math.min(timeWaiting, maxWait - timeSinceLastInvoke)
      : timeWaiting;
  };

  const shouldInvoke = (time: number): boolean => {
    const timeSinceLastCall = time - lastCallTime;
    const timeSinceLastInvoke = time - lastInvokeTime;

    return (
      lastCallTime === 0 ||
      timeSinceLastCall >= wait ||
      timeSinceLastCall < 0 ||
      (maxing && timeSinceLastInvoke >= maxWait)
    );
  };

  const trailingEdge = (time: number): FuncReturn => {
    timerId = null;
    if (trailing && lastArgs) {
      return invokeFunc(time);
    }
    lastArgs = lastThis = null;
    return result;
  };

  const timerExpired = () => {
    const now = Date.now();
    if (shouldInvoke(now)) {
      return trailingEdge(now);
    }
    timerId = setTimeout(timerExpired, remainingWait(now));
  };

  const leadingEdge = (time: number): FuncReturn => {
    lastInvokeTime = time;
    timerId = setTimeout(timerExpired, wait);
    return leading ? invokeFunc(time) : result;
  };

  const debounced = function (this: any, ...args: FuncParams): FuncReturn {
    const now = Date.now();
    const isInvoking = shouldInvoke(now);

    lastArgs = args;
    lastThis = this;
    lastCallTime = now;

    if (isInvoking) {
      if (!timerId) {
        return leadingEdge(lastCallTime);
      }
      if (maxing) {
        timerId = setTimeout(timerExpired, wait);
        return invokeFunc(lastCallTime);
      }
    }

    if (!timerId) {
      timerId = setTimeout(timerExpired, wait);
    }

    return result;
  } as T & Cancelable;

  debounced.cancel = () => {
    if (timerId) {
      clearTimeout(timerId);
      timerId = null;
    }
    lastInvokeTime = 0;
    lastCallTime = 0;
    lastArgs = lastThis = null;
  };

  debounced.flush = () => {
    return timerId ? trailingEdge(Date.now()) : result;
  };

  return debounced;
}
