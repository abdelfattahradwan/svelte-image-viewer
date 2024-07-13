import type { ActionReturn } from "svelte/action";

export default function pinchToZoom(
  element: HTMLElement,
  callback: (delta: number) => void,
): ActionReturn {
  const events = new Map<number, PointerEvent>();

  let previousDistance: number | null = null;

  const handlePointerDown = (event: PointerEvent) => {
    events.set(event.pointerId, event);

    if (events.size === 2) {
      initialiseDistance();
    }
  };

  const handlePointerMove = (event: PointerEvent) => {
    events.set(event.pointerId, event);

    if (events.size === 2) {
      const [first, second] = Array.from(events.values());

      const distance = Math.hypot(
        second.clientX - first.clientX,
        second.clientY - first.clientY,
      );

      if (previousDistance !== null) {
        callback(previousDistance - distance);
      }

      previousDistance = distance;
    }
  };

  const handlePointerUp = (event: PointerEvent) => {
    events.delete(event.pointerId);

    if (events.size < 2) {
      previousDistance = null;
    }
  };

  const initialiseDistance = () => {
    if (events.size === 2) {
      const [first, second] = Array.from(events.values());

      previousDistance = Math.hypot(
        second.clientX - first.clientX,
        second.clientY - first.clientY,
      );
    }
  };

  element.addEventListener("pointerdown", handlePointerDown);
  element.addEventListener("pointermove", handlePointerMove);
  element.addEventListener("pointerup", handlePointerUp);
  element.addEventListener("pointercancel", handlePointerUp);
  element.addEventListener("pointerleave", handlePointerUp);
  element.addEventListener("pointerout", handlePointerUp);

  return {
    destroy() {
      element.removeEventListener("pointerdown", handlePointerDown);
      element.removeEventListener("pointermove", handlePointerMove);
      element.removeEventListener("pointerup", handlePointerUp);
      element.removeEventListener("pointercancel", handlePointerUp);
      element.removeEventListener("pointerleave", handlePointerUp);
      element.removeEventListener("pointerout", handlePointerUp);
    },
  };
}
