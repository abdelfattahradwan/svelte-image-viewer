export interface ScaleToFitTargets {
  targetOffsetX: number;
  targetOffsetY: number;
  targetScale: number;
}

/**
 * Calculates the target viewer state needed to fit an element inside its parent container.
 *
 * @param element - The element to measure against its parent
 * @param currentScale - The element's current viewer scale
 * @returns Target offsets and scale for the viewer components
 */
export function scaleToFit(
  element: HTMLElement,
  currentScale: number,
): ScaleToFitTargets {
  const parent = element.parentElement;

  if (parent === null) {
    return getDefaultTargets();
  }

  const elementRect = element.getBoundingClientRect();
  const parentRect = parent.getBoundingClientRect();

  if (
    elementRect.width === 0 ||
    elementRect.height === 0 ||
    parentRect.width === 0 ||
    parentRect.height === 0
  ) {
    return getDefaultTargets();
  }

  const normalizedCurrentScale = normalizeCurrentScale(currentScale);

  return {
    targetOffsetX: 0,
    targetOffsetY: 0,
    targetScale: getScale(elementRect, parentRect, normalizedCurrentScale),
  };
}

function getScale(
  elementRect: DOMRect,
  parentRect: DOMRect,
  currentScale: number,
): number {
  const baseWidth = elementRect.width / currentScale;
  const baseHeight = elementRect.height / currentScale;
  const widthScale = parentRect.width / baseWidth;
  const heightScale = parentRect.height / baseHeight;
  const scale = Math.min(widthScale, heightScale);

  return Number.isFinite(scale) && scale > 0 ? scale : 1;
}

function normalizeCurrentScale(currentScale: number): number {
  return Number.isFinite(currentScale) && currentScale > 0 ? currentScale : 1;
}

function getDefaultTargets(): ScaleToFitTargets {
  return {
    targetOffsetX: 0,
    targetOffsetY: 0,
    targetScale: 1,
  };
}
