import { useRef, useEffect, useState, useCallback } from "react";
import StickyCard from "./components/MenuCard";
import DotNav from "./components/DotNav";
import { menuItems } from "./data/menuItems";
import dasvioLogo from "./assets/dasvio_logo.png";
import "./App.css";

function App() {
  const appRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);

  // Throttled scroll tracking
  useEffect(() => {
    const el = appRef.current;
    if (!el) return;
    let ticking = false;
    const handleScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const scrollTop = el.scrollTop;
        const vh = el.clientHeight;
        const index = Math.min(
          Math.round(scrollTop / vh),
          menuItems.length - 1
        );
        setActiveIndex(index);
        ticking = false;
      });
    };
    el.addEventListener("scroll", handleScroll, { passive: true });
    return () => el.removeEventListener("scroll", handleScroll);
  }, []);

  // Mouse drag-to-scroll (desktop)
  useEffect(() => {
    const el = appRef.current;
    if (!el) return;
    let isDragging = false;
    let startY = 0;
    let startScroll = 0;

    const onMouseDown = (e) => {
      // Ignore clicks on interactive elements
      if (e.target.closest("button, a, .dot-nav")) return;
      isDragging = true;
      startY = e.clientY;
      startScroll = el.scrollTop;
      el.style.cursor = "grabbing";
      el.style.userSelect = "none";
      e.preventDefault();
    };
    const onMouseMove = (e) => {
      if (!isDragging) return;
      const delta = startY - e.clientY;
      el.scrollTop = startScroll + delta * 1.5;
    };
    const onMouseUp = () => {
      if (!isDragging) return;
      isDragging = false;
      el.style.cursor = "";
      el.style.userSelect = "";
    };

    el.addEventListener("mousedown", onMouseDown);
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
    return () => {
      el.removeEventListener("mousedown", onMouseDown);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    };
  }, []);

  const goTo = useCallback((index) => {
    const el = appRef.current;
    if (!el) return;
    el.scrollTo({
      top: index * el.clientHeight,
      behavior: "smooth",
    });
  }, []);

  return (
    <div className="app" ref={appRef}>
      <div className="bg-watermark">Dasvio</div>

      <header className="header">
        <img src={dasvioLogo} alt="Dasvio" className="logo-img" />
        <p className="scroll-hint">(SCROLL DOWN)</p>
      </header>

      <main className="cards-stack">
        {menuItems.map((item, i) => (
          <StickyCard
            key={item.id}
            item={item}
            index={i}
            total={menuItems.length}
            scrollRef={appRef}
          />
        ))}
      </main>

      <DotNav
        total={menuItems.length}
        current={activeIndex}
        onDotClick={goTo}
      />

      <div className="scroll-down-arrow">⌄</div>
    </div>
  );
}

export default App;
