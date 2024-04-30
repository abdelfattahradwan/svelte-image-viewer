export default function mouseWheelZoom(element: HTMLElement, callback: (scale: number) => void) {
  const handleWheel = (event: WheelEvent) => {
    callback(event.deltaY);
  };

  element.addEventListener("wheel", handleWheel);
  
  return {
    destroy() {
      element.removeEventListener("wheel", handleWheel);
    },
  };
}
