import React, { useState, useEffect } from "react";
import classNames from "classnames";
import OutlineLeft from "../../../assets/outline-left.svg?react";
import OutlineRight from "../../../assets/outline-right.svg?react";
import styles from "./index.module.less";

export interface IPaginationProps {
  className?: string;
  style?: React.CSSProperties;
  current: number;
  total: number;
  onChange?: (page: number) => void;
}

export default function Pagination({
  className,
  style,
  current,
  total,
  onChange,
}: IPaginationProps) {
  const [inputPage, setInputPage] = useState(current.toString());

  useEffect(() => {
    if (current) {
      setInputPage(current.toString());
    }
  }, [current]);

  const handleChange = (page: number) => {
    if (page < 1 || page > total || page === current) return;
    onChange?.(page);
  };

  const handleJump = (_e: React.KeyboardEvent | React.FocusEvent) => {
    const page = parseInt(inputPage);
    if (isNaN(page) || page < 1 || page > total) {
      return;
    }
    handleChange(page);
  };

  if (total === 0) return null;

  return (
    <div className={classNames(styles.pagination, className)} style={style}>
      {/* 上一页按钮 */}
      <OutlineLeft
        className={classNames(styles.pageChangeIcon, styles.prev, {
          [styles.disabled]: current === 1,
        })}
        onClick={() => handleChange(current - 1)}
        aria-label="Previous page"
      />

      {/* 当前页码 */}
      <div className={styles.pageIndicator}>
        <input
          type="text"
          className={classNames(styles.pageInput)}
          value={inputPage}
          size={total}
          onChange={(e) => setInputPage(e.target.value.replace(/[^0-9]/g, ""))}
          onKeyDown={(e) => e.key === "Enter" && handleJump(e)}
          onBlur={handleJump}
          disabled={total === 0}
          aria-label="跳转页码"
        />
        <span className={styles.separator}>/</span>
        {total}
      </div>

      {/* 下一页按钮 */}
      <OutlineRight
        className={classNames(styles.pageChangeIcon, styles.next, {
          [styles.disabled]: current === total,
        })}
        onClick={() => handleChange(current + 1)}
        aria-label="Next page"
      />
    </div>
  );
}
