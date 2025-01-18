<script>
  import "../app.css";
  import ImageViewer from "$lib/components/ImageViewer.svelte";
  import Viewer from "$lib/components/Viewer.svelte";

  let imageViewerOffsetXTarget = $state(0);
  let imageViewerOffsetYTarget = $state(0);
  let imageViewerScaleTarget = $state(1.0);

  let viewerOffsetXTarget = $state(0);
  let viewerOffsetYTarget = $state(0);
  let viewerScaleTarget = $state(1.0);

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
      src="https://picsum.photos/256"
      bind:targetOffsetX={imageViewerOffsetXTarget}
      bind:targetOffsetY={imageViewerOffsetYTarget}
      bind:targetScale={imageViewerScaleTarget}
    />
    <div
      style="display: flex; flex-direction: column; gap: 1rem; position: absolute; top: 1rem; inset-inline-start: 1rem;"
    >
      <div>Target X = {imageViewerOffsetXTarget}</div>
      <div>Target Y = {imageViewerOffsetYTarget}</div>
      <div>Target Scale = {imageViewerScaleTarget}</div>
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
      bind:targetOffsetX={viewerOffsetXTarget}
      bind:targetOffsetY={viewerOffsetYTarget}
      bind:targetScale={viewerScaleTarget}
    >
      <img src="https://picsum.photos/256" alt="" />
    </Viewer>
    <div
      style="display: flex; flex-direction: column; gap: 1rem; position: absolute; top: 1rem; inset-inline-start: 1rem;"
    >
      <div>Target X = {viewerOffsetXTarget}</div>
      <div>Target Y = {viewerOffsetYTarget}</div>
      <div>Target Scale = {viewerScaleTarget}</div>
      <button type="button" onclick={resetViewer} style="padding: 0.5rem 1rem;">
        Reset
      </button>
    </div>
  </div>
</main>
