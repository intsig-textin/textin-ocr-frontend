import React, { ReactNode, useRef } from "react";
import classNames from "classnames";
import MarkLayer from "../../MarkLayer";
import useMarkTool from "../../../hooks/useMarkTool";
import { IPageItem, IRectItem } from "../../../types/keyVal";
import styles from "./index.module.less";
import { BlockLoading } from "../../Loading";

export interface IImagesViewerProps {
  wrapperClassName?: string;
  wrapperStyle?: React.CSSProperties;
  pageClassName?: string;
  pageStyle?: React.CSSProperties;
  srcList: string[];
  rects?: IRectItem[][];
  pages?: IPageItem[];
  showMark?: boolean;
  viewContainerRef?: React.RefObject<HTMLElement>;
  viewRef?: React.RefObject<HTMLElement>;
  activeContentId?: string;
  scale: number;
  rotate: number;
  position?: { x: number; y: number };
  loading?: boolean;
  onMouseDown?: (e: any) => void;
  resizeScale?: () => void;
  loadingComponent?: ReactNode;
}

export default function ImagesViewer({
  wrapperClassName,
  wrapperStyle,
  pageClassName,
  pageStyle,
  srcList,
  rects,
  pages,
  showMark,
  viewContainerRef,
  viewRef,
  activeContentId,
  scale,
  rotate,
  position,
  loading,
  loadingComponent,
  onMouseDown,
  resizeScale,
}: IImagesViewerProps) {
  return (
    <div
      className={classNames(styles.imagesViewer, wrapperClassName)}
      style={wrapperStyle}
      ref={viewRef as React.RefObject<HTMLDivElement>}
    >
      {srcList.map((src, index) => (
        <ImageView
          className={pageClassName}
          style={pageStyle}
          key={index}
          src={src}
          rects={rects?.[index]}
          page={pages?.[index]}
          showMark={showMark}
          viewContainerRef={viewContainerRef}
          activeContentId={activeContentId}
          scale={scale}
          rotate={rotate}
          onMouseDown={onMouseDown}
          resizeScale={resizeScale}
          position={position}
        />
      ))}
      {loading && (loadingComponent || <BlockLoading />)}
    </div>
  );
}

export interface IImageViewProps {
  className?: string;
  style?: React.CSSProperties;
  src: string;
  rects?: IRectItem[];
  page?: IPageItem;
  showMark?: boolean;
  viewContainerRef?: React.RefObject<HTMLElement>;
  activeContentId?: string;
  rotate: number;
  fixedRotate?: number;
  scale: number;
  onMouseDown?: (e: any) => void;
  resizeScale?: () => void;
  //  需要旋转角补位
  angleFix?: boolean;
  // 需要旋转的角度
  angle?: number;
  position?: { x: number; y: number };
}

export function ImageView({
  className,
  style,
  src,
  rects,
  showMark,
  viewContainerRef,
  activeContentId,
  rotate,
  scale,
  onMouseDown,
  resizeScale,
  angleFix,
  angle,
  position,
}: IImageViewProps) {
  const imgRef = useRef<HTMLImageElement | null>(null);
  const { renderRate, markStyle, updateMark } = useMarkTool({
    imgRef,
    viewContainerRef,
    resizeScale,
    angleFix,
    angle,
  });
  const angleBasic = angleFix && angle ? rotate + angle : rotate;

  const handleImageLoad = () => {
    updateMark();
  };

  return (
    <div
      className={classNames(styles.imageWrapper, className)}
      style={{
        ...style,
        transform: `translate3d(${position?.x}px, ${position?.y}px, 0)`,
      }}
    >
      <img
        ref={imgRef}
        className={styles.image}
        style={{ transform: `scale(${scale}, ${scale}) rotate(${rotate}deg)` }}
        src={src}
        onLoad={handleImageLoad}
        onMouseDown={onMouseDown}
      />
      {showMark && rects && (
        <MarkLayer
          style={{
            transform: `scale(${scale}, ${scale}) rotate(${angleBasic}deg)`,
            ...markStyle,
          }}
          onMouseDown={onMouseDown}
          rects={rects}
          rate={renderRate}
          activeContentId={activeContentId}
          getContainer={() => viewContainerRef?.current}
        />
      )}
    </div>
  );
}
