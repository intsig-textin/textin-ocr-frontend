import { ReactNode, useRef } from "react";
import classNames from "classnames";
import { ToolbarOptions, usePreviewTool } from "../../hooks/usePreviewTool";
import { IPageItem, IRectItem } from "../../types/keyVal";
import { isBoolean } from "../../utils/object";
import ImagesViewer from "./ImagesViewer";
import PDFViewer from "./PDFViewer";
import { PDFSrc } from "./PDFViewer/types";
import Toolbar from "./Toolbar";
import styles from "./index.module.less";

export const filePreviewContainerId = "filePreviewContainer";

export interface IFilePreviewProps {
  className?: string;
  style?: React.CSSProperties;
  src: PDFSrc | string[];
  rects?: IRectItem[][];
  pages: IPageItem[];
  getContainerRef: React.RefObject<HTMLElement>;
  activeContentId?: string;
  showMark?: boolean;
  hasPagination?: boolean;
  hasToolbar?: boolean;
  toolbarOptions?: ToolbarOptions;
  toolbarStyle?: React.CSSProperties;
  loading?: boolean;
  loadingComponent?: ReactNode;
}

export default function FilePreview({
  className,
  style,
  src,
  rects,
  pages,
  getContainerRef,
  activeContentId,
  showMark = true,
  hasPagination,
  hasToolbar = true,
  toolbarOptions,
  toolbarStyle,
  loading,
  loadingComponent,
}: IFilePreviewProps) {
  const viewContainerRef = getContainerRef;
  const viewRef = useRef<HTMLElement>(null);
  const { tools, scale, position, rotate, onMouseDown, resizeScale } =
    usePreviewTool({ viewContainerRef, viewRef, toolbarOptions });

  const isPdf = !Array.isArray(src);
  const needPagination = isBoolean(hasPagination) ? hasPagination : isPdf;

  return (
    <div
      ref={getContainerRef as React.RefObject<HTMLDivElement>}
      className={classNames(styles.filePreview, className)}
      style={style}
    >
      <div
        className={styles.filePreviewWrapper}
        style={isPdf ? {} : { overflow: "auto" }}
      >
        {Array.isArray(src) ? (
          <ImagesViewer
            viewContainerRef={viewContainerRef}
            viewRef={viewRef}
            srcList={src}
            rects={rects}
            pages={pages}
            showMark={showMark}
            activeContentId={activeContentId}
            scale={scale}
            rotate={rotate}
            position={position}
            onMouseDown={onMouseDown}
            resizeScale={resizeScale}
            loading={loading}
            loadingComponent={loadingComponent}
          />
        ) : (
          <PDFViewer
            src={src}
            rects={rects}
            pages={pages}
            showMark={showMark}
            activeContentId={activeContentId}
            scale={scale}
            rotate={rotate}
            loading={loading}
            loadingComponent={loadingComponent}
          />
        )}
      </div>
      {hasToolbar && (
        <Toolbar
          style={{
            ...(needPagination ? { marginRight: 80 } : {}),
            ...toolbarStyle,
          }}
          tools={tools}
        />
      )}
    </div>
  );
}
