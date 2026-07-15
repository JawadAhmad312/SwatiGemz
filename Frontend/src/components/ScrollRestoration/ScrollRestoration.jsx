import { useEffect } from "react";
import {
  useLocation,
  useNavigationType,
} from "react-router-dom";

const ScrollRestoration = () => {
  const location = useLocation();

  const navigationType = useNavigationType();

  // SAVE CURRENT SCROLL POSITION
  useEffect(() => {
    const saveScrollPosition = () => {
      sessionStorage.setItem(
        `scroll-${location.pathname}`,
        window.scrollY.toString()
      );
    };

    window.addEventListener(
      "scroll",
      saveScrollPosition
    );

    return () => {
      saveScrollPosition();

      window.removeEventListener(
        "scroll",
        saveScrollPosition
      );
    };
  }, [location.pathname]);

  // RESTORE EXACT POSITION ON BACK
  useEffect(() => {
    const savedPosition = sessionStorage.getItem(
      `scroll-${location.pathname}`
    );

    if (
      navigationType === "POP" &&
      savedPosition !== null
    ) {
      setTimeout(() => {
        window.scrollTo({
          top: parseInt(savedPosition, 10),
          left: 0,
          behavior: "auto",
        });
      }, 300);
    } else {
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: "auto",
      });
    }
  }, [location.pathname, navigationType]);

  return null;
};

export default ScrollRestoration;