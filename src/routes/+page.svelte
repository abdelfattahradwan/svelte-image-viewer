<script>
  import "../app.css";
  import ImageViewer from "$lib/components/ImageViewer.svelte";
  import Viewer from "$lib/components/Viewer.svelte";
  import { cubicOut } from "svelte/easing";
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
