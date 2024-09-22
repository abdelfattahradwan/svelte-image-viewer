import { get, type Writable } from "svelte/store";

interface PanAndZoomParams {
  container: HTMLElement;
  content: HTMLElement;
  offsetX: Writable<number>;
  offsetY: Writable<number>;
  scale: Writable<number>;
  minScale?: number;
  maxScale?: number;
}

export default function panAndZoom({
  container,
  content,
  offsetX,
  offsetY,
  scale,
  minScale = 0.25,
  maxScale = 2.0,
}: PanAndZoomParams): () => void {
  const pointers = new Map<number, PointerEvent>();
  let initialScale = get(scale);
  const currentOffset = { x: get(offsetX), y: get(offsetY) };
  const initialMidpoint = { x: 0, y: 0 };
  let initialDistance = 0;
  const centre = { x: 0, y: 0 };

  function handlePointerDown(event: PointerEvent) {
    event.preventDefault();
    pointers.set(event.pointerId, event);
    container.setPointerCapture(event.pointerId);

    if (pointers.size === 1) {
      currentOffset.x = get(offsetX);
      currentOffset.y = get(offsetY);
      initialMidpoint.x = event.clientX;
      initialMidpoint.y = event.clientY;
    } else if (pointers.size === 2) {
      const [p1, p2] = Array.from(pointers.values());
      initialDistance = calculateDistance(p1, p2);
      initialScale = get(scale);
      currentOffset.x = get(offsetX);
      currentOffset.y = get(offsetY);
      calculateMidpoint(p1, p2, initialMidpoint);
      const rect = container.getBoundingClientRect();
      centre.x =
        (initialMidpoint.x - rect.left - currentOffset.x) / initialScale;
      centre.y =
        (initialMidpoint.y - rect.top - currentOffset.y) / initialScale;
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

      const dx = pointer.clientX - initialMidpoint.x;
      const dy = pointer.clientY - initialMidpoint.y;
      const newX = currentOffset.x + dx;
      const newY = currentOffset.y + dy;
      offsetX.set(newX);
      offsetY.set(newY);
    } else if (pointers.size === 2) {
      const [p1, p2] = Array.from(pointers.values());
      const currentDistance = calculateDistance(p1, p2);
      const scaleDelta = currentDistance / initialDistance;
      const newScale = clamp(initialScale * scaleDelta, minScale, maxScale);
      const currentMidpoint = calculateMidpoint(p1, p2);
      const rect = container.getBoundingClientRect();
      const newOffsetX = currentMidpoint.x - rect.left - newScale * centre.x;
      const newOffsetY = currentMidpoint.y - rect.top - newScale * centre.y;
      offsetX.set(newOffsetX);
      offsetY.set(newOffsetY);
      scale.set(newScale);
    }
  }

  function handlePointerUp(event: PointerEvent) {
    event.preventDefault();
    pointers.delete(event.pointerId);
    container.releasePointerCapture(event.pointerId);

    if (pointers.size === 1) {
      const pointer = Array.from(pointers.values()).at(0);

      if (pointer === undefined) {
        return;
      }

      currentOffset.x = get(offsetX);
      currentOffset.y = get(offsetY);
      initialMidpoint.x = pointer.clientX;
      initialMidpoint.y = pointer.clientY;
    }
  }

  function handleWheel(event: WheelEvent) {
    event.preventDefault();
    const delta = -event.deltaY;
    const scaleDelta = 1 + delta / 500;
    const currentScale = get(scale);
    const newScale = clamp(currentScale * scaleDelta, minScale, maxScale);
    const adjustedScale = newScale / currentScale;
    const rect = container.getBoundingClientRect();
    const offset = {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
    };
    const newX = offset.x - adjustedScale * (offset.x - get(offsetX));
    const newY = offset.y - adjustedScale * (offset.y - get(offsetY));
    offsetX.set(newX);
    offsetY.set(newY);
    scale.set(newScale);
  }

  container.addEventListener("pointerdown", handlePointerDown);
  container.addEventListener("pointermove", handlePointerMove);
  container.addEventListener("pointerup", handlePointerUp);
  container.addEventListener("pointercancel", handlePointerUp);
  container.addEventListener("pointerleave", handlePointerUp);
  container.addEventListener("pointerout", handlePointerUp);
  container.addEventListener("wheel", handleWheel, { passive: false });

  return () => {
    container.removeEventListener("pointerdown", handlePointerDown);
    container.removeEventListener("pointermove", handlePointerMove);
    container.removeEventListener("pointerup", handlePointerUp);
    container.removeEventListener("pointercancel", handlePointerUp);
    container.removeEventListener("pointerleave", handlePointerUp);
    container.removeEventListener("pointerout", handlePointerUp);
    container.removeEventListener("wheel", handleWheel);
  };
}

function calculateDistance(p1: PointerEvent, p2: PointerEvent): number {
  return Math.hypot(p2.clientX - p1.clientX, p2.clientY - p1.clientY);
}

function calculateMidpoint(
  p1: PointerEvent,
  p2: PointerEvent,
  out?: { x: number; y: number },
): { x: number; y: number } {
  out ??= { x: 0, y: 0 };
  out.x = (p1.clientX + p2.clientX) / 2;
  out.y = (p1.clientY + p2.clientY) / 2;
  return out;
}

function clamp(value: number, min: number, max: number): number {
  return value < min ? min : value > max ? max : value;
}
