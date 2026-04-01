import { memo } from "react";

export default memo(function DotNav({ total, current, onDotClick }) {
  return (
    <div className="dot-nav">
      {Array.from({ length: total }, (_, i) => (
        <button
          key={i}
          className={`dot ${i === current ? "dot-active" : ""}`}
          onClick={() => onDotClick(i)}
          aria-label={`Go to item ${i + 1}`}
        />
      ))}
    </div>
  );
});
