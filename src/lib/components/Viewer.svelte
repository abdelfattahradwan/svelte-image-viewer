<script lang="ts">
  import panAndZoom from "$lib/actions/pan-and-zoom.js";
  import { Tween } from "svelte/motion";
  import { cubicOut } from "svelte/easing";

  interface Props {
    targetOffsetX?: number;
    targetOffsetY?: number;
    targetScale?: number;
    minScale?: number;
    maxScale?: number;
    scaleSmoothing?: number;
    tweenOptions?: typeof Tween<number> extends new (
      ...args: infer Args
    ) => unknown
      ? Args[1]
      : never;
    children?: import("svelte").Snippet;
  }

  let {
    targetOffsetX = $bindable(0),
    targetOffsetY = $bindable(0),
    targetScale = $bindable(1.0),
    minScale = $bindable(0.5),
    maxScale = $bindable(3.0),
    scaleSmoothing = $bindable(500),
    tweenOptions = {
      duration: 300,
      easing: cubicOut,
    },
    children,
  }: Props = $props();

  const offsetX = new Tween(0, tweenOptions);
  const offsetY = new Tween(0, tweenOptions);
  const scale = new Tween(1, tweenOptions);

  $effect(() => {
    offsetX.target = targetOffsetX;
    offsetY.target = targetOffsetY;
  });

  $effect(() => {
    scale.target = targetScale;
  });
</script>

<div
  use:panAndZoom={{
    offsetX: {
      get: () => targetOffsetX,
      set: (value) => (targetOffsetX = value),
    },
    offsetY: {
      get: () => targetOffsetY,
      set: (value) => (targetOffsetY = value),
    },
    scale: {
      get: () => targetScale,
      set: (value) => (targetScale = value),
    },
    minScale,
    maxScale,
    scaleSmoothing,
  }}
  style="display: flex; position: absolute; align-items: center; justify-content: center; top: 0; left: 0; right: 0; bottom: 0; overflow: hidden; touch-action: none;"
>
  <div
    style="transform: translate({offsetX.current}px, {offsetY.current}px) scale({scale.current}); will-change: transform; pointer-events: none;"
  >
    {@render children?.()}
  </div>
</div>
