import '../../pdfConfig'

import {
  defaultLayoutPlugin,
} from '@react-pdf-viewer/default-layout';
import { ProgressBar } from '@react-pdf-viewer/core';
import { Viewer } from '@react-pdf-viewer/core';
import { Worker } from '@react-pdf-viewer/core';
import '@react-pdf-viewer/core/lib/styles/index.css';
import '@react-pdf-viewer/default-layout/lib/styles/index.css';

export default function PdfBookViewer({ fileUrl }) {
  const defaultLayoutPluginInstance = defaultLayoutPlugin();
  console.log({ Worker, Viewer, defaultLayoutPlugin });


  return (
    <div className="w-full h-screen p-4 bg-gray-100">
      <Worker workerUrl={`https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js`}>
        <Viewer
          fileUrl={fileUrl}
          style={{ width: '100%', height: '100%' }}
          defaultScale={1}
          enableSmoothScroll
        />
      </Worker>
    </div>
  );
}
