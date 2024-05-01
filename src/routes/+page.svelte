<script>
  import "../app.css";
  import ImageViewer from "$lib/components/ImageViewer.svelte";
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
  style="position: relative; height: 512px; user-select: none;"
>
  <ImageViewer src="https://source.unsplash.com/random/800x600" />
</div>
