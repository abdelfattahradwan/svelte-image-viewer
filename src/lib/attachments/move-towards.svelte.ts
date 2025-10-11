import { browser } from "$app/environment";

/**
 * Smoothly animates a value towards a target using requestAnimationFrame.
 *
 * @param initialValue - The initial value to start from
 * @param smoothing - How quickly to approach the target (0-1, lower = smoother/slower)
 * @param threshold - Stop animating when within this distance of target
 * @returns Object with current value state and update function
 */
export function moveTowards(
  initialValue: number = 0,
  smoothing: number = 0.125,
  threshold: number = 0.00125,
) {
  if (!browser) {
    return {
      get current() {
        return initialValue;
      },
      get target() {
        return initialValue;
      },
      set target(value: number) {
        void value;
      },
      destroy() {
        void 0;
      },
    };
  }

  let currentValue = $state(initialValue);
  let targetValue = $state(initialValue);
  let animationId: number | null = null;
  let lastTime = window.performance.now();

  const animate = (currentTime: number) => {
    const deltaTime = currentTime - lastTime;
    lastTime = currentTime;

    // Normalise delta time to 60 fps. This ensures consistent animation speed regardless of frame rate
    const normalisedDelta = deltaTime / (50 / 3);

    const difference = targetValue - currentValue;

    // Check if we're close enough to the target
    if (Math.abs(difference) < threshold) {
      currentValue = targetValue;
      animationId = null;
      return;
    }

    // Smooth interpolation with frame-rate independence
    const step = difference * smoothing * normalisedDelta;

    currentValue += step;

    animationId = window.requestAnimationFrame(animate);
  };

  const startAnimation = () => {
    if (animationId === null) {
      lastTime = window.performance.now();
      animationId = window.requestAnimationFrame(animate);
    }
  };

  const stopAnimation = () => {
    if (animationId !== null) {
      window.cancelAnimationFrame(animationId);
      animationId = null;
    }
  };

  return {
    get current() {
      return currentValue;
    },
    get target() {
      return targetValue;
    },
    set target(value: number) {
      void ((targetValue = value), startAnimation());
    },
    destroy: stopAnimation,
  };
}
