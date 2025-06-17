"use client";

import { useEffect } from "react";

export const ScrollLockDisabler = () => {
  useEffect(() => {
    const observer = new MutationObserver(() => {
      const body = document.body;
      if (body.getAttribute("data-scroll-locked")) {
        body.removeAttribute("data-scroll-locked");
        body.style.overflow = "visible";
        body.style.paddingRight = "0px";
        body.style.pointerEvents = "auto";
      }
    });

    observer.observe(document.body, {
      attributes: true,
      attributeFilter: ["data-scroll-locked"],
    });

    return () => observer.disconnect();
  }, []);

  return null;
};
