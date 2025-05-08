import React, { useEffect, useRef, useState } from "react";
import { useThrottleEffect } from "ahooks";
import RotateLeft from "../assets/icon_img_rotate-90_default.svg?react";
import RotateRight from "../assets/icon_img_rotate+90_default.svg?react";
import ZoomIn from "../assets/icon_img_enlarge_default.svg?react";
import ZoomOut from "../assets/icon_img_narrow_default.svg?react";
import Normal from "../assets/icon_img_normal_default.svg?react";

export interface PreviewToolItem {
  type: string;
  Icon?: React.FC<React.SVGProps<SVGSVGElement>>;
  disabled?: boolean;
  onClick?: () => void;
}

export interface ToolbarOptions {
  zoomStep?: number;
  maxScale?: number;
}

export interface PreviewToolOptions {
  viewContainerRef: React.RefObject<HTMLElement>;
  viewRef: React.RefObject<HTMLElement>;
  toolbarOptions?: ToolbarOptions;
}

export const usePreviewTool = ({
  viewContainerRef,
  viewRef,
  toolbarOptions,
}: PreviewToolOptions) => {
  const initialPosition = {
    x: 0,
    y: 0,
  };

  const MAX_SCALE_VALUE = toolbarOptions?.maxScale || 4;
  const ZOOM_STEP = toolbarOptions?.zoomStep || 0.25;

  const [scale, setScale] = useState(1);
  const [rotate, setRotate] = useState(0);
  const [position, setPosition] = useState<{
    x: number;
    y: number;
  }>(initialPosition);

  const originPositionRef = useRef<{
    originX: number;
    originY: number;
    deltaX: number;
    deltaY: number;
  }>({
    originX: 0,
    originY: 0,
    deltaX: 0,
    deltaY: 0,
  });
  const [isMoving, setMoving] = useState(false);

  // img tools
  const onZoomIn = () => {
    if (scale < MAX_SCALE_VALUE) {
      setScale((value) => value + ZOOM_STEP);
    }
    setPosition(initialPosition);
  };

  const onZoomOut = () => {
    if (scale > 1) {
      setScale((value) => value - ZOOM_STEP);
    }
    setPosition(initialPosition);
  };

  const onRotateNormal = () => {
    clear();
  };
  const onRotateRight = () => {
    setRotate((value) => value + 90);
  };

  const onRotateLeft = () => {
    setRotate((value) => value - 90);
  };
  const clear = () => {
    setPosition(initialPosition);
    resizeScale();
    setMoving(false);
    setRotate(0);
  };
  const resizeScale = () => setScale(1);

  const tools: PreviewToolItem[] = [
    {
      Icon: ZoomOut,
      onClick: onZoomOut,
      type: "zoomOut",
      disabled: scale === 1,
    },
    {
      Icon: ZoomIn,
      onClick: onZoomIn,
      type: "zoomIn",
      disabled: scale === MAX_SCALE_VALUE,
    },
    {
      Icon: Normal,
      onClick: onRotateNormal,
      type: "normal",
      disabled: scale === 1,
    },
    {
      disabled: true,
      type: "line",
    },
    {
      Icon: RotateLeft,
      onClick: onRotateLeft,
      type: "rotateLeft",
    },
    {
      Icon: RotateRight,
      onClick: onRotateRight,
      type: "rotateRight",
    },
  ];

  // 处理旋转后、宽高补位
  useEffect(() => {
    if (rotate) {
      fixPosition();
    }
  }, [rotate]);

  function fixPosition() {
    if (!viewRef.current) return;
    const width = viewRef.current.offsetWidth * scale;
    const height = viewRef.current.offsetHeight * scale;
    const { left: imgLeft, top: imgTop } =
      viewRef.current.getBoundingClientRect();
    const { left: wrapLeft, top: wrapTop } =
      viewContainerRef.current?.getBoundingClientRect() || {
        left: 0,
        top: 0,
      };

    const isRotate = rotate % 180 !== 0;
    const fixState = getFixScaleEleTransPosition(
      isRotate ? height : width,
      isRotate ? width : height,
      imgLeft - wrapLeft,
      imgTop - wrapTop
    ) || { x: 0, y: 0 };
    if (fixState) {
      setPosition({ ...fixState });
    }
  }
  const onMouseUp = () => {
    if (isMoving) {
      setMoving(false);
      // fixPosition();
    }
  };
  const onMouseDown = (event: any) => {
    event.preventDefault();
    // Without this mask close will abnormal
    event.stopPropagation();
    originPositionRef.current.deltaX = event.clientX - position.x;
    originPositionRef.current.deltaY = event.clientY - position.y;
    originPositionRef.current.originX = position.x;
    originPositionRef.current.originY = position.y;
    setMoving(true);
  };
  const onMouseMove = (event: any) => {
    if (isMoving) {
      setPosition({
        x: event.clientX - originPositionRef.current.deltaX,
        y: event.clientY - originPositionRef.current.deltaY,
      });
    }
  };

  /**
   * 处理滚动事件
   */
  const [wheelNum, setWheelNum] = useState<number>(0);
  useThrottleEffect(
    () => {
      if (!wheelNum) return;
      if (wheelNum > 1) {
        onZoomIn();
        setWheelNum(0);
        return;
      }
      if (wheelNum < -1) {
        onZoomOut();
        setWheelNum(0);
      }
    },
    [wheelNum],
    {
      wait: 40,
    }
  );
  const onWheel = (event: WheelEvent) => {
    // event.preventDefault();
    // deltaY < 100 区分笔记本触摸板滑动
    if (event.ctrlKey || Math.abs(event.deltaY) < 100) return;
    const direct = event.deltaY > 0 ? "down" : "up";
    setWheelNum((num) => {
      let curNum = num;
      if (direct === "up") {
        curNum += 1;
      } else {
        curNum -= 1;
      }
      return curNum;
    });
  };

  useEffect(() => {
    viewContainerRef.current?.addEventListener("mouseup", onMouseUp, false);
    viewContainerRef.current?.addEventListener("mousemove", onMouseMove, false);

    return () => {
      viewContainerRef.current?.removeEventListener(
        "mouseup",
        onMouseUp,
        false
      );

      viewContainerRef.current?.removeEventListener(
        "mousemove",
        onMouseMove,
        false
      );
    };
  }, [isMoving]);

  return {
    viewRef,
    viewContainerRef,
    tools,
    scale,
    rotate,
    position,
    onMouseDown,
    onWheel,
    resizeScale,
  };
};

function fixPoint(
  key: "x" | "y",
  start: number,
  width: number,
  clientWidth: number
) {
  const startAddWidth = start + width;
  const offsetStart = (width - clientWidth) / 2;

  if (width > clientWidth) {
    if (start > 0) {
      return {
        [key]: offsetStart,
      };
    }
    if (start < 0 && startAddWidth < clientWidth) {
      return {
        [key]: -offsetStart,
      };
    }
  } else if (start < 0 || startAddWidth > clientWidth) {
    return {
      [key]: start < 0 ? offsetStart : -offsetStart,
    };
  }
  return {};
}

/**
 * Fix positon x,y point when
 *
 * Ele width && height < client
 * - Back origin
 *
 * - Ele width | height > clientWidth | clientHeight
 * - left | top > 0 -> Back 0
 * - left | top + width | height < clientWidth | clientHeight -> Back left | top + width | height === clientWidth | clientHeight
 *
 * Regardless of other
 */
export function getFixScaleEleTransPosition(
  width: number,
  height: number,
  left: number,
  top: number
): null | { x: number; y: number } {
  // const { width: clientWidth, height: clientHeight } = getClientSize();
  let fixPos: any = null;
  if (!document.querySelector("#imgContainer")) {
    return fixPos;
  }
  const { clientWidth, clientHeight } = document.querySelector(
    "#imgContainer"
  ) as Element;

  if (width <= clientWidth && height <= clientHeight) {
    fixPos = {
      x: 0,
      y: 0,
    };
  } else if (width > clientWidth || height > clientHeight) {
    fixPos = {
      ...fixPoint("x", left, width, clientWidth),
      ...fixPoint("y", top, height, clientHeight),
    };
  }

  return fixPos;
}
