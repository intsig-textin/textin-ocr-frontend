import { IOriginResult } from "../types/keyVal";
import { transformKeyValApiResultToView } from "../utils/transformers";
import imageExampleJson from "./image_example.json";
import pdfExampleJson from "./pdf_example.json";

// 图片示例
export const imageExample = {
  src: [
    "https://web-api.textin.com/open/image/download?filename=62f87022e581449081b718f9c1cd9296",
  ],
  json: imageExampleJson,
  ...transformKeyValApiResultToView(imageExampleJson as IOriginResult),
};

// pdf示例
export const pdfExample = {
  src: "https://web-api.textin.com/open/image/download?filename=17c9fe6ace284ea1b99912b58bd674ed",
  json: pdfExampleJson,
  ...transformKeyValApiResultToView(pdfExampleJson as IOriginResult),
};
