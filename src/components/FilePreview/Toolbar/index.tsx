import classNames from "classnames";
import { PreviewToolItem } from "../../../hooks/usePreviewTool";
import styles from "./index.module.less";

export interface IToolbarProps {
  className?: string;
  style?: React.CSSProperties;
  tools: PreviewToolItem[];
}

export default function Toolbar({ className, style, tools }: IToolbarProps) {
  return (
    <div className={classNames(className, styles.toolbar)} style={style}>
      <ul className={styles.toolbarList}>
        {tools.map(({ Icon, onClick, type, disabled, ...props }) => {
          return (
            <li
              className={classNames({
                [styles.toolItemDisabled]: !!disabled,
                [styles.toolSplitLine]: type === "line",
                [styles.toolItem]: type !== "line",
              })}
              onClick={onClick}
              key={type}
            >
              {type !== "line" && Icon && (
                <Icon className={styles.toolItemIcon} {...props} />
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
