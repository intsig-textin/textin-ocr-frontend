declare module "*.css";
declare module "*.less" {
  const classes: { [key: string]: string };
  export default classes;
}
declare module "*.png";
declare module "*.jpg";
declare module "*.jpeg";
declare module "rc-util*";
declare module "*.xlsx";
declare module "*.svg" {
  export function ReactComponent(
    props: React.SVGProps<SVGSVGElement>
  ): React.ReactElement;
  const url: string;
  export default url;
}

declare interface Window {
  [key: string]: any;
  pdfjsLib?: any;
  pdfjsWorker?: any;
}
