<script>
  import "../app.css";
  import ImageViewer from "$lib/components/ImageViewer.svelte";
  import Viewer from "$lib/components/Viewer.svelte";
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
  <div
    style="position: relative; height: 512px; user-select: none; border: 1px solid white;"
  >
    <ImageViewer src="https://picsum.photos/256" />
  </div>
  <div
    style="position: relative; height: 512px; user-select: none; border: 1px solid white;"
  >
    <Viewer>
      <img src="https://picsum.photos/256" alt="" />
    </Viewer>
  </div>
</main>
