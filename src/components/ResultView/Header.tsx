interface IHederProps {
  width: number | any;
  valueWidth: number | any;
}
export default function Header({ width, valueWidth }: IHederProps) {
  return (
    <div className="result-title">
      <div className="result-title-key" style={{ width: `${width}px` }}>
        字段名
      </div>
      <div
        className="result-title-value"
        style={{ width: `${valueWidth - width}px` }}
      >
        信息内容
      </div>
    </div>
  );
}
