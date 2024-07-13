<script lang="ts">
  import panToMove from "$lib/utilities/gestures/pan-to-move.js";
  import mouseWheelZoom from "$lib/utilities/gestures/mouse-wheel-zoom.js";
  import pinchToZoom from "$lib/utilities/gestures/pinch-to-zoom.js";
  import { type TweenedOptions, type Tweened, tweened } from "svelte/motion";

  export let minScale: number = 0.5;
  export let maxScale: number = 2.0;
  export let scaleSmoothing: number = 250;

  export let offsetTweenOptions: TweenedOptions<number> = {
    duration: 125,
  };

  export let scaleTweenOptions: TweenedOptions<number> = {
    duration: 125,
  };

  export let targetOffsetX: number = 0;
  export let targetOffsetY: number = 0;
  export let targetScale: number = 1.0;

  const offsetX: Tweened<number> = tweened(0.0, offsetTweenOptions);
  const offsetY: Tweened<number> = tweened(0.0, offsetTweenOptions);
  const scale: Tweened<number> = tweened(1.0, scaleTweenOptions);

  $: {
    offsetX.set(targetOffsetX);
    offsetY.set(targetOffsetY);
    scale.set(targetScale);
  }

  function setTargetOffset(deltaX: number, deltaY: number) {
    targetOffsetX += deltaX;
    targetOffsetY += deltaY;
  }

  function setTargetScale(delta: number) {
    targetScale = Math.max(
      minScale,
      Math.min(maxScale, targetScale * (1.0 - delta / scaleSmoothing)),
    );
  }
</script>

<div
  style="display: flex; align-items: center; justify-content: center; position: absolute; top: 0; left: 0; right: 0; bottom: 0; overflow: hidden; touch-action: none;"
  use:panToMove={setTargetOffset}
  use:mouseWheelZoom={setTargetScale}
  use:pinchToZoom={setTargetScale}
>
  <div
    style="transform: translate({$offsetX}px, {$offsetY}px) scale({$scale}); will-change: transform; pointer-events: none;"
  >
    <slot />
  </div>
</div>
