<script lang="ts">
  import panAndZoom from "$lib/utilities/gestures/pan-and-zoom.js";
  import { tweened } from "svelte/motion";
  import { cubicOut } from "svelte/easing";
  import { onMount } from "svelte";

  let container: HTMLElement;
  let content: HTMLElement;

  export let src: string;
  export let minScale: number = 0.5;
  export let maxScale: number = 3.0;

  const offsetTweenOptions = {
    duration: 300,
    easing: cubicOut,
  };

  const scaleTweenOptions = {
    duration: 300,
    easing: cubicOut,
  };

  const offsetX = tweened(0, offsetTweenOptions);
  const offsetY = tweened(0, offsetTweenOptions);
  const scale = tweened(1, scaleTweenOptions);

  onMount(() => {
    const resizeObserver = new ResizeObserver(() => {
      const containerRect = container.getBoundingClientRect();
      const contentRect = content.getBoundingClientRect();

      offsetX.set((containerRect.width - contentRect.width) * 0.5, {
        duration: 0,
      });
      offsetY.set((containerRect.height - contentRect.height) * 0.5, {
        duration: 0,
      });
    });

    resizeObserver.observe(content);

    const destroyPanAndZoom = panAndZoom({
      container,
      content,
      offsetX,
      offsetY,
      scale,
      minScale,
      maxScale,
    });

    return () => {
      resizeObserver.disconnect();
      destroyPanAndZoom();
    };
  });
</script>

<div
  bind:this={container}
  style="position: relative; overflow: hidden; touch-action: none; user-select: none; width: 100%; height: 100%;"
>
  <img
    bind:this={content}
    {src}
    alt=""
    style="transform: translate({$offsetX}px, {$offsetY}px) scale({$scale}); transform-origin: top left; will-change: transform; user-select: none; pointer-events: none;"
  />
</div>
