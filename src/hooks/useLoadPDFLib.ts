import { useEffect, useMemo, useState } from "react";
import { useExternal } from "ahooks";
import { isIEBrowser } from "../utils/browser";

export const useLoadPDFLib = ({
  onLoad,
  onError,
}: { onLoad?: () => void; onError?: () => void } = {}) => {
  const [pdfLibReady, setPdfLibReady] = useState(
    () => !!(window.pdfjsLib && window.pdfjsWorker)
  );

  const { dir, buildDir, cmapsURL, getParams } = useMemo(() => {
    //TODO: 内置到本地
    const versionMap = {
      new: "https://static.textin.com/deps/pdfjs-dist@2.11.338",
      old: "https://static.textin.com/deps/pdfjs-dist@2.0.943",
    };
    const isOld = isIEBrowser || !document.body?.attachShadow;
    const dir = isOld ? versionMap.old : versionMap.new;
    return {
      dir,
      buildDir: dir + (isOld ? "" : "/legacy"),
      getParams: (scale: number) => (isOld ? scale : { scale }),
      cmapsURL: `${dir}/cmaps/`,
    };
  }, []);

  // 兼容IE 11 的版本
  const status1 = useExternal(`${buildDir}/build/pdf.min.js`);
  const status2 = useExternal(`${buildDir}/build/pdf.worker.min.js`);

  useEffect(() => {
    if (status1 === "error" || status2 === "error") {
      onError?.();
      setPdfLibReady(false);
      console.error("pdf load error");
    }
  }, [status1, status2]);

  useEffect(() => {
    (async () => {
      if (window.pdfjsLib && window.pdfjsWorker && !pdfLibReady) {
        setPdfLibReady(true);
        onLoad?.();
      }
    })();
  }, [status1, status2]);

  return { pdfLibReady, dir, buildDir, cmapsURL, getParams };
};
