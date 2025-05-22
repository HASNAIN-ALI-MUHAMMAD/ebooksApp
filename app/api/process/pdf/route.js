import * as pdfjsLib from 'pdfjs-dist/legacy/build/pdf.js';

// REMOVED: The explicit GlobalWorkerOptions.workerSrc setting for Node.js
// if (typeof window === 'undefined') {
// try {
// pdfjsLib.GlobalWorkerOptions.workerSrc = require.resolve('pdfjs-dist/legacy/build/pdf.worker.js');
// } catch (error) {
// console.error("Failed to resolve pdf.worker.js for pdfjs-dist. PDF processing may be impaired.", error);
// }
// }

export const runtime = 'nodejs';

export async function POST(request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file');
    
    if (!file) {
      return Response.json({ error: 'No file provided' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const loadingTask = pdfjsLib.getDocument({ data: bytes });
    const pdf = await loadingTask.promise;
    
    let fullText = '';
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const textContent = await page.getTextContent();
      fullText += textContent.items.filter(item => typeof item.str === 'string').map(item => item.str).join(' ') + '\n\n';
    }

    return Response.json({ 
      text: fullText.trim()
    });

  } catch (error) {
    console.error('PDF processing error in API route:', error);
    // Check if the error is the specific "endsWith" issue to provide a more targeted message if needed
    if (error.message && error.message.includes("e.endsWith is not a function")) {
        console.error("This might be an issue with PDF.js fake worker initialization in Node.js.");
    }
    return Response.json({ 
      error: 'Failed to process PDF.',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    }, { status: 500 });
  }
}