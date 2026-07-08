import type { Attachment } from "svelte/attachments";
import { untrack } from "svelte";

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
  confine?: boolean;
}

export function createPanAndZoom(
  params: PanAndZoomParams,
): Attachment<HTMLElement> {
  return (element) => {
    const pointers = new Map<number, PointerEvent>();

    let initialDistance = 0;
    let initialScale = 0;

    let centreX = 0;
    let centreY = 0;

    let panSurfaceX = 0;
    let panSurfaceY = 0;

    function getConfinement() {
      if (params.confine !== true) {
        return undefined;
      }

      const content =
        element.firstElementChild instanceof HTMLElement
          ? element.firstElementChild
          : undefined;

      if (content === undefined) {
        return undefined;
      }

      const rect = element.getBoundingClientRect();
      const contentWidth = content.offsetWidth;
      const contentHeight = content.offsetHeight;

      if (
        rect.width === 0 ||
        rect.height === 0 ||
        contentWidth === 0 ||
        contentHeight === 0
      ) {
        return undefined;
      }

      const fitScale = Math.min(
        rect.width / contentWidth,
        rect.height / contentHeight,
      );

      if (!Number.isFinite(fitScale) || fitScale <= 0) {
        return undefined;
      }

      return {
        containerWidth: rect.width,
        containerHeight: rect.height,
        contentWidth,
        contentHeight,
        fitScale,
      };
    }

    function confineScale(scale: number): number {
      const minScale = params.minScale ?? 0.25;
      const maxScale = params.maxScale ?? 2.0;
      const confinement = getConfinement();

      if (confinement === undefined) {
        return clamp(scale, minScale, maxScale);
      }

      const confinedMaxScale = Math.min(maxScale, confinement.fitScale);
      const confinedMinScale = Math.min(minScale, confinedMaxScale);

      return clamp(scale, confinedMinScale, confinedMaxScale);
    }

    function confineOffsets(
      offsetX: number,
      offsetY: number,
      scale: number,
    ): [number, number] {
      const confinement = getConfinement();

      if (confinement === undefined) {
        return [offsetX, offsetY];
      }

      const scaledWidth = confinement.contentWidth * scale;
      const scaledHeight = confinement.contentHeight * scale;
      const maxX = Math.abs(scaledWidth - confinement.containerWidth) * 0.5;
      const maxY = Math.abs(scaledHeight - confinement.containerHeight) * 0.5;

      return [clamp(offsetX, -maxX, maxX), clamp(offsetY, -maxY, maxY)];
    }

    function confineCurrentOffsets() {
      const confinedScale = confineScale(params.scale);
      const [confinedX, confinedY] = confineOffsets(
        params.offsetX,
        params.offsetY,
        confinedScale,
      );

      params.offsetX = confinedX;
      params.offsetY = confinedY;
      params.scale = confinedScale;
    }

    function confineCurrentOffsetsWithoutTracking() {
      untrack(confineCurrentOffsets);
    }

    function setPanSurface(clientX: number, clientY: number) {
      const scale = params.scale;

      if (scale === 0) {
        panSurfaceX = 0;
        panSurfaceY = 0;
        return;
      }

      const rect = element.getBoundingClientRect();

      panSurfaceX =
        (clientX - rect.left - rect.width * 0.5 - params.offsetX) / scale;

      panSurfaceY =
        (clientY - rect.top - rect.height * 0.5 - params.offsetY) / scale;
    }

    function handlePointerDown(event: PointerEvent) {
      event.preventDefault();
      pointers.set(event.pointerId, event);
      element.setPointerCapture(event.pointerId);

      if (pointers.size === 1) {
        setPanSurface(event.clientX, event.clientY);
      } else if (pointers.size === 2) {
        const [p1, p2] = Array.from(pointers.values());

        initialDistance = distance(
          p1.clientX,
          p1.clientY,
          p2.clientX,
          p2.clientY,
        );

        initialScale = params.scale;

        const currentOffsetX = params.offsetX;
        const currentOffsetY = params.offsetY;

        const [initialMidpointX, initialMidpointY] = midpoint(
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

        const currentScale = params.scale;

        if (currentScale === 0) {
          return;
        }

        const rect = element.getBoundingClientRect();

        const newX =
          pointer.clientX -
          rect.left -
          rect.width * 0.5 -
          panSurfaceX * currentScale;

        const newY =
          pointer.clientY -
          rect.top -
          rect.height * 0.5 -
          panSurfaceY * currentScale;

        const [confinedX, confinedY] = confineOffsets(newX, newY, currentScale);

        params.offsetX = confinedX;
        params.offsetY = confinedY;
      } else if (pointers.size === 2) {
        const [p1, p2] = Array.from(pointers.values());

        const currentDistance = distance(
          p1.clientX,
          p1.clientY,
          p2.clientX,
          p2.clientY,
        );

        if (initialDistance === 0) {
          return;
        }

        const scaleChange = currentDistance / initialDistance;

        const newScale = confineScale(initialScale * scaleChange);

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

        const [confinedX, confinedY] = confineOffsets(
          newOffsetX,
          newOffsetY,
          newScale,
        );

        params.offsetX = confinedX;
        params.offsetY = confinedY;

        params.scale = newScale;
      }
    }

    function handlePointerUp(event: PointerEvent) {
      event.preventDefault();
      pointers.delete(event.pointerId);

      if (element.hasPointerCapture(event.pointerId)) {
        element.releasePointerCapture(event.pointerId);
      }

      if (pointers.size === 1) {
        const pointer = Array.from(pointers.values()).at(0);

        if (pointer === undefined) {
          return;
        }

        setPanSurface(pointer.clientX, pointer.clientY);
      }
    }

    function handleWheel(event: WheelEvent) {
      event.preventDefault();

      const delta = -event.deltaY;
      const scaleChange = 1 + delta / (params.scaleSmoothing ?? 500);
      const currentScale = params.scale;

      if (currentScale === 0) {
        return;
      }

      const newScale = confineScale(currentScale * scaleChange);

      const adjustedScale = newScale / currentScale;

      const rect = element.getBoundingClientRect();

      const newOffsetX = event.clientX - rect.left - rect.width * 0.5;
      const newOffsetY = event.clientY - rect.top - rect.height * 0.5;

      const newX = newOffsetX - adjustedScale * (newOffsetX - params.offsetX);
      const newY = newOffsetY - adjustedScale * (newOffsetY - params.offsetY);
      const [confinedX, confinedY] = confineOffsets(newX, newY, newScale);

      params.offsetX = confinedX;
      params.offsetY = confinedY;

      params.scale = newScale;
    }

    const resizeObserver =
      params.confine === true
        ? new ResizeObserver(confineCurrentOffsetsWithoutTracking)
        : undefined;

    if (resizeObserver !== undefined) {
      resizeObserver.observe(element);

      const content =
        element.firstElementChild instanceof HTMLElement
          ? element.firstElementChild
          : undefined;

      if (content !== undefined) {
        resizeObserver.observe(content);
      }

      confineCurrentOffsetsWithoutTracking();
    }

    element.addEventListener("pointerdown", handlePointerDown);
    element.addEventListener("pointermove", handlePointerMove);
    element.addEventListener("pointerup", handlePointerUp);
    element.addEventListener("pointercancel", handlePointerUp);
    element.addEventListener("wheel", handleWheel, { passive: false });

    return () => {
      element.removeEventListener("pointerdown", handlePointerDown);
      element.removeEventListener("pointermove", handlePointerMove);
      element.removeEventListener("pointerup", handlePointerUp);
      element.removeEventListener("pointercancel", handlePointerUp);
      element.removeEventListener("wheel", handleWheel);
      resizeObserver?.disconnect();
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
