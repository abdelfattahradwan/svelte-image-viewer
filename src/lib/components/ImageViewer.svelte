<script lang="ts">
  import panToMove from "$lib/utilities/gestures/pan-to-move.js";
  import mouseWheelZoom from "$lib/utilities/gestures/mouse-wheel-zoom.js";
  import pinchToZoom from "$lib/utilities/gestures/pinch-to-zoom.js";
  import { type Tweened, tweened } from "svelte/motion";

  export let src: string;
  export let minZoom: number = 0.5;
  export let maxZoom: number = 2.0;

  let targetOffsetX: number = 0;
  let targetOffsetY: number = 0;
  let targetZoom: number = 1.0;

  const offsetX: Tweened<number> = tweened(0.0, {
    duration: 125,
  });

  const offsetY: Tweened<number> = tweened(0.0, {
    duration: 125,
  });

  const zoom: Tweened<number> = tweened(1.0, {
    duration: 125,
  });

  $: {
    offsetX.set(targetOffsetX);
    offsetY.set(targetOffsetY);
    zoom.set(targetZoom);
  }

  function setTargetZoom(delta: number) {
    targetZoom = Math.max(
      minZoom,
      Math.min(maxZoom, targetZoom * (1.0 - delta / 250.0))
    );
  }
</script>

<div class="image-viewer">
  <div
    use:panToMove={(deltaX, deltaY) => {
      targetOffsetX += deltaX;
      targetOffsetY += deltaY;
    }}
    use:mouseWheelZoom={setTargetZoom}
    use:pinchToZoom={setTargetZoom}
    class="image-viewer-viewport"
  >
    <img
      {src}
      alt=""
      style="transform: translate({$offsetX}px, {$offsetY}px) scale({$zoom})"
      class="image-viewer-image"
    />
  </div>
</div>

<style>
  .image-viewer {
    position: absolute;
    inset: 0;
  }

  .image-viewer-viewport {
    position: absolute;
    inset: 0;
    overflow: hidden;
  }

  .image-viewer-image {
    display: block;
    pointer-events: none;
  }
</style>
