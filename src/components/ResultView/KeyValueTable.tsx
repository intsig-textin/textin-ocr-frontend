import { useLayoutEffect, useRef } from "react";
import classNames from "classnames";
import { scrollIntoViewIfNeeded } from "../../utils/dom";
import { IFieldItem } from "../../types/keyVal";
import styles from "./KeyValueTable.module.less";

export interface IKeyValueTableProps {
  dataSource: IFieldItem[];
  width?: number;
  valueWidth?: number;
  activeContentId?: string;
  getContainer: () => HTMLElement | null | undefined;
}

export default function KeyValueTable({
  dataSource,
  width,
  valueWidth,
  activeContentId,
  getContainer,
}: IKeyValueTableProps) {
  return (
    <div className={styles.tableWrapper}>
      {dataSource.map(({ key, ...rowItem }) => (
        <Field
          key={rowItem.uid}
          {...rowItem}
          width={width}
          valueWidth={valueWidth}
          active={rowItem.uid === activeContentId}
          getContainer={getContainer}
        />
      ))}
    </div>
  );
}

interface IFieldProps extends Pick<IFieldItem, "value" | "description"> {
  parent_uid?: string;
  uid: string;
  width?: number | any;
  valueWidth?: any;
  disabled?: boolean;
  active?: boolean;
  onClick?: (e: any) => void;
  getContainer: () => HTMLElement | null | undefined;
}

export function Field({
  parent_uid,
  uid,
  value,
  description,
  width,
  valueWidth,
  active,
  onClick,
  getContainer,
}: IFieldProps) {
  const rowRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (active && rowRef.current) {
      const container = getContainer();
      const scrollOptions: ScrollIntoViewOptions = {
        block: "nearest",
        inline: "nearest",
      };
      if (container) {
        scrollIntoViewIfNeeded(
          rowRef.current,
          container,
          scrollOptions,
          rowRef.current.getBoundingClientRect().height
        );
      } else {
        rowRef.current.scrollIntoView(scrollOptions);
      }
    }
  }, [active]);

  return (
    <div
      ref={rowRef}
      className={classNames("robot-result-item", {
        active,
      })}
      onClick={onClick}
    >
      <div className="result-item-key" style={{ width: `${width}px` }}>
        {description}
      </div>
      <div
        className="result-item-value"
        style={{ width: `${valueWidth - width}px` }}
        data-content-id={uid}
        data-parent-content-id={parent_uid}
      >
        <div style={{ lineHeight: "18px" }}>{value}</div>
      </div>
    </div>
  );
}
