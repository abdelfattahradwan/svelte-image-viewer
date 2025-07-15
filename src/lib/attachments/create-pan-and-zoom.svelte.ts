import type { Attachment } from "svelte/attachments";

interface PanAndZoomParams {
  get offsetX(): number;
  set offsetX(value: number);
  get offsetY(): number;
  set offsetY(value: number);
  get scale(): number;
  set scale(value: number);
  minScale?: number;
  maxScale?: number;
  scaleSmoothing?: number;
}

export function createPanAndZoom(
  params: PanAndZoomParams,
): Attachment<HTMLElement> {
  return (element) => {
    const pointers = new Map<number, PointerEvent>();

    let initialDistance = 0;
    let initialScale = 0;

    let currentOffsetX = 0;
    let currentOffsetY = 0;

    let initialMidpointX = 0;
    let initialMidpointY = 0;

    let centreX = 0;
    let centreY = 0;

    function handlePointerDown(event: PointerEvent) {
      event.preventDefault();
      pointers.set(event.pointerId, event);
      element.setPointerCapture(event.pointerId);

      if (pointers.size === 1) {
        currentOffsetX = params.offsetX;
        currentOffsetY = params.offsetY;

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

        initialScale = params.scale;

        currentOffsetX = params.offsetX;
        currentOffsetY = params.offsetY;

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

        params.offsetX = newX;
        params.offsetY = newY;
      } else if (pointers.size === 2) {
        const [p1, p2] = Array.from(pointers.values());

        const currentDistance = distance(
          p1.clientX,
          p1.clientY,
          p2.clientX,
          p2.clientY,
        );

        const scaleChange = currentDistance / initialDistance;

        const newScale = clamp(
          initialScale * scaleChange,
          params.minScale ?? 0.25,
          params.maxScale ?? 2.0,
        );

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

        params.offsetX = newOffsetX;
        params.offsetY = newOffsetY;

        params.scale = newScale;
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

        currentOffsetX = params.offsetX;
        currentOffsetY = params.offsetY;

        initialMidpointX = pointer.clientX;
        initialMidpointY = pointer.clientY;
      }
    }

    function handleWheel(event: WheelEvent) {
      event.preventDefault();

      const delta = -event.deltaY;
      const scaleChange = 1 + delta / (params.scaleSmoothing ?? 500);
      const currentScale = params.scale;

      const newScale = clamp(
        currentScale * scaleChange,
        params.minScale ?? 0.25,
        params.maxScale ?? 2.0,
      );

      const adjustedScale = newScale / currentScale;

      const rect = element.getBoundingClientRect();

      const newOffsetX = event.clientX - rect.left - rect.width * 0.5;
      const newOffsetY = event.clientY - rect.top - rect.height * 0.5;

      const newX = newOffsetX - adjustedScale * (newOffsetX - params.offsetX);
      const newY = newOffsetY - adjustedScale * (newOffsetY - params.offsetY);

      params.offsetX = newX;
      params.offsetY = newY;

      params.scale = newScale;
    }

    element.addEventListener("pointerdown", handlePointerDown);
    element.addEventListener("pointermove", handlePointerMove);
    element.addEventListener("pointerup", handlePointerUp);
    element.addEventListener("pointercancel", handlePointerUp);
    element.addEventListener("pointerleave", handlePointerUp);
    element.addEventListener("pointerout", handlePointerUp);
    element.addEventListener("wheel", handleWheel, { passive: false });

    return () => {
      element.removeEventListener("pointerdown", handlePointerDown);
      element.removeEventListener("pointermove", handlePointerMove);
      element.removeEventListener("pointerup", handlePointerUp);
      element.removeEventListener("pointercancel", handlePointerUp);
      element.removeEventListener("pointerleave", handlePointerUp);
      element.removeEventListener("pointerout", handlePointerUp);
      element.removeEventListener("wheel", handleWheel);
    };
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
