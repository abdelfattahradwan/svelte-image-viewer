<script lang="ts">
  import type { Snippet } from "svelte";
  import { createPanAndZoom } from "$lib/attachments/create-pan-and-zoom.svelte.js";
  import { moveTowards } from "$lib/attachments/move-towards.svelte.js";

  let {
    targetOffsetX = $bindable(0),
    targetOffsetY = $bindable(0),
    targetScale = $bindable(1.0),
    minScale = $bindable(0.5),
    maxScale = $bindable(3.0),
    smoothing = $bindable(0.25),
    children,
  }: {
    targetOffsetX?: number;
    targetOffsetY?: number;
    targetScale?: number;
    minScale?: number;
    maxScale?: number;
    smoothing?: number;
    children?: Snippet;
  } = $props();

  const animatedOffsetX = moveTowards(0, smoothing);
  const animatedOffsetY = moveTowards(0, smoothing);
  const animatedScale = moveTowards(1.0, smoothing);

  $effect(() => void (animatedOffsetX.target = targetOffsetX));
  $effect(() => void (animatedOffsetY.target = targetOffsetY));
  $effect(() => void (animatedScale.target = targetScale));

  $effect(() => {
    return () => {
      animatedOffsetX.destroy();
      animatedOffsetY.destroy();
      animatedScale.destroy();
    };
  });
</script>

<div
  {@attach createPanAndZoom({
    get offsetX() {
      return targetOffsetX;
    },
    set offsetX(value: number) {
      targetOffsetX = value;
    },
    get offsetY() {
      return targetOffsetY;
    },
    set offsetY(value: number) {
      targetOffsetY = value;
    },
    get scale() {
      return targetScale;
    },
    set scale(value: number) {
      targetScale = value;
    },
    minScale,
    maxScale,
  })}
  style="display: flex; position: absolute; align-items: center; justify-content: center; top: 0; left: 0; right: 0; bottom: 0; overflow: hidden; touch-action: none;"
>
  <div
    style="transform: translate({animatedOffsetX.current}px, {animatedOffsetY.current}px) scale({animatedScale.current}); will-change: transform; pointer-events: none;"
  >
    {@render children?.()}
  </div>
</div>
