// src/index.ts
export { default as FilePreview } from "./components/FilePreview";
export { default as ResultView } from "./components/ResultView";
export { default as MarkLayer } from "./components/MarkLayer";
export { default as JsonView } from "./components/JsonView";

export { useContentLinkage } from "./hooks/useContentLinkage";
export { usePDFMarkLayer } from "./hooks/usePDFMarkLayer";
export { usePreviewTool } from "./hooks/usePreviewTool";

// 导出类型定义
export type {
  IRectItem,
  IPageItem,
  IResultListItem,
  IFieldItem,
} from "./types/keyVal";

export type { PDFSrc } from "./components/FilePreview/PDFViewer/types";
export type { ToolbarOptions } from "./hooks/usePreviewTool";
export type { PreviewToolItem } from "./hooks/usePreviewTool";
