# svelte-image-viewer

A couple of simple components for displaying content with pan and zoom capabilities.

## Features

- Pan and zoom capabilities
- Works with any HTML element
- Supports mouse and touchscreen interactions

## Demo

### Desktop

https://github.com/user-attachments/assets/8f41776c-b718-4fd2-8afe-942e54db5d62

### Mobile

https://github.com/user-attachments/assets/43e45ee0-a282-4204-a08b-088e40edcd96

## Installation

### npm

```bash
npm install svelte-image-viewer
```

### pnpm

```bash
pnpm add svelte-image-viewer
```

### bun

```bash
bun add svelte-image-viewer
```

## Getting Started

### `ImageViewer` component

The `ImageViewer` component is a simple image viewer that displays an image with pan and zoom capabilities.

```svelte
<script>
  import { ImageViewer } from "svelte-image-viewer";
</script>

<div
  style="position: relative; height: 512px; user-select: none;border: 1px solid white;"
>
  <ImageViewer src="https://source.unsplash.com/random/768x512" />
</div>
```

### `Viewer` component

The `Viewer` component displays its children inside a container with pan and zoom capabilities.

```svelte
<script>
  import { Viewer } from "svelte-image-viewer";
</script>

<div
  style="position: relative; height: 512px; user-select: none; border: 1px solid white;"
>
  <Viewer>
    <p>This is a paragraph inside the viewer</p>
  </Viewer>
</div>
```

## Support

If you find this project useful, consider supporting it by buying me a coffee:

[![ko-fi](https://ko-fi.com/img/githubbutton_sm.svg)](https://ko-fi.com/Q5Q361YW5)

Your support is appreciated. Thank you!
