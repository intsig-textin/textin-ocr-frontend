/**
 * 解析结果展示组件
 *
 */

import React, { ReactNode, useEffect, useMemo, useRef, useState } from "react";
import classNames from "classnames";
import { RadioGroup } from "../RadioGroup";
import { IResultListItem } from "../../types/keyVal";
import { ensureArray } from "../../utils/object";
import Header from "./Header";
import KeyValueTable from "./KeyValueTable";
import KeyValueList from "./KeyValueList";
import styles from "./index.module.less";
import { BlockLoading } from "../Loading";

export interface IResultViewProps {
  className?: string;
  style?: React.CSSProperties;
  resultList?: IResultListItem[];
  getContainerRef?: React.RefObject<HTMLElement>;
  activeContentId?: string;
  activeParentContentId?: string;
  loading?: boolean;
  loadingComponent?: ReactNode;
}

export default function ResultView({
  className,
  style,
  resultList,
  getContainerRef,
  activeContentId,
  activeParentContentId,
  loading,
  loadingComponent,
}: IResultViewProps) {
  const [activeItemId, setActiveItemId] = useState(resultList?.[0]?.uid);
  const changeActiveItem = (value: string) => {
    setActiveItemId(value);
  };
  const activeItemResult = useMemo(
    () =>
      ensureArray<IResultListItem>(resultList).find(
        (item) => item.uid === activeItemId
      ),
    [activeItemId, resultList]
  );

  useEffect(() => {
    if (activeParentContentId && activeParentContentId !== activeItemId) {
      changeActiveItem(activeParentContentId);
    }
  }, [activeParentContentId]);

  const refValue = useRef<any>();
  const [width, setWidth] = useState<number>();
  const [valueWidth, setValueWidth] = useState<number>();

  useEffect(() => {
    const dataSource = [...(activeItemResult?.list || [])];
    if (activeItemResult?.flightList?.length) {
      const list = activeItemResult?.flightList.reduce(
        (pre, cur) => [...pre, ...cur],
        []
      );
      dataSource.push(...list);
    }
    if (dataSource.length > 0) {
      const arr: any[] = [];
      dataSource.forEach((item) => {
        const count: number = countCharacters(item.description);
        arr.push(count);
      });
      const maxKey = Math.max(...arr);
      setWidth((maxKey + 2) * 6);
      const domValueWidth = refValue.current
        ? refValue.current?.offsetWidth
        : 0;
      setValueWidth(domValueWidth);
    }
  }, [activeItemResult]);

  const countCharacters = (str: string = "") => {
    let totalCount = 0;
    for (let i = 0; i < str.length; i++) {
      const c = str.charCodeAt(i);
      if ((c >= 0x0001 && c <= 0x007e) || (0xff60 <= c && c <= 0xff9f)) {
        totalCount++;
      } else {
        totalCount += 2;
      }
    }
    return totalCount;
  };

  const splitIndex = useMemo(() => {
    if (
      !activeItemResult ||
      !(
        Array.isArray(activeItemResult.flightList) &&
        activeItemResult.flightList.length
      )
    )
      return -1;
    return activeItemResult.flightList[0]?.some((i) => i.value)
      ? activeItemResult.list?.findIndex((i) => i.value === "")
      : -1;
  }, [activeItemResult]);

  return (
    <div
      className={classNames(styles.resultContainer, className)}
      style={style}
      ref={getContainerRef as React.RefObject<HTMLDivElement>}
    >
      <RadioGroup
        className={styles.radioGroup}
        onChange={changeActiveItem}
        value={activeItemId}
        options={(resultList || []).map((item) => ({
          label: `${item.no} ${item.description}`,
          value: item.uid,
          labelProps: {
            "data-content-id": item.uid,
          },
        }))}
      />
      <div className={styles.contentContainer}>
        {activeItemResult && (
          <>
            <Header width={width} valueWidth={valueWidth} />
            <div
              className={styles.content}
              ref={refValue}
              data-page-number={activeItemResult.page_id}
            >
              <KeyValueTable
                dataSource={activeItemResult?.list?.slice(
                  0,
                  splitIndex > 0 ? splitIndex : undefined
                )}
                width={width}
                valueWidth={valueWidth}
                activeContentId={activeContentId}
                getContainer={() => getContainerRef?.current}
              />
              <KeyValueList
                list={activeItemResult.flightList}
                width={width}
                valueWidth={valueWidth}
                activeContentId={activeContentId}
                getContainer={() => getContainerRef?.current}
              />
              {splitIndex > 0 && (
                <KeyValueTable
                  dataSource={activeItemResult?.list?.slice(splitIndex)}
                  width={width}
                  valueWidth={valueWidth}
                  activeContentId={activeContentId}
                  getContainer={() => getContainerRef?.current}
                />
              )}
            </div>
          </>
        )}
      </div>
      {loading && (loadingComponent || <BlockLoading />)}
    </div>
  );
}
