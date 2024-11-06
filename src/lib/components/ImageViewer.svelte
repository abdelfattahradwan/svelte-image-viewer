<script lang="ts">
  import panAndZoom from "$lib/actions/pan-and-zoom.js";
  import { type TweenedOptions, tweened } from "svelte/motion";
  import { cubicOut } from "svelte/easing";

  interface Props {
    src: string;
    targetOffsetX?: number;
    targetOffsetY?: number;
    targetScale?: number;
    minScale?: number;
    maxScale?: number;
    scaleSmoothing?: number;
    tweenOptions?: TweenedOptions<number>;
    /**
     * @deprecated use `tweenOptions` instead
     */
    offsetTweenOptions?: TweenedOptions<number>;
    /**
     * @deprecated use `tweenOptions` instead
     */
    scaleTweenOptions?: TweenedOptions<number>;
  }

  let {
    src,
    targetOffsetX = 0,
    targetOffsetY = 0,
    targetScale = 1.0,
    minScale = 0.5,
    maxScale = 3.0,
    scaleSmoothing = 500,
    tweenOptions = {
      duration: 300,
      easing: cubicOut,
    },
    offsetTweenOptions = {},
    scaleTweenOptions = {},
  }: Props = $props();

  const offsetX = tweened(0.0, tweenOptions);
  const offsetY = tweened(0.0, tweenOptions);
  const scale = tweened(1.0, tweenOptions);

  $effect(() => {
    offsetX.set(targetOffsetX);
    offsetY.set(targetOffsetY);
  });

  $effect(() => {
    scale.set(targetScale);
  });
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
