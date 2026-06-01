"use client";

import { useEffect } from "react";
import AOS from "aos";

/**
 * Initializes "Animate On Scroll" once on the client, mirroring the original
 * template's AOS.init call in assets/js/main.js.
 */
export default function AosInit() {
  useEffect(() => {
    AOS.init({
      duration: 1000,
      easing: "ease-in-out",
      once: true,
      mirror: false,
    });
  }, []);

  return null;
}
