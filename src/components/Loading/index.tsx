import React from "react";
import classNames from "classnames";
import styles from "./index.module.less";

interface LoadingProps {
  size?: number;
  color?: string;
  className?: string;
}

const Loading: React.FC<LoadingProps> = ({
  className,
  size = 20,
  color = "#1a66ff",
}) => {
  const spinnerStyle = {
    width: `${size}px`,
    height: `${size}px`,
    border: `2px solid ${color}`,
    borderTopColor: "transparent",
  };

  return (
    <div
      className={classNames(styles["loading-spinner"], className)}
      style={spinnerStyle}
    />
  );
};

export default Loading;

export function BlockLoading(props: LoadingProps) {
  return (
    <div className={styles["block-loading"]}>
      <Loading {...props} />
    </div>
  );
}
