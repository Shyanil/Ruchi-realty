import { useEffect } from "react";

export default function ProgressiveImages() {
  useEffect(() => {
    const root = document.documentElement;
    let frame;

    const prepare = (image) => {
      if (!(image instanceof HTMLImageElement) || image.loading !== "lazy") return;
      image.dataset.progressive = "";
      if (image.complete) image.classList.add("is-loaded");
    };

    const prepareTree = (node) => {
      if (!(node instanceof Element)) return;
      if (node.matches("img")) prepare(node);
      node.querySelectorAll?.("img").forEach(prepare);
    };

    const settle = (event) => {
      const image = event.target;
      if (image instanceof HTMLImageElement && "progressive" in image.dataset) image.classList.add("is-loaded");
    };

    document.querySelectorAll("img").forEach(prepare);
    document.addEventListener("load", settle, true);
    document.addEventListener("error", settle, true);

    const observer = new MutationObserver((records) => {
      records.forEach((record) => record.addedNodes.forEach(prepareTree));
    });
    observer.observe(document.body, { childList: true, subtree: true });
    frame = window.requestAnimationFrame(() => root.classList.add("images-enhanced"));

    return () => {
      observer.disconnect();
      document.removeEventListener("load", settle, true);
      document.removeEventListener("error", settle, true);
      window.cancelAnimationFrame(frame);
      root.classList.remove("images-enhanced");
    };
  }, []);

  return null;
}
