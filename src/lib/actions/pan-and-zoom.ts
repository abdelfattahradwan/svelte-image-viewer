import type { ActionReturn } from "svelte/action";
import { type Writable, get } from "svelte/store";

interface PanAndZoomParams {
  offsetX: Writable<number>;
  offsetY: Writable<number>;
  scale: Writable<number>;
  minScale?: number;
  maxScale?: number;
  scaleSmoothing?: number;
}

export default function panAndZoom(
  element: HTMLElement,
  {
    offsetX,
    offsetY,
    scale,
    minScale = 0.25,
    maxScale = 2.0,
    scaleSmoothing = 500,
  }: PanAndZoomParams,
): ActionReturn {
  const pointers = new Map<number, PointerEvent>();

  let initialDistance = 0;
  let initialScale = get(scale);

  let currentOffsetX = get(offsetX);
  let currentOffsetY = get(offsetY);

  let initialMidpointX = 0;
  let initialMidpointY = 0;

  let centreX = 0;
  let centreY = 0;

  function handlePointerDown(event: PointerEvent) {
    event.preventDefault();
    pointers.set(event.pointerId, event);
    element.setPointerCapture(event.pointerId);

    if (pointers.size === 1) {
      currentOffsetX = get(offsetX);
      currentOffsetY = get(offsetY);

      initialMidpointX = event.clientX;
      initialMidpointY = event.clientY;
    } else if (pointers.size === 2) {
      const [p1, p2] = Array.from(pointers.values());

      initialDistance = distance(
        p1.clientX,
        p1.clientY,
        p2.clientX,
        p2.clientY,
      );

      initialScale = get(scale);

      currentOffsetX = get(offsetX);
      currentOffsetY = get(offsetY);

      [initialMidpointX, initialMidpointY] = midpoint(
        p1.clientX,
        p1.clientY,
        p2.clientX,
        p2.clientY,
      );

      const rect = element.getBoundingClientRect();

      centreX =
        (initialMidpointX - rect.left - rect.width * 0.5 - currentOffsetX) /
        initialScale;

      centreY =
        (initialMidpointY - rect.top - rect.height * 0.5 - currentOffsetY) /
        initialScale;
    }
  }

  function handlePointerMove(event: PointerEvent) {
    if (!pointers.has(event.pointerId)) {
      return;
    }

    event.preventDefault();
    pointers.set(event.pointerId, event);

    if (pointers.size === 1) {
      const pointer = pointers.get(event.pointerId);

      if (pointer === undefined) {
        return;
      }

      const dx = pointer.clientX - initialMidpointX;
      const dy = pointer.clientY - initialMidpointY;

      const newX = currentOffsetX + dx;
      const newY = currentOffsetY + dy;

      offsetX.set(newX);
      offsetY.set(newY);
    } else if (pointers.size === 2) {
      const [p1, p2] = Array.from(pointers.values());

      const currentDistance = distance(
        p1.clientX,
        p1.clientY,
        p2.clientX,
        p2.clientY,
      );

      const scaleChange = currentDistance / initialDistance;
      const newScale = clamp(initialScale * scaleChange, minScale, maxScale);

      const [currentMidpointX, currentMidpointY] = midpoint(
        p1.clientX,
        p1.clientY,
        p2.clientX,
        p2.clientY,
      );

      const rect = element.getBoundingClientRect();

      const newOffsetX =
        currentMidpointX - rect.left - rect.width * 0.5 - newScale * centreX;

      const newOffsetY =
        currentMidpointY - rect.top - rect.height * 0.5 - newScale * centreY;

      offsetX.set(newOffsetX);
      offsetY.set(newOffsetY);

      scale.set(newScale);
    }
  }

  function handlePointerUp(event: PointerEvent) {
    event.preventDefault();
    pointers.delete(event.pointerId);
    element.releasePointerCapture(event.pointerId);

    if (pointers.size === 1) {
      const pointer = Array.from(pointers.values()).at(0);

      if (pointer === undefined) {
        return;
      }

      currentOffsetX = get(offsetX);
      currentOffsetY = get(offsetY);

      initialMidpointX = pointer.clientX;
      initialMidpointY = pointer.clientY;
    }
  }

  function handleWheel(event: WheelEvent) {
    event.preventDefault();

    const delta = -event.deltaY;
    const scaleChange = 1 + delta / scaleSmoothing;
    const currentScale = get(scale);
    const newScale = clamp(currentScale * scaleChange, minScale, maxScale);
    const adjustedScale = newScale / currentScale;

    const rect = element.getBoundingClientRect();

    const newOffsetX = event.clientX - rect.left - rect.width * 0.5;
    const newOffsetY = event.clientY - rect.top - rect.height * 0.5;

    const newX = newOffsetX - adjustedScale * (newOffsetX - get(offsetX));
    const newY = newOffsetY - adjustedScale * (newOffsetY - get(offsetY));

    offsetX.set(newX);
    offsetY.set(newY);

    scale.set(newScale);
  }

  element.addEventListener("pointerdown", handlePointerDown);
  element.addEventListener("pointermove", handlePointerMove);
  element.addEventListener("pointerup", handlePointerUp);
  element.addEventListener("pointercancel", handlePointerUp);
  element.addEventListener("pointerleave", handlePointerUp);
  element.addEventListener("pointerout", handlePointerUp);
  element.addEventListener("wheel", handleWheel, { passive: false });

  return {
    destroy() {
      element.removeEventListener("pointerdown", handlePointerDown);
      element.removeEventListener("pointermove", handlePointerMove);
      element.removeEventListener("pointerup", handlePointerUp);
      element.removeEventListener("pointercancel", handlePointerUp);
      element.removeEventListener("pointerleave", handlePointerUp);
      element.removeEventListener("pointerout", handlePointerUp);
      element.removeEventListener("wheel", handleWheel);
    },
  };
}

function clamp(value: number, min: number, max: number): number {
  return value < min ? min : value > max ? max : value;
}

function distance(x1: number, y1: number, x2: number, y2: number): number {
  return Math.hypot(x2 - x1, y2 - y1);
}

function midpoint(
  x1: number,
  y1: number,
  x2: number,
  y2: number,
): [number, number] {
  return [(x1 + x2) / 2, (y1 + y2) / 2];
}
