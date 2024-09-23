<script lang="ts">
  import panAndZoom from "$lib/actions/pan-and-zoom.js";
  import { type TweenedOptions, tweened } from "svelte/motion";
  import { cubicOut } from "svelte/easing";

  export let src: string;
  export let targetOffsetX: number = 0;
  export let targetOffsetY: number = 0;
  export let targetScale: number = 1.0;
  export let minScale: number = 0.5;
  export let maxScale: number = 3.0;
  export let scaleSmoothing: number = 500;

  export let tweenOptions: TweenedOptions<number> = {
    duration: 300,
    easing: cubicOut,
  };

  /**
   * @deprecated use `tweenOptions` instead
   */
  export let offsetTweenOptions: TweenedOptions<number> = {};

  /**
   * @deprecated use `tweenOptions` instead
   */
  export let scaleTweenOptions: TweenedOptions<number> = {};

  const offsetX = tweened(0.0, tweenOptions);
  const offsetY = tweened(0.0, tweenOptions);
  const scale = tweened(1.0, tweenOptions);

  $: {
    offsetX.set(targetOffsetX);
    offsetY.set(targetOffsetY);
  }

  $: scale.set(targetScale);
</script>

<div
  use:panAndZoom={{
    offsetX,
    offsetY,
    scale,
    minScale,
    maxScale,
    scaleSmoothing,
  }}
  style="display: flex; position: absolute; align-items: center; justify-content: center; top: 0; left: 0; right: 0; bottom: 0; overflow: hidden; touch-action: none;"
>
  <img
    {src}
    alt=""
    style="transform: translate({$offsetX}px, {$offsetY}px) scale({$scale}); will-change: transform; pointer-events: none;"
  />
</div>
