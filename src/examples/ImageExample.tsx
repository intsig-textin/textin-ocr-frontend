import { useLayoutEffect, useRef, useState } from "react";
import FilePreview from "../components/FilePreview";
import { RadioGroup } from "../components/RadioGroup";
import ResultView from "../components/ResultView";
import { imageExample } from "./data";
import JsonView from "../components/JsonView";
import { useContentLinkage } from "../hooks/useContentLinkage";

export default function ImageExample() {
  const [resultTab, setResultTab] = useState("text");
  const viewContainerRef = useRef<HTMLElement | null>(null);
  const resultContainerRef = useRef<HTMLElement | null>(null);

  const { activeParentContentId, activeContentId, registerLinkage } =
    useContentLinkage({
      viewContainerRef,
      resultContainerRef,
    });

  useLayoutEffect(() => {
    registerLinkage();
  }, []);

  return (
    <div
      style={{
        display: "flex",
        width: "100%",
        height: "calc(100% - 80px)",
        padding: 16,
        textAlign: "center",
        columnGap: 32,
      }}
    >
      <div style={{ flex: 4, minWidth: "40%", maxWidth: "60%" }}>
        <div style={{ margin: 16 }}>预览</div>
        <div
          style={{
            position: "relative",
            overflow: "hidden",
            maxWidth: "100%",
            maxHeight: "calc(100% - 80px)",
            height: "calc(100% - 80px)",
          }}
        >
          <FilePreview
            src={imageExample.src}
            rects={imageExample.rects}
            pages={imageExample.pages}
            getContainerRef={viewContainerRef}
            activeContentId={activeContentId}
          />
        </div>
      </div>
      <div style={{ flex: 6, minWidth: "40%", maxWidth: "60%" }}>
        <RadioGroup
          style={{ margin: 16 }}
          optionStyle={{ flex: 1 }}
          type="line"
          options={[
            { label: "识别结果", value: "text" },
            { label: "JSON结果", value: "json" },
          ]}
          value={resultTab}
          onChange={setResultTab}
        />
        {resultTab === "text" && (
          <ResultView
            style={{
              position: "relative",
              overflow: "auto",
              maxWidth: "100%",
              maxHeight: "calc(100% - 80px)",
              height: "calc(100% - 80px)",
            }}
            // resultList={example2.result}
            resultList={imageExample.result}
            getContainerRef={resultContainerRef}
            activeContentId={activeContentId}
            activeParentContentId={activeParentContentId}
          />
        )}
        {resultTab === "json" && (
          <JsonView
            style={{
              padding: "0 16px",
              height: "calc(100% - 80px)",
              overflow: "auto",
            }}
            src={imageExample.json}
          />
        )}
      </div>
    </div>
  );
}
