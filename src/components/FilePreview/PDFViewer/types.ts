import { TypedArray } from "../../../types/common";

export interface DocumentInitParameters {
  [key: string]: any;
  url?: string | URL;
  data?: TypedArray | ArrayBuffer | Array<number> | string;
  httpHeaders?: Object;
  withCredentials?: boolean;
  password?: string;
  length?: boolean;
}

export type PDFSrc = DocumentInitParameters;
