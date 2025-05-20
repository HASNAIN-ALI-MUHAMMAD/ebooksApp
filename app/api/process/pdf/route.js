import * as pdfjs from 'pdfjs-dist/legacy/build/pdf';
import { promises as fs } from 'fs';
import path from 'path';

const workerPath = path.join(process.cwd(), 'node_modules', 'pdfjs-dist', 'build', 'pdf.worker.min.js');
pdfjs.GlobalWorkerOptions.workerSrc = workerPath;

export const runtime = 'nodejs';

export async function POST(request) {
  try {
    const formData = await request.formData();
    console.log(formData)
    const file = formData.get('file');
    
    
    if (!file) {
      return Response.json({ error: 'No file provided' }, { status: 400 });
    }
    const bytes = await file.arrayBuffer();
    const loadingTask = pdfjs.getDocument(bytes);
    const pdf = await loadingTask.promise;
    
    let fullText = '';
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const textContent = await page.getTextContent();
      fullText += textContent.items.map(item => item.str).join(' ') + '\n\n';
    }
    return Response.json({ 
      text: fullText
    });
  } catch (error) {
    console.error('PDF processing error:', error);
    return Response.json({ 
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    }, { status: 500 });
  }
}