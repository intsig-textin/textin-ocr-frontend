# Textin OCR Frontend

一个用于展示 Textin 识别结果的 React 组件库，支持文件预览、坐标回显和结果展示。

目前已支持票据类解析结果（key-value）的展示，具体对应 Textin[票据文字识别](https://www.textin.com/product/textin_bill)如[国内通用票据识别](https://www.textin.com/market/detail/bill_recognize_v2)、[银行回单识别](https://www.textin.com/market/detail/bank_receipts)、[电子承兑汇票识别](https://www.textin.com/market/detail/electr_acceptance_bill)等相关产品识别结果的展示。

组件库使用的数据结构是规范后的前端数据结构，使用时需要将 OCR 识别 API 返回的数据转换为前端使用的结构，具体参见本项目[examples](https://github.com/intsig-textin/textin-ocr-frontend/blob/main/src/examples/data.ts)，原始数据结构参见 Textin 官网[API 文档](https://www.textin.com/document/bill_recognize_v2)。

## 特性

- 📄 支持图片和 PDF 文件预览
- 🎯 支持文本区域坐标回显和高亮
- 🔄 预览区域和识别结果双向联动
- 📊 支持 JSON 格式结果展示
- 🎨 TODO：可自定义样式和主题

## 安装

拉取项目

```bash
git clone https://github.com/intsig-textin/textin-ocr-frontend.git
```

```bash
npm install textin-ocr-frontend
# 或
yarn add textin-ocr-frontend
```

## 快速开始

```tsx
import { FilePreview, ResultView, JsonView } from "textin-ocr-frontend";

function App() {
  return (
    <div style={{ display: "flex" }}>
      <div style={{ flex: 1 }}>
        <FilePreview src="path/to/image.jpg" rects={rects} pages={pages} />
      </div>
      <div style={{ flex: 1 }}>
        <ResultView resultList={resultList} />
      </div>
    </div>
  );
}
```

## 组件说明

### 1. FilePreview 文件预览组件

文件预览组件，支持 PDF 和图片预览，支持缩放、旋转、分页等功能。

#### Props

| 参数             | 说明                        | 类型                                                                                           | 默认值 |
| ---------------- | --------------------------- | ---------------------------------------------------------------------------------------------- | ------ |
| className        | 自定义类名                  | string                                                                                         | -      |
| style            | 自定义样式                  | [React.CSSProperties](https://react.dev/reference/react-dom/components/common#cssproperties)   | -      |
| src              | 文件源，支持 PDF 和图片数组 | [PDFSrc](#pdfsrc) \| string[]                                                                  | -      |
| rects            | 标注框数据                  | [IRectItem](#irectitem)[][]                                                                    | -      |
| pages            | 页面数据                    | [IPageItem](#ipageitem)[]                                                                      | -      |
| getContainerRef  | 获取容器引用                | [React.RefObject](https://react.dev/reference/react/useRef#typing-the-ref-object)<HTMLElement> | -      |
| activeContentId  | 当前选中的内容 ID           | string                                                                                         | -      |
| showMark         | 是否显示标注                | boolean                                                                                        | -      |
| hasPagination    | 是否显示分页                | boolean                                                                                        | -      |
| hasToolbar       | 是否显示工具栏              | boolean                                                                                        | -      |
| toolbarOptions   | 工具栏配置                  | [ToolbarOptions](#toolbaroptions)                                                              | -      |
| toolbarStyle     | 工具栏样式                  | [React.CSSProperties](https://react.dev/reference/react-dom/components/common#cssproperties)   | -      |
| loading          | 加载中状态                  | boolean                                                                                        | -      |
| loadingComponent | 自定义加载组件              | ReactNode                                                                                      | -      |

### 2. ResultView 结果展示组件

结果展示组件，支持表格和列表两种展示方式。

#### Props

| 参数                  | 说明                        | 类型                                                                                           | 默认值 |
| --------------------- | --------------------------- | ---------------------------------------------------------------------------------------------- | ------ |
| className             | 自定义类名                  | string                                                                                         | -      |
| style                 | 自定义样式                  | [React.CSSProperties](https://react.dev/reference/react-dom/components/common#cssproperties)   | -      |
| resultList            | 结果列表                    | [IResultListItem](#iresultlistitem)[]                                                          | -      |
| getContainerRef       | 获取容器引用                | [React.RefObject](https://react.dev/reference/react/useRef#typing-the-ref-object)<HTMLElement> | -      |
| activeContentId       | 当前选中的内容 ID           | string                                                                                         | -      |
| activeParentContentId | 当前选中的内容所属的上级 ID | string                                                                                         | -      |
| loading               | 加载中状态                  | boolean                                                                                        | -      |
| loadingComponent      | 自定义加载组件              | ReactNode                                                                                      | -      |

### 3. MarkLayer 标注层组件

标注层组件，用于在图片显示标注框。

#### Props

| 参数            | 说明                          | 类型                                                                                         | 默认值 |
| --------------- | ----------------------------- | -------------------------------------------------------------------------------------------- | ------ |
| className       | 自定义类名                    | string                                                                                       | -      |
| style           | 自定义样式                    | [React.CSSProperties](https://react.dev/reference/react-dom/components/common#cssproperties) | -      |
| rects           | 标注框数据                    | [IRectItem](#irectitem)[]                                                                    | -      |
| rate            | 渲染比例（渲染宽度/原始宽度） | number                                                                                       | -      |
| activeContentId | 当前选中的内容 ID             | string                                                                                       | -      |
| getContainer    | 获取容器元素                  | () => HTMLElement \| null \| undefined                                                       | -      |
| svgAttr         | SVG 属性                      | [SVGProps](https://react.dev/reference/react-dom/components/common#svg-attributes)<any>      | -      |
| onMouseDown     | 鼠标按下事件                  | (e: any) => void                                                                             | -      |

### 4. JsonView JSON 展示组件

JSON 数据展示组件，用于格式化展示 JSON 数据。
本项目 JSON 数据采用`react-json-view`库渲染，API 保持一致，详细属性可参考其官方文档。

#### Props

| 参数    | 说明                      | 类型                                                                                           | 默认值 |
| ------- | ------------------------- | ---------------------------------------------------------------------------------------------- | ------ |
| style   | 自定义样式                | [React.CSSProperties](https://react.dev/reference/react-dom/components/common#cssproperties)   | -      |
| src     | JSON 数据                 | any                                                                                            | -      |
| ...rest | 其他 react-json-view 属性 | [ReactJsonViewProps](https://github.com/mac-s-g/react-json-view/blob/master/src/js/index.d.ts) | -      |

## API Interface 定义

### PDFSrc

PDF 文件源配置

```typescript
interface DocumentInitParameters {
  [key: string]: any;
  url?: string | URL;
  data?: TypedArray | ArrayBuffer | Array<number> | string;
  httpHeaders?: Object;
  withCredentials?: boolean;
  password?: string;
  length?: boolean;
}

type PDFSrc = DocumentInitParameters;
```

### IRectItem

标注框数据

```typescript
interface IRectItem {
  [key: string]: any;
  key?: string;
  type?: string;
  rect_type?: string;
  uid: string;
  parent_uid?: string;
  content_id: string;
  parent_id?: string;
  position: number[];
  angle?: number;
  render_text?: string;
}
```

### IPageItem

页面数据

```typescript
interface IPageItem {
  page_number: number;
  duration: number;
  ppi: number;
  width: number;
  height: number;
  angle?: number;
}
```

### IResultListItem

结果列表项

```typescript
interface IResultListItem extends IRectItem {
  type: string;
  description: string;
  no: number;
  list: IFieldItem[];
  flightList: IFieldItem[][];
  page_id?: number;
}
```

### IFieldItem

字段项

```typescript
interface IFieldItem extends IOriginFieldItem {
  uid: string;
  parent_uid?: string;
}

interface IOriginFieldItem {
  key: string;
  type?: string;
  value: string;
  description: string;
  position: number[];
}
```

### ToolbarOptions

工具栏配置

```typescript
interface ToolbarOptions {
  tools: PreviewToolItem[];
}

interface PreviewToolItem {
  Icon: React.ComponentType<any>;
  onClick: () => void;
  type: string;
  disabled?: boolean;
}
```

### PreviewToolItem

工具栏配置项

```typescript
interface PreviewToolItem {
  Icon: React.ComponentType<any>;  // 工具栏图标组件
  onClick: () => void;            // 点击事件处理函数
  type: string;                   // 工具类型
  disabled?: boolean;             // 是否禁用
}
```

## Hooks

### useContentLinkage

用于实现预览区域和识别结果的双向联动。

```tsx
const { activeContentId, activeParentContentId, registerLinkage } =
  useContentLinkage({
    viewContainerRef,
    resultContainerRef,
  });
```

#### 参数

| 参数               | 类型                                                                                                   | 必填 | 说明         |
| ------------------ | ------------------------------------------------------------------------------------------------------ | ---- | ------------ |
| viewContainerRef   | [React.RefObject](https://react.dev/reference/react/useRef#typing-the-ref-object)<HTMLElement \| null> | 是   | 预览容器引用 |
| resultContainerRef | [React.RefObject](https://react.dev/reference/react/useRef#typing-the-ref-object)<HTMLElement \| null> | 是   | 结果容器引用 |

#### 返回值

| 属性                  | 类型       | 说明                        |
| --------------------- | ---------- | --------------------------- |
| activeContentId       | string     | 当前选中的内容 ID           |
| activeParentContentId | string     | 当前选中的内容所属的父级 ID |
| registerLinkage       | () => void | 注册联动事件                |

### usePDFMarkLayer

用于在 PDF 文档上实现标注层功能。

```tsx
const { run } = usePDFMarkLayer({
  containerRef,
  pdfViewerRef,
  rects,
  pages,
  dpi,
  activeContentId,
  showMark,
});
```

#### 参数

| 参数            | 类型                                                                                   | 必填 | 说明              |
| --------------- | -------------------------------------------------------------------------------------- | ---- | ----------------- |
| containerRef    | [React.RefObject](https://react.dev/reference/react/useRef#typing-the-ref-object)<any> | 是   | PDF 容器引用      |
| pdfViewerRef    | [React.RefObject](https://react.dev/reference/react/useRef#typing-the-ref-object)<any> | 否   | PDF 查看器引用    |
| rects           | [IRectItem](#irectitem)[][]                                                            | 否   | 标注框数据        |
| pages           | [IPageItem](#ipageitem)[]                                                              | 是   | 页面数据          |
| dpi             | number                                                                                 | 否   | 分辨率            |
| activeContentId | string                                                                                 | 否   | 当前选中的内容 ID |
| showMark        | boolean                                                                                | 否   | 是否显示标注      |

#### 返回值

| 属性 | 类型       | 说明       |
| ---- | ---------- | ---------- |
| run  | () => void | 运行标注层 |

### usePreviewTool

用于实现预览工具栏功能，包括缩放、旋转和 1:1 还原。

```tsx
const { tools, scale, rotate, position, onMouseDown, onWheel, resizeScale } =
  usePreviewTool({
    viewContainerRef,
    viewRef,
    toolbarOptions,
  });
```

#### 参数

| 参数             | 类型                                                                                           | 必填 | 说明         |
| ---------------- | ---------------------------------------------------------------------------------------------- | ---- | ------------ |
| viewContainerRef | [React.RefObject](https://react.dev/reference/react/useRef#typing-the-ref-object)<HTMLElement> | 是   | 预览容器引用 |
| viewRef          | [React.RefObject](https://react.dev/reference/react/useRef#typing-the-ref-object)<HTMLElement> | 是   | 预览内容引用 |
| toolbarOptions   | [ToolbarOptions](#toolbaroptions)                                                              | 否   | 工具栏配置   |

#### 返回值

| 属性        | 类型                                  | 说明                 |
| ----------- | ------------------------------------- | -------------------- |
| tools       | [PreviewToolItem](#previewtoolitem)[] | 工具栏配置项         |
| scale       | number                                | 当前缩放比例         |
| rotate      | number                                | 当前旋转角度         |
| position    | { x: number; y: number }              | 当前位移位置         |
| onMouseDown | (event: any) => void                  | 鼠标按下事件处理函数 |
| onWheel     | (event: WheelEvent) => void           | 滚轮事件处理函数     |
| resizeScale | () => void                            | 重置缩放比例函数     |

## 示例

#### [图片示例](https://github.com/intsig-textin/textin-ocr-frontend/tree/main/src/examples/ImageExample.tsx)

#### [PDF示例](https://github.com/intsig-textin/textin-ocr-frontend/tree/main/src/examples/PDFExample.tsx)

## 未来规划

- 组件支持更多自定义配置、样式覆盖等特性
- 支持可编辑、复制、导出结果
- 支持更多复杂类型如通用文档解析识别结果展示

## 贡献

欢迎提交 Issue 和 Pull Request。

## 二次开发

项目基于 vite 和 react 构建，您可将该项目 fork 到本地自主扩展：

拉取项目

```bash
git clone https://github.com/intsig-textin/textin-ocr-frontend.git
```

安装依赖

```bash
npm install
```

启动项目

```bash
npm run dev
```

浏览器访问 http://localhost:5173/

## 贡献

欢迎贡献代码！在开始之前，请阅读 [CONTRIBUTING.md](https://github.com/intsig-textin/textin-ocr-frontend/blob/main/CONTRIBUTING.md) 以了解贡献流程和指南。

## 许可证

本项目采用 [CC-NC License](https://github.com/intsig-textin/textin-ocr-frontend/blob/main/LICENSE)。
