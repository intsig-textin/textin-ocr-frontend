import React, { SVGProps } from "react";
import classNames from "classnames";
import SvgRect from "./SvgRect";
import { IRectItem } from "../../types/keyVal";
import styles from "./index.module.less";

export interface IMarkLayerProps {
  className?: string;
  style?: React.CSSProperties;
  rects: IRectItem[];
  rate: number;
  activeContentId?: string;
  getContainer: () => HTMLElement | null | undefined;
  svgAttr?: SVGProps<any>;
  onMouseDown?: (e: any) => void;
}

export default function MarkLayer({
  className,
  style,
  rects,
  rate,
  activeContentId,
  getContainer,
  svgAttr,
  onMouseDown,
}: IMarkLayerProps) {
  return (
    <div
      className={classNames(styles.markWrapper, className)}
      style={style}
      onMouseDown={onMouseDown}
    >
      <SvgRect
        svgAttr={svgAttr}
        rectList={rects}
        rate={rate}
        activeContentId={activeContentId}
        getContainer={getContainer}
      />
    </div>
  );
}
