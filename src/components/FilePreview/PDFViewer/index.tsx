import { ReactNode, useEffect, useRef, useState } from "react";
import { useDebounceFn, useExternal, useSize } from "ahooks";
import classNames from "classnames";
import { useLoadPDFLib } from "../../../hooks/useLoadPDFLib";
import { IPageItem, IRectItem } from "../../../types/keyVal";
import { usePDFMarkLayer } from "../../../hooks/usePDFMarkLayer";
import { isBoolean } from "../../../utils/object";
import { BlockLoading } from "../../Loading";
import Pagination from "../Pagination";
import { PDFSrc } from "./types";
import styles from "./index.module.less";

const defaultPDFScaleValue = "page-width";

export interface IPDFViewerProps {
  src: PDFSrc;
  password?: string;
  rects?: IRectItem[][];
  pages: IPageItem[];
  showMark?: boolean;
  activeContentId?: string;
  dpi?: number;
  scale?: number;
  rotate?: number;
  loading?: boolean;
  loadingComponent?: ReactNode;
  onLoad?: (e: any) => void;
  onError?: (e: any) => void;
}

export default function PDFViewer({
  src,
  rects,
  pages,
  showMark = true,
  activeContentId,
  dpi,
  scale,
  rotate,
  loading: propLoading,
  loadingComponent,
  onLoad,
  onError,
}: IPDFViewerProps) {
  const { pdfLibReady, buildDir, cmapsURL } = useLoadPDFLib({
    onError: () => onError?.({}),
  });
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);

  const containerRef = useRef<any>();
  const onContainerRef = (ref: any) => {
    containerRef.current = ref;
  };
  const viewerRef = useRef<any>();
  const timeoutRef = useRef<any>();

  const viewerCss = useExternal(`${buildDir}/web/pdf_viewer.css`);
  const viewer = useExternal(
    pdfLibReady ? `${buildDir}/web/pdf_viewer.js` : undefined
  );
  const sandbox = useExternal(
    pdfLibReady ? `${buildDir}/build/pdf.sandbox.js` : undefined
  );

  const resize = () => {
    if (viewerRef.current) {
      viewerRef.current.currentScaleValue = defaultPDFScaleValue;
    }
  };

  const { run: debouncedResize } = useDebounceFn(resize, { wait: 300 });

  const viewContainerSize = useSize(containerRef.current?.parentElement);

  const { run: createMark } = usePDFMarkLayer({
    containerRef: containerRef,
    pdfViewerRef: viewerRef,
    rects,
    pages,
    showMark,
    activeContentId,
    dpi,
  });

  useEffect(() => {
    debouncedResize();
  }, [viewContainerSize?.width]);

  useEffect(() => {
    if ([viewerCss, viewer, sandbox].includes("error")) {
      onError?.({});
      const info = {
        name: "pdf.js错误",
        keyword: "pdf_viewer加载失败",
        message: {
          "pdf_viewer.css": viewerCss,
          "pdf_viewer.js": viewer,
          "pdf.sandbox.js": sandbox,
        },
      };
      console.log(info);
    }
  }, [viewerCss, viewer, sandbox]);

  useEffect(() => {
    if (
      window.pdfjsSandbox &&
      viewerCss === "ready" &&
      window.pdfjsViewer &&
      pdfLibReady
    ) {
      clearTimeout(timeoutRef.current);
      onLoad?.({});
      setCurrentPage(1);
      setTotalPage(0);
      if (viewerRef.current?.setDocument) {
        viewerRef.current.setDocument(null);
      }
      setLoading(true);
      handleInit()
        .catch((error) => {
          if (onError) {
            onError?.({});
          } else {
            console.log("pdf预览失败", error);
          }
          const info = {
            name: "pdf.js错误",
            keyword: "pdf_viewer渲染出错",
            message: error,
          };
          console.log(info);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [viewerCss, viewer, sandbox, pdfLibReady]);

  const handleInit = async () => {
    if (!src) {
      return;
    }
    const container = containerRef.current;
    const eventBus = new window.pdfjsViewer.EventBus();
    /**
     * options
     * https://github.com/mozilla/pdf.js/blob/v2.11.338/web/base_viewer.js#L188-L204
     */
    const pdfViewer = new window.pdfjsViewer.PDFViewer({
      container,
      eventBus,
      // annotationMode: 0, // 禁用注释
      removePageBorders: true, // 移除页边框
    });

    eventBus.on("pagesinit", function () {
      pdfViewer.currentScaleValue = defaultPDFScaleValue;
    });
    /**
     * options
     * https://github.com/mozilla/pdf.js/blob/v2.11.338/src/display/api.js#L320-L328
     */
    const loadingTask = window.pdfjsLib.getDocument({
      cmapsURL,
      cMapPacked: true,
      ...src,
    });
    const pdfDocument = await loadingTask.promise;
    pdfViewer.setDocument(pdfDocument);

    viewerRef.current = pdfViewer;

    createMark();

    setTotalPage(viewerRef.current.pdfDocument.numPages);
    viewerRef.current.eventBus.on("pagechanging", () => {
      setCurrentPage(viewerRef.current.currentPageNumber);
    });
  };

  const setScaleAndRotate = ({
    scale,
    rotate,
  }: {
    scale?: number;
    rotate?: number;
  }) => {
    if (!viewerRef.current) {
      return;
    }
    viewerRef.current.currentScale = scale || 1;
    if (viewerRef.current.currentScale === 1) {
      viewerRef.current.currentScaleValue = defaultPDFScaleValue;
    }
    viewerRef.current.pagesRotation = rotate || 0;
  };

  useEffect(() => {
    setScaleAndRotate({ scale, rotate });
  }, [scale, rotate]);

  const onPageChange = (page: number) => {
    viewerRef.current.currentPageNumber = page;
    setCurrentPage(page);
  };

  const pdfLoading = isBoolean(propLoading) ? propLoading : loading;

  return (
    <div>
      <div
        id="viewerContainer"
        ref={onContainerRef}
        className={styles["pdf-viewer"]}
      >
        <div id="viewer" className="pdfViewer" />
        {pdfLoading && (loadingComponent || <BlockLoading />)}
      </div>
      <Pagination
        className={classNames(styles["pdf-page"])}
        current={currentPage}
        total={totalPage}
        onChange={onPageChange}
      />
    </div>
  );
}
