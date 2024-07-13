import type { ActionReturn } from "svelte/action";

export default function mouseWheelZoom(
  element: HTMLElement,
  callback: (delta: number) => void,
): ActionReturn {
  const handleWheel = (event: WheelEvent) => {
    event.preventDefault();
    callback(event.deltaY);
  };

  element.addEventListener("wheel", handleWheel);

  return {
    destroy() {
      element.removeEventListener("wheel", handleWheel);
    },
  };
}
