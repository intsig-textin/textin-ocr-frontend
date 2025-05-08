export type IOriginResult = {
  pages: IOriginPageItem[];
};

export interface IOriginPageItem {
  duration: number;
  page_number: number;
  ppi: number;
  result: {
    width: number;
    height: number;
    object_list?: IOriginResultListItem[];
    rotated_image_width?: number;
  };
}

export interface IOriginResultListItem {
  image_angle: number;
  class: string;
  item_list?: IOriginFieldItem[];
  flight_data_list?: IOriginFieldItem[][];
  product_list?: IOriginFieldItem[][];
  transport_list?: IOriginFieldItem[][];
  stamp_list?: IOriginFieldItem[][];
  qr_code_list?: IOriginFieldItem[][];
  kind: string;
  kind_description: string;
  position: number[];
  rotated_image_height: number;
  rotated_image_width: number;
  type: string;
  type_description: string;
  page_id?: number;
}
export interface IOriginFieldItem {
  key: string;
  type?: string;
  value: string;
  description: string;
  position: number[];
}

export interface IFieldItem extends IOriginFieldItem {
  uid: string;
  parent_uid?: string;
}

export interface IRectItem {
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

export interface IResultListItem extends IRectItem {
  type: string;
  description: string;
  no: number;
  list: IFieldItem[];
  flightList: IFieldItem[][];
  page_id?: number;
}

export interface IPageItem {
  page_number: number;
  duration: number;
  ppi: number;
  width: number;
  height: number;
  angle?: number;
}
