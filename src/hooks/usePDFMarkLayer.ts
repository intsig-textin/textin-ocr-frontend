import { IPageItem, IRectItem } from "../types/keyVal";
import { useCallback, useEffect } from "react";
import { scrollIntoViewIfNeeded } from "../utils/dom";

const svgNS = "http://www.w3.org/2000/svg";
const rectClass = "rectLayer";

let observer: MutationObserver;

interface PDFMarkLayerOptions {
  containerRef: React.RefObject<any>;
  pdfViewerRef?: React.RefObject<any>;
  rects?: IRectItem[][];
  pages: IPageItem[];
  dpi?: number;
  activeContentId?: string;
  showMark?: boolean;
}

export const usePDFMarkLayer = ({
  containerRef,
  pdfViewerRef,
  rects,
  pages,
  dpi,
  activeContentId,
  showMark = true,
}: PDFMarkLayerOptions) => {
  const pdfViewDpi = 96;
  let resultDpi = dpi || 144;
  let dpiScale = pdfViewDpi / resultDpi;

  function createPageMark(
    pageItem: HTMLDivElement,
    { activeId }: { activeId?: string }
  ) {
    const page = pageItem.dataset.pageNumber;
    const { clientWidth, clientHeight } = pageItem;
    const scale = pdfViewerRef?.current.currentScale;
    const pageIndex = Number(page) - 1;
    const curPageRects = rects![pageIndex];
    if (!dpi && Array.isArray(pages)) {
      const curPage = pages[pageIndex] || {};
      if (curPage.ppi && typeof curPage.ppi === "number") {
        resultDpi = curPage.ppi;
      } else if (
        typeof curPage.width === "number" &&
        typeof curPage.height === "number"
      ) {
        let { width: resultWidth, height: resultHeight } = curPage;
        const { viewHeight, viewWidth } = [90, 270].includes(
          pdfViewerRef?.current.pagesRotation
        )
          ? { viewHeight: clientWidth, viewWidth: clientHeight }
          : { viewHeight: clientHeight, viewWidth: clientWidth };
        // 判断结果中的width/height是否反了
        const sizeRate = viewWidth / viewHeight;
        if (
          [90, 270].includes(curPage.angle || 0) &&
          Math.abs(curPage.width / curPage.height - sizeRate) > 0.02 &&
          Math.abs(curPage.height / curPage.width - sizeRate) <= 0.02
        ) {
          resultWidth = curPage.height;
          resultHeight = curPage.width;
        }
        resultDpi = Math.round(
          pdfViewDpi * (resultWidth / (viewWidth / scale))
        );
      }
      dpiScale = pdfViewDpi / resultDpi;
    }
    if (page && Array.isArray(curPageRects) && curPageRects.length) {
      const oldDom = pageItem.querySelector(`.${rectClass}`);
      if (oldDom) {
        oldDom.remove();
      }
      const svgDom = document.createElementNS(svgNS, "svg");
      const pageAngle = curPageRects[0].angle || 0;
      const rotate = (pdfViewerRef?.current.pagesRotation + pageAngle) % 360;
      let info = {
        width: clientWidth,
        height: clientHeight,
        translateX: 0,
        translateY: 0,
      };
      if (rotate === 90) {
        info = {
          width: clientHeight,
          height: clientWidth,
          translateX: 0,
          translateY: -clientWidth,
        };
      } else if (rotate === 180) {
        info = {
          width: clientWidth,
          height: clientHeight,
          translateX: -clientWidth,
          translateY: -clientHeight,
        };
      } else if (rotate === 270) {
        info = {
          width: clientHeight,
          height: clientWidth,
          translateX: -clientHeight,
          translateY: 0,
        };
      }
      svgDom.setAttribute("data-dpi-scale", `${dpiScale}`);
      svgDom.setAttribute("data-angle", `${pageAngle}`);
      svgDom.setAttribute("class", `${rectClass}`);
      svgDom.setAttribute("width", `${info.width}`);
      svgDom.setAttribute("height", `${info.height}`);
      svgDom.setAttribute(
        "style",
        `transform: rotate(${rotate}deg) translate3d(${info.translateX}px, ${info.translateY}px, 0)`
      );
      const viewBoxWidth = Number((info.width / scale / dpiScale).toFixed(2));
      const viewBoxHeight = Number((info.height / scale / dpiScale).toFixed(2));
      svgDom.setAttribute("viewBox", `0 0 ${viewBoxWidth} ${viewBoxHeight}`);
      let isOver = false;
      curPageRects.forEach((rect) => {
        if (!rect.position) return;
        const polygon = document.createElementNS(svgNS, "polygon");
        polygon.setAttribute(
          "points",
          rect.position.reduce(
            (pre, cur, i) => pre + (i % 2 ? "," : " ") + cur,
            ""
          )
        );
        polygon.setAttribute("vector-effect", "non-scaling-stroke");
        polygon.setAttribute("data-content-id", `${rect.content_id}`);
        if (rect.parent_id) {
          polygon.setAttribute("data-parent-content-id", `${rect.parent_id}`);
        }
        if (activeId && activeId === `${rect.content_id}`) {
          polygon.classList.add("active");
        }
        const rect_type = rect.rect_type || rect.type;
        if (rect_type) {
          polygon.classList.add(rect_type);
        }
        const textScale = 1 / scale / dpiScale;
        if (rect.render_text) {
          const renderGroup = document.createElementNS(svgNS, "g");
          const translateScale = (1 - textScale) / textScale;
          renderGroup.setAttribute(
            "style",
            `transform: scale(${textScale}) translate(${
              rect.position[0] * translateScale
            }px, ${rect.position[1] * translateScale}px)`
          );
          const renderRect = document.createElementNS(svgNS, "rect");
          const attr1: any = {
            width: "16",
            height: "16",
            fill: "#4877FF",
            x: `${rect.position[0]}`,
            y: `${rect.position[1]}`,
          };
          for (const attr in attr1) {
            renderRect.setAttribute(attr, attr1[attr]);
          }
          renderGroup.appendChild(renderRect);
          const renderText = document.createElementNS(svgNS, "text");
          const attr2: any = {
            style: "font-size: 12px; fill: #fff",
            x: `${rect.position[0] + 4}`,
            y: `${rect.position[1] + 11}`,
          };
          for (const attr in attr2) {
            renderText.setAttribute(attr, attr2[attr]);
          }
          renderText.textContent = rect.render_text;
          renderGroup.appendChild(renderText);
          svgDom.appendChild(renderGroup);
        }
        svgDom.appendChild(polygon);

        if (!isOver) {
          isOver =
            rect.position[2] - viewBoxWidth > 5 ||
            rect.position[4] - viewBoxWidth > 5 ||
            rect.position[5] - viewBoxHeight > 5 ||
            rect.position[7] - viewBoxHeight > 5;
          // console.log('isOver', { rect, viewBoxHeight, viewBoxWidth });
        }
      });
      if (!isOver) {
        pageItem.insertBefore(
          svgDom,
          pageItem.children[1] ||
            pageItem.children[pageItem.children.length - 1]
        );
      }
    }
  }

  function removeExpiredMark() {
    const oldDoms: HTMLDivElement[] = containerRef.current.querySelectorAll(
      `.page:not([data-loaded="true"]) .${rectClass}`
    );
    oldDoms.forEach((item) => {
      item.remove();
    });
  }

  function createMark(list: any[]) {
    try {
      if (list.forEach) {
        list.forEach((pageItem) => {
          createPageMark(pageItem, { activeId: activeContentId });
        });
      }
      removeExpiredMark();
    } catch (error) {
      console.log("MutationObserver callback error", error);
    }
  }

  function removeOldMark() {
    const oldPagesMark: HTMLDivElement[] =
      containerRef.current.querySelectorAll(`.${rectClass}`);
    oldPagesMark.forEach((item) => {
      item.remove();
    });
  }

  const run = useCallback(() => {
    if (
      !containerRef.current ||
      !pdfViewerRef?.current ||
      !rects ||
      !MutationObserver
    ) {
      return;
    }
    removeOldMark();
    if (!showMark) {
      return;
    }
    const initDoms = containerRef.current.querySelectorAll(
      '.page[data-loaded="true"]'
    );
    createMark(initDoms);

    // 监听pdf页面加载(data-loaded=true)，绘制页面回显
    if (observer && observer.disconnect) {
      observer.disconnect();
    }
    observer = new MutationObserver((pages: MutationRecord[]) => {
      const pageList = pages.map ? pages.map((item) => item.target) : [];
      createMark(pageList);
    });
    const config = { attributeFilter: ["data-loaded"], subtree: true };
    observer.observe(containerRef.current, config);
  }, [showMark, rects]);

  useEffect(() => {
    run();
  }, [run]);

  const removeActiveClass = () => {
    const activeEles = Array.from(
      containerRef.current.querySelectorAll("[data-content-id].active")
    );
    activeEles.forEach((ele: any) => ele.classList.remove("active"));
  };

  const addActiveClassAndScrollTo = (contentId: string) => {
    const targetContent = containerRef.current.querySelector(
      `[data-content-id="${contentId}"]`
    );
    if (targetContent) {
      targetContent.classList.add("active");
      scrollIntoViewIfNeeded(
        targetContent,
        containerRef.current,
        { block: "nearest", inline: "nearest" },
        targetContent.getBoundingClientRect().height
      );
    }
  };

  useEffect(() => {
    if (activeContentId && containerRef.current) {
      removeActiveClass();
      addActiveClassAndScrollTo(activeContentId);
    }
  }, [activeContentId]);

  return { run };
};
