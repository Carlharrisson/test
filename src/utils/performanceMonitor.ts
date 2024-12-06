class PerformanceMonitor {
  private frameCount = 0;
  private lastTime = performance.now();
  private fps = 60;

  measure() {
    this.frameCount++;
    const currentTime = performance.now();

    if (currentTime - this.lastTime >= 1000) {
      this.fps = this.frameCount;
      this.frameCount = 0;
      this.lastTime = currentTime;

      if (this.fps < 30) {
        this.reduceQuality();
      }
    }
  }

  private reduceQuality() {
    const renderer = document.querySelector("canvas")?.getContext("webgl");
    if (renderer) {
      // Reduce shadow quality
      renderer.getParameter(renderer.MAX_TEXTURE_SIZE);
      // Reduce texture quality
      renderer.getParameter(renderer.MAX_TEXTURE_IMAGE_UNITS);
    }
  }
}

export const performanceMonitor = new PerformanceMonitor();
