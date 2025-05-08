import type { ReactNode, SVGProps } from "react";
import { useState, memo, useEffect, useRef, useLayoutEffect } from "react";
import { useSize } from "ahooks";
import classNames from "classnames";
import { scrollIntoViewIfNeeded } from "../../../utils/dom";
import { IRectItem } from "../../../types/keyVal";
import RectText from "./Text";
import styles from "./index.module.less";

interface ISvgRectProps {
  svgAttr?: SVGProps<any>;
  rate: number;
  rectList: IRectItem[];
  showText?: boolean;
  autoLink?: boolean;
  className?: string;
  pageNumber?: number | string;
  hiddenOverRange?: boolean;
  viewAngle?: number;
  activeContentId?: string;
  getContainer: () => HTMLElement | null | undefined;
  onClick?: (rect: IRectItem) => void;
}

export default function SvgRect({
  className,
  svgAttr,
  rate,
  rectList,
  showText,
  pageNumber = "1",
  hiddenOverRange = true,
  viewAngle,
  activeContentId,
  getContainer,
  onClick,
}: ISvgRectProps) {
  const [isOverRange, setIsOverRange] = useState(false);
  const [viewBox, setViewBox] = useState<any>();
  const svgRef = useRef<SVGSVGElement>(null);

  const wrapperSize = useSize(svgRef as unknown as HTMLElement);

  useEffect(() => {
    // 隐藏超出范围的框
    try {
      if (
        svgRef.current &&
        svgRef.current.parentElement &&
        Array.isArray(rectList) &&
        rate
      ) {
        let { clientWidth, clientHeight } = svgRef.current.parentElement;
        const viewBox = svgRef.current.getAttribute("viewBox") || "";
        let viewRate = 1;
        if (viewBox) {
          const [_, __, width, height] = viewBox
            .split(" ")
            .map((i) => Number(i));
          viewRate = width / clientWidth;
          clientWidth = width;
          clientHeight = height;
        }
        setViewBox({ width: clientWidth, height: clientHeight, viewRate });
        const isOver = rectList.some(
          ({ position }) =>
            position[2] * rate - clientWidth > 5 ||
            position[4] * rate - clientWidth > 5 ||
            position[5] * rate - clientHeight > 5 ||
            position[7] * rate - clientHeight > 5
        );
        setIsOverRange(isOver);
      }
    } catch (error) {
      console.log("判断isOver", error);
    }
  }, [rectList, rate, wrapperSize, svgAttr?.viewBox]);

  return (
    <svg
      data-page-number={pageNumber}
      className={classNames(className, styles.svg, {
        ["over-range"]: isOverRange && hiddenOverRange,
      })}
      ref={svgRef}
      {...svgAttr}
    >
      {rectList.map((item, idx) => (
        <Rect
          {...item}
          key={`rect-${idx}-${item.uid || item.key}`}
          rate={rate}
          active={activeContentId === item.uid}
          onClick={() => onClick?.(item)}
          renderText={(points) =>
            (showText || !!item.renderText) && (
              <RectText points={points} num={item.renderText || idx + 1} />
            )
          }
          viewBox={viewBox}
          viewAngle={viewAngle}
          getContainer={getContainer}
        />
      ))}
    </svg>
  );
}

interface IRectProps extends IRectItem {
  rate: number;
  active?: boolean;
  onClick?: (rect: IRectItem) => void;
  renderText: (point: number[]) => ReactNode;
  getContainer: () => HTMLElement | null | undefined;
}

const Rect = memo((rect: IRectProps) => {
  const {
    position,
    rate,
    active,
    parent_uid,
    uid,
    onClick,
    renderText,
    getContainer,
  } = rect;
  if (!rate || !(Array.isArray(position) && position.length)) return null;

  const rectRef = useRef<SVGPolygonElement | null>(null);

  useLayoutEffect(() => {
    if (active && rectRef.current) {
      const container = getContainer();
      const scrollOptions: ScrollIntoViewOptions = {
        block: "nearest",
        inline: "nearest",
      };
      if (container) {
        scrollIntoViewIfNeeded(
          rectRef.current,
          container,
          scrollOptions,
          rectRef.current.getBoundingClientRect().height
        );
      } else {
        rectRef.current.scrollIntoView(scrollOptions);
      }
    }
  }, [active]);

  const list = position.map((val) => Math.round(val * rate));
  const finalPoints = `${list[0]} ${list[1]},${list[2]} ${list[3]},${list[4]} ${list[5]},${list[6]} ${list[7]}`;
  const rect_type = rect.rect_type || rect.type || "";

  return (
    <>
      <polygon
        ref={rectRef}
        className={classNames({
          active,
          [rect_type]: rect_type,
        })}
        data-content-id={uid}
        data-parent-content-id={parent_uid}
        vectorEffect="non-scaling-stroke"
        points={finalPoints}
        onClick={() => onClick?.(rect)}
      />
      {renderText(list)}
    </>
  );
});
