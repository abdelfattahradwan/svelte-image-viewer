<script lang="ts">
  import { createPanAndZoom } from "$lib/attachments/create-pan-and-zoom.svelte.js";
  import { moveTowards } from "$lib/attachments/move-towards.svelte.js";

  let {
    src,
    alt,
    targetOffsetX = $bindable(0),
    targetOffsetY = $bindable(0),
    targetScale = $bindable(1.0),
    minScale = $bindable(0.5),
    maxScale = $bindable(3.0),
    smoothing = $bindable(0.25),
  }: {
    src: string;
    alt?: string;
    targetOffsetX?: number;
    targetOffsetY?: number;
    targetScale?: number;
    minScale?: number;
    maxScale?: number;
    smoothing?: number;
  } = $props();

  let container = $state<HTMLDivElement>();

  let image = $state<HTMLImageElement>();

  export function getContainer() {
    return container;
  }

  export function getImage() {
    return image;
  }

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
  bind:this={container}
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
  <img
    bind:this={image}
    {src}
    {alt}
    style="transform: translate({animatedOffsetX.current}px, {animatedOffsetY.current}px) scale({animatedScale.current}); will-change: transform; pointer-events: none;"
  />
</div>
