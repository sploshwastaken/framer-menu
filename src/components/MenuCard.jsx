import { memo } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

export default memo(function StickyCard({ item, index, total, scrollRef }) {
  const isLast = index === total - 1;

  const { scrollY } = useScroll({ container: scrollRef });

  const scrollStart = useTransform(scrollY, (y) => {
    const vh = scrollRef.current ? scrollRef.current.clientHeight : window.innerHeight;
    const start = index * vh;
    const end = (index + 1) * vh;
    return Math.max(0, Math.min(1, (y - start) / (end - start)));
  });

  const scale = useTransform(
    scrollStart,
    [0, 0.1, 0.5, 1],
    isLast ? [1, 1, 1, 1] : [1, 1, 0.60, 0.52]
  );
  const borderRadius = useTransform(
    scrollStart,
    [0, 0.3, 1],
    isLast ? [4, 4, 4] : [4, 4, 24]
  );

  return (
    <div
      className="card-sticky-wrapper"
      style={{ zIndex: index }}
    >
      <motion.div
        className="menu-card"
        style={{
          scale,
          borderRadius,
        }}
      >
        <div className="card-image-wrapper">
          <img src={item.image} alt={item.name} className="card-image" loading="lazy" />
        </div>
        <div className="card-info">
          <div className="card-header">
            <h2 className="card-title">{item.name}</h2>
            {item.badge && <span className="card-badge">({item.badge})</span>}
          </div>
          <p className="card-description">{item.description}</p>
          <p className="card-price">Dhs. {item.price}</p>
        </div>
      </motion.div>
    </div>
  );
});
