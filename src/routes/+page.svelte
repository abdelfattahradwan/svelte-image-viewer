<script lang="ts">
  import "../app.css";
  import ImageViewer from "$lib/components/ImageViewer.svelte";
  import Viewer from "$lib/components/Viewer.svelte";
  import { scaleToFit } from "$lib/utilities/scale-to-fit.js";

  let imageViewer = $state<ImageViewer>();

  let imageViewerOffsetXTarget = $state(0);
  let imageViewerOffsetYTarget = $state(0);
  let imageViewerScaleTarget = $state(1.0);

  let viewer = $state<Viewer>();

  let viewerOffsetXTarget = $state(0);
  let viewerOffsetYTarget = $state(0);
  let viewerScaleTarget = $state(1.0);

  function fitImageViewer() {
    const imageViewerImage = imageViewer?.getImage();

    if (imageViewerImage === undefined) {
      return;
    }

    const { targetOffsetX, targetOffsetY, targetScale } = scaleToFit(
      imageViewerImage,
      imageViewerScaleTarget,
    );

    imageViewerOffsetXTarget = targetOffsetX;
    imageViewerOffsetYTarget = targetOffsetY;
    imageViewerScaleTarget = targetScale;
  }

  function fitViewer() {
    const viewerContent = viewer?.getContent();

    if (viewerContent === undefined) {
      return;
    }

    const { targetOffsetX, targetOffsetY, targetScale } = scaleToFit(
      viewerContent,
      viewerScaleTarget,
    );

    viewerOffsetXTarget = targetOffsetX;
    viewerOffsetYTarget = targetOffsetY;
    viewerScaleTarget = targetScale;
  }

  function resetImageViewer() {
    imageViewerOffsetXTarget = 0;
    imageViewerOffsetYTarget = 0;
    imageViewerScaleTarget = 1;
  }

  function resetViewer() {
    viewerOffsetXTarget = 0;
    viewerOffsetYTarget = 0;
    viewerScaleTarget = 1;
  }
</script>

<main>
  <h1>Welcome to Svelte Image Viewer!</h1>
  <p>
    This is a simple image viewer component that supports panning and zooming.
  </p>
  <p>
    Visit <a href="https://github.com/abdelfattahradwan/svelte-image-viewer"
      >the GitHub repository</a
    > to read the documentation
  </p>
  <h2>Image Viewer</h2>
  <div
    style="position: relative; height: 512px; user-select: none; border: 1px solid white;"
  >
    <ImageViewer
      bind:this={imageViewer}
      src="https://picsum.photos/256"
      bind:targetOffsetX={imageViewerOffsetXTarget}
      bind:targetOffsetY={imageViewerOffsetYTarget}
      bind:targetScale={imageViewerScaleTarget}
    />
    <div
      style="display: flex; flex-direction: column; gap: 1rem; position: absolute; top: 1rem; inset-inline-start: 1rem;"
    >
      <div>Target X = {imageViewerOffsetXTarget.toFixed(2)}</div>
      <div>Target Y = {imageViewerOffsetYTarget.toFixed(2)}</div>
      <div>Target Scale = {imageViewerScaleTarget.toFixed(2)}</div>
      <button
        type="button"
        onclick={fitImageViewer}
        style="padding: 0.5rem 1rem;"
      >
        Fit
      </button>
      <button
        type="button"
        onclick={resetImageViewer}
        style="padding: 0.5rem 1rem;"
      >
        Reset
      </button>
    </div>
  </div>
  <h2>Viewer</h2>
  <div
    style="position: relative; height: 512px; user-select: none; border: 1px solid white;"
  >
    <Viewer
      bind:this={viewer}
      bind:targetOffsetX={viewerOffsetXTarget}
      bind:targetOffsetY={viewerOffsetYTarget}
      bind:targetScale={viewerScaleTarget}
    >
      <img src="https://picsum.photos/256" alt="" />
    </Viewer>
    <div
      style="display: flex; flex-direction: column; gap: 1rem; position: absolute; top: 1rem; inset-inline-start: 1rem;"
    >
      <div>Target X = {viewerOffsetXTarget.toFixed(2)}</div>
      <div>Target Y = {viewerOffsetYTarget.toFixed(2)}</div>
      <div>Target Scale = {viewerScaleTarget.toFixed(2)}</div>
      <button type="button" onclick={fitViewer} style="padding: 0.5rem 1rem;">
        Fit
      </button>
      <button type="button" onclick={resetViewer} style="padding: 0.5rem 1rem;">
        Reset
      </button>
    </div>
  </div>
</main>
