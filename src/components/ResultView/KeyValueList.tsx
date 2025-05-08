import type { IFieldItem } from "../../types/keyVal";
import { Field } from "./KeyValueTable";
import styles from "./KeyValueList.module.less";

interface IKeyValueListProps {
  list: IFieldItem[][];
  width?: number;
  valueWidth?: number;
  disabled?: boolean;
  activeContentId?: string;
  onClick?: (e: any) => void;
  getContainer: () => HTMLElement | null | undefined;
}
export default function KeyValueList({
  list,
  width,
  valueWidth,
  disabled,
  onClick,
  activeContentId,
  getContainer,
}: IKeyValueListProps) {
  return (
    <div className={styles.container}>
      {list.map((rowItem, idx) => {
        return (
          <div className="rowWrap" key={idx}>
            {rowItem.map((row) => (
              <Field
                {...row}
                key={row.uid}
                width={width}
                valueWidth={valueWidth}
                active={row.uid === activeContentId}
                disabled={disabled}
                getContainer={getContainer}
                onClick={() => onClick?.(row.uid)}
              />
            ))}
          </div>
        );
      })}
    </div>
  );
}
