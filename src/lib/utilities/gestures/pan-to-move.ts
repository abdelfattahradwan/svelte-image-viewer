export default function panToMove(
  element: HTMLElement,
  callback: (deltaX: number, deltaY: number) => void,
) {
  const events = new Map<number, PointerEvent>();

  const updatePosition = () => {
    const points = Array.from(events.values());

    if (points.length === 0) {
      return null;
    }

    const sum = points.reduce(
      (acc, { clientX, clientY }) => ({
        x: acc.x + clientX,
        y: acc.y + clientY,
      }),
      { x: 0, y: 0 },
    );

    return {
      x: sum.x / points.length,
      y: sum.y / points.length,
    };
  };

  let lastCentroid: {
    x: number;
    y: number;
  } | null = null;

  const handlePointerDown = (event: PointerEvent) => {
    events.set(event.pointerId, event);
    lastCentroid = updatePosition();
  };

  const handlePointerMove = (event: PointerEvent) => {
    if (lastCentroid == null) {
      return;
    }

    events.set(event.pointerId, event);

    const newCentroid = updatePosition();

    if (newCentroid) {
      callback(newCentroid.x - lastCentroid.x, newCentroid.y - lastCentroid.y);
      lastCentroid = newCentroid;
    }
  };

  const handlePointerUp = (event: PointerEvent) => {
    events.delete(event.pointerId);

    if (events.size === 0) {
      lastCentroid = null;
    } else {
      lastCentroid = updatePosition();
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
