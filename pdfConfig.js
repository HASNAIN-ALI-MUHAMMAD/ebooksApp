import pdfjs from 'pdfjs-dist';// Set the worker to use for PDF.js
pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@3.4.120/build/pdf.worker.min.js`;

// Avoid node-specific canvas dependency
if (typeof window !== 'undefined') {
  pdfjs.ImageLayerFactory = function () {
    return {
      render() {
        // No-op since we don't need image layers for simple rendering
      },
    };
  };
}
