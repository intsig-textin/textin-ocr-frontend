import {
  IOriginPageItem,
  IOriginResult,
  IOriginResultListItem,
  IOriginFieldItem,
  IFieldItem,
  IResultListItem,
  IRectItem,
} from "../types/keyVal";
import { ensureArray, sortList } from "./object";
import { generateUUID } from "./uuid";

const convertFieldtem =
  (parentUid: string) =>
  ({
    value,
    description,
    key,
    position,
    type,
  }: IOriginFieldItem): IFieldItem => ({
    type,
    position: ensureArray(position),
    value,
    description: description || key || "",
    key,
    uid: generateUUID(),
    parent_uid: parentUid,
  });

export const convertApiDataToResultList = (
  res: IOriginResult
): IResultListItem[] => {
  const objectList: IOriginResultListItem[] = res.pages.reduce(
    (pre: IOriginResultListItem[], cur, i: number) => [
      ...pre,
      ...(cur.result.object_list || []).map((item) => ({
        ...item,
        page_id: i,
      })),
    ],
    []
  );

  return objectList.map(
    (
      {
        position,
        type,
        type_description,
        item_list = [],
        flight_data_list,
        product_list,
        transport_list,
        stamp_list,
        qr_code_list,
        page_id = 0,
      },
      idx
    ) => {
      const tableData =
        product_list || flight_data_list || transport_list || [];
      const otherList = [
        ...ensureArray<IOriginFieldItem[]>(stamp_list).map((list) =>
          ensureArray<IOriginFieldItem>(list).map((item) => ({
            ...item,
            type: "stamp",
          }))
        ),
        ...ensureArray<IOriginFieldItem[]>(qr_code_list).map((list) =>
          ensureArray<IOriginFieldItem>(list).map((item) => ({
            ...item,
            type: "image",
          }))
        ),
      ];
      const typeItem = ensureArray<IOriginFieldItem>(item_list).find(
        (item) => item.key === "invoice_type"
      );
      const parentUid = generateUUID();
      return {
        uid: parentUid,
        position: ensureArray(position).slice(0, 8),
        type,
        no: idx + 1,
        description: typeItem?.value || type_description,
        list: sortList(
          ensureArray<IOriginFieldItem>(item_list).map(
            convertFieldtem(parentUid)
          )
        ),
        flightList: [
          ...tableData.map((item) =>
            sortList(item.map(convertFieldtem(parentUid)))
          ),
          ...otherList.map((item) =>
            sortList(item.map(convertFieldtem(parentUid)))
          ),
        ],
        page_id: page_id + 1,
      } as IResultListItem;
    }
  );
};

export const transformKeyValApiResultToView = (result: IOriginResult) => {
  const resultList = convertApiDataToResultList(result);
  const rects = resultList.reduce((pre: Record<string, any>[][], item) => {
    if (typeof item.page_id === "number") {
      const pageIndex = item.page_id - 1;
      if (!pre[pageIndex]) {
        pre[pageIndex] = [];
      }

      if (Array.isArray(item.list)) {
        for (const row of item.list) {
          pre[pageIndex].push({
            content_id: row.uid,
            position: row.position,
            parent_id: item.uid,
          });
        }
      }
      let preItem;
      if (Array.isArray(item.flightList)) {
        for (const rowList of item.flightList) {
          for (const row of rowList) {
            // 印章多个字段共用一个坐标框
            if (row.type === "stamp") {
              if (
                preItem?.type === row.type &&
                preItem.position?.join() === row.position?.join()
              ) {
                continue;
              }
            }
            preItem = { ...row };
            pre[pageIndex].push({
              content_id: row.uid,
              position: row.position,
              type: row.type,
              parent_id: item.uid,
            });
          }
        }
      }

      pre[pageIndex].push({
        content_id: item.uid,
        position: item.position,
        type: "category",
        render_text: item.no,
      });
    }

    return pre;
  }, []);
  const finalRects = rects.map((rect) =>
    rect
      .map(
        (item, i) =>
          ({
            ...item,
            uid: item.content_id,
            content_id: item.content_id,
            position: item.position,
            type: item.type,
            rect_type: item.rect_type,
            angle: item.angle || 0,
            renderText: item.render_text,
            sort: ["category"].includes(item.type as string) ? i - 10000 : i,
            parent_uid: item.parent_id,
          } as IRectItem)
      )
      .sort((a, b) => a.sort - b.sort)
  );
  const pages = ensureArray<IOriginPageItem>(result?.pages).map((item) => ({
    ...item,
    width: item.result.width,
    height: item.result.height,
  }));
  return { result: resultList, rects: finalRects, pages };
};
