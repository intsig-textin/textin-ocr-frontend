/**
 * Json结果展示组件
 * TODO: 接口和使用说明
 */

import ReactJson, { ReactJsonViewProps } from "react-json-view";

export default function JsonView({ style, src, ...rest }: ReactJsonViewProps) {
  return (
    <ReactJson
      style={{
        fontFamily: "Monaco, Menlo, Consolas, monospace",
        color: "#9b0c79",
        textAlign: "left",
        ...style,
      }}
      src={src}
      enableClipboard={false}
      onEdit={false}
      name={null}
      collapsed={3}
      onAdd={false}
      displayDataTypes={false}
      displayObjectSize={false}
      collapseStringsAfterLength={1000}
      {...rest}
    />
  );
}
