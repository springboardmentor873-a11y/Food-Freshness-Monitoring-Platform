export default function FreshnessStamp({ score, category, size = 92 }) {
  const label = (category || "").replace("_", " ");
  return (
    <div
      className={`stamp ${category || ""}`}
      style={{ width: size, height: size }}
      title={`Overall freshness score: ${score}`}
    >
      <span className="score">{Math.round(score)}</span>
      <span className="label">{label || "unrated"}</span>
    </div>
  );
}
