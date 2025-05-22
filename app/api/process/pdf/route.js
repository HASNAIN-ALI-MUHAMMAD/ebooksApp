import * as pdfjsLib from 'pdfjs-dist';

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
    if (error.message && error.message.includes("Cannot find module './pdf.worker.js'")) {
        console.error("This indicates an issue with pdfjs-dist's internal worker loading in Node.js. Ensure you're using the main 'pdfjs-dist' import.");
    }
    return Response.json({ 
      error: 'Failed to process PDF.',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    }, { status: 500 });
  }
}