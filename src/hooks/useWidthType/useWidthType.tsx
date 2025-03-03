import { useEffect, useState } from "react";
import { WidthTypeProps, widthTypes } from "./types.ts";

function getWidthType(width: number): widthTypes {
  if (width < 600) {
    return "mobile";
  } else if (width >= 600 && width < 900) {
    return "tablet";
  } else {
    return "desktop";
  }
}

function useWidthType(): WidthTypeProps {
  const [widthType, setWidthType] = useState<widthTypes>(
    getWidthType(window.innerWidth),
  );
  useEffect(() => {
    function handleResize() {
      setTimeout(() => {
        setWidthType(getWidthType(window.innerWidth));
      }, 1);
    }

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return {
    widthType,
    isMobile: widthType === "mobile",
    isTablet: widthType === "tablet",
    isDesktop: widthType === "desktop",
  };
}

export default useWidthType;
