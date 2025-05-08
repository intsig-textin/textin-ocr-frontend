import { useRef, useState, useEffect } from "react";

type SetActionType<T> = Partial<T> | ((state: T) => Partial<T>);

export default function useFrameSetState<T extends object>(initial: T) {
  const frame = useRef<number | null>(null);
  const [state, setState] = useState(initial);
  const queue = useRef<SetActionType<T>[]>([]);

  const setFrameState = (newState: SetActionType<T>) => {
    queue.current.push(newState);

    if (frame.current === null) {
      frame.current = requestAnimationFrame(() => {
        setState((prevState) => {
          let memoState: any = prevState;
          queue.current.forEach((queueState) => {
            if (typeof queueState === "function") {
              memoState = { ...memoState, ...queueState(memoState) };
            } else {
              memoState = { ...memoState, ...queueState };
            }
          });
          queue.current = []; // 清空队列
          frame.current = null; // 重置帧
          return memoState;
        });
      });
    }
  };

  useEffect(() => {
    return () => {
      if (frame.current) {
        cancelAnimationFrame(frame.current);
      }
    };
  }, []);

  return [state, setFrameState] as const;
}
