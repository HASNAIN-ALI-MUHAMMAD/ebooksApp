'use client'
import PdfBookViewer from "@/app/(componets)/pdfViewer";
export default function PdfReader({params}) {
    const bookid = params.bookid;
    return(
        <div>
            <PdfBookViewer fileUrl={`/gutenberg_books/pdfs/${bookid}.pdf`} />
        </div>
    )

}