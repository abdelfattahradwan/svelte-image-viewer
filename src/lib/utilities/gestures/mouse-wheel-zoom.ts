import type { ActionReturn } from "svelte/action";

/**
 * @deprecated use `panAndZoom` instead
 */
export default function mouseWheelZoom(
  element: HTMLElement,
  callback: (delta: number) => void,
): ActionReturn {
  const handleWheel = (event: WheelEvent) => {
    event.preventDefault();
    callback(event.deltaY);
  };

  element.addEventListener("wheel", handleWheel, { passive: false });

  return {
    destroy() {
      element.removeEventListener("wheel", handleWheel);
    },
  };
}
