import { useState } from "react";
import "./App.css";
import ImageExample from "./examples/ImageExample";
import PDFExample from "./examples/PDFExample";

const styles = {
  container: {
    display: "flex",
    width: "100vw",
    height: "100vh",
    overflow: "hidden",
  },
  sidebar: {
    width: "160px",
    backgroundColor: "#f5f5f5",
    borderRight: "1px solid #e0e0e0",
    padding: "16px",
  },
  sidebarTitle: {
    fontSize: "14px",
    color: "#666",
    marginBottom: "8px",
    padding: "8px 0",
  },
  menuItem: {
    padding: "8px 12px",
    cursor: "pointer",
    borderRadius: "4px",
    marginBottom: "4px",
  },
  menuItemActive: {
    color: "#1a66ff",
  },
  menuItemInactive: {
    color: "#333",
    backgroundColor: "transparent",
  },
  content: {
    flex: 1,
    padding: "16px",
    overflow: "auto",
  },
} as const;

function App() {
  const [activeExample, setActiveExample] = useState<"image" | "pdf">("image");

  const getMenuItemStyle = (isActive: boolean) => ({
    ...styles.menuItem,
    ...(isActive ? styles.menuItemActive : styles.menuItemInactive),
  });

  return (
    <div style={styles.container}>
      {/* 左侧菜单 */}
      <div style={styles.sidebar}>
        <div style={styles.sidebarTitle}>示例列表</div>
        <div
          onClick={() => setActiveExample("image")}
          style={getMenuItemStyle(activeExample === "image")}
        >
          示例一：单张图片
        </div>
        <div
          onClick={() => setActiveExample("pdf")}
          style={getMenuItemStyle(activeExample === "pdf")}
        >
          示例二：多页PDF
        </div>
      </div>

      {/* 右侧内容区 */}
      <div style={styles.content}>
        {activeExample === "image" ? <ImageExample /> : <PDFExample />}
      </div>
    </div>
  );
}

export default App;
