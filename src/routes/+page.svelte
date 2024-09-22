<script>
  import "../app.css";
  import ImageViewer from "$lib/components/ImageViewer.svelte";
  import Viewer from "$lib/components/Viewer.svelte";
  import { cubicOut } from "svelte/easing";
  import ExperimentalImageViewer from "$lib/components/experimental/ImageViewer.svelte";
  import ExperimentalViewer from "$lib/components/experimental/Viewer.svelte";
</script>

<h1>Welcome to Svelte Image Viewer!</h1>
<p>
  This is a simple image viewer component that supports panning and zooming.
</p>
<p>
  Visit <a href="https://github.com/abdelfattahradwan/svelte-image-viewer"
    >the GitHub repository</a
  > to read the documentation
</p>

<div
  id="image-viewer-container"
  style="position: relative; height: 512px; user-select: none; border: 1px solid white;"
>
  <ExperimentalImageViewer
    src="https://picsum.photos/256"
    minScale={0.5}
    maxScale={10.0}
  />
</div>

<div
  id="viewer-1-container"
  style="position: relative; height: 512px; user-select: none; border: 1px solid white;"
>
  <ExperimentalViewer >
    <form>
      <label for="scale">Scale</label>
      <input type="range" id="scale" min="0.5" max="10" step="0.1" />
      <label for="offsetX">Offset X</label>
      <input type="range" id="offsetX" min="0" max="100" step="1" />
      <label for="offsetY">Offset Y</label>
      <input type="range" id="offsetY" min="0" max="100" step="1" />
    </form>
  </ExperimentalViewer>
</div>

<div
  id="image-viewer-container"
  style="position: relative; height: 512px; user-select: none; border: 1px solid white;"
>
  <ImageViewer src="https://picsum.photos/256" />
</div>

<div
  id="viewer-1-container"
  style="position: relative; height: 512px; user-select: none; border: 1px solid white;"
>
  <Viewer
    offsetTweenOptions={{
      duration: 250,
      easing: cubicOut,
    }}
    scaleTweenOptions={{
      duration: 250,
      easing: cubicOut,
    }}
  >
    <img src="https://picsum.photos/256" alt="" />
  </Viewer>
</div>
