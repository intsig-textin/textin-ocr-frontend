import type React from "react";
import { useRef, useState } from "react";
import {
  useSize,
  useDebounceFn,
  useUpdateEffect,
  useEventListener,
} from "ahooks";
import { getImgWidth } from "../components/MarkLayer/helpers";

interface IPositionStyle {
  width: number;
  height: number;
  left: number;
  top: number;
}
interface MarkToolOptions {
  viewContainerRef?: React.RefObject<HTMLElement>;
  imgRef: React.MutableRefObject<HTMLElement | null>;
  angle?: number;
  angleFix?: boolean;
  onSizeChange?: () => void;
  clearList?: () => void;
  resizeScale?: () => void;
}
export default function useMarkTool({
  viewContainerRef,
  imgRef,
  angle,
  angleFix,
  onSizeChange = () => {},
  resizeScale,
  clearList = () => {},
}: MarkToolOptions) {
  const containerSize = useSize(viewContainerRef);
  const isClear = useRef(false);

  const [renderRate, setRenderRate] = useState(0); // 原图尺寸与渲染尺寸比例
  const [markStyle, setMarkStyle] = useState<IPositionStyle>({
    width: 0,
    height: 0,
    left: 0,
    top: 0,
  });
  const winSizeFn = useDebounceFn(
    () => {
      isClear.current = false;
      updateMark();
      onSizeChange();
    },
    { wait: 0 }
  );

  // 监听容器尺寸变化,如果改变则清除画框，重置旋转角度
  useUpdateEffect(() => {
    winSizeFn.run();
    if (!isClear.current) {
      resizeScale?.();
      isClear.current = true;
      clearList();
    }
  }, [containerSize, angle]);

  // 有旋转角度时,监听旋转结束后更新蒙层位置
  useEventListener(
    "transitionend",
    () => {
      if (angle === 90 || angle === 270) {
        updateMark();
        if (onSizeChange) {
          onSizeChange();
        }
      }
    },
    { target: imgRef.current || undefined }
  );

  function updateMark() {
    if (!imgRef.current) return;
    updateRenderRate();
    updateMarkStyle();
  }

  const updateRenderRate = () => {
    if (!imgRef.current) {
      return;
    }
    const imgNaturalWidth = getImgWidth({}, imgRef.current);
    const imgRenderWidth = imgRef.current.offsetWidth;
    setRenderRate(imgRenderWidth / imgNaturalWidth);
  };

  const updateMarkStyle = () => {
    if (!imgRef.current) {
      return;
    }
    const { offsetLeft: left, offsetTop: top } = imgRef.current;
    const { width, height } = imgRef.current.getBoundingClientRect();

    let currentStyle = {
      left,
      top,
      width,
      height,
    };
    // 旋转角度 width <=> height 补位
    if (angleFix && angle && [90, 270].includes(angle)) {
      const diff = (width - height) / 2;
      currentStyle = {
        width: height,
        height: width,
        left: left + diff,
        top: top - diff,
      };
    }
    setMarkStyle(currentStyle);
  };

  return { renderRate, markStyle, updateMark };
}
