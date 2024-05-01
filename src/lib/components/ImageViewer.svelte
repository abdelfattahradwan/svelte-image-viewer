<script lang="ts">
  import panToMove from "$lib/utilities/gestures/pan-to-move.js";
  import mouseWheelZoom from "$lib/utilities/gestures/mouse-wheel-zoom.js";
  import pinchToZoom from "$lib/utilities/gestures/pinch-to-zoom.js";
  import { type TweenedOptions, type Tweened, tweened } from "svelte/motion";

  export let src: string;

  export let panningOptions: TweenedOptions<number> = {
    duration: 125,
  };

  export let zoomingOptions: {
    minZoom: number;
    maxZoom: number;
    smoothing: number;
  } & TweenedOptions<number> = {
    minZoom: 0.5,
    maxZoom: 2.0,
    smoothing: 256,
    duration: 125,
  };

  export let targetOffsetX: number = 0;
  export let targetOffsetY: number = 0;
  export let targetZoom: number = 1.0;

  const offsetX: Tweened<number> = tweened(0.0, panningOptions);
  const offsetY: Tweened<number> = tweened(0.0, panningOptions);
  const zoom: Tweened<number> = tweened(1.0, zoomingOptions);

  $: {
    offsetX.set(targetOffsetX);
    offsetY.set(targetOffsetY);
    zoom.set(targetZoom);
  }

  function setTargetOffset(deltaX: number, deltaY: number) {
    targetOffsetX += deltaX;
    targetOffsetY += deltaY;
  }

  function setTargetZoom(delta: number) {
    targetZoom = Math.max(
      zoomingOptions.minZoom,
      Math.min(
        zoomingOptions.maxZoom,
        targetZoom * (1.0 - delta / zoomingOptions.smoothing)
      )
    );
  }
</script>

<div
  style="display: flex; align-items: center; justify-content: center; position: absolute; top: 0; left: 0; right: 0; bottom: 0; overflow: hidden;"
  use:panToMove={setTargetOffset}
  use:mouseWheelZoom={setTargetZoom}
  use:pinchToZoom={setTargetZoom}
>
  <img
    {src}
    alt=""
    style="display: block; pointer-events: none; transform: translate({$offsetX}px, {$offsetY}px) scale({$zoom})"
  />
</div>
