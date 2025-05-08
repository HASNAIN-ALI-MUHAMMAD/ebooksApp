'use client'
import PdfBookViewer from "@/app/(componets)/pdfViewer";
import { useEffect } from "react";
export default function PdfReader({params}) {
    useEffect(()=>{
        async function fetchUrl(){
            if(!params) return;
            const bookid = params.bookid;
            const res = await fetch(`/api/booksurl`,{
                method:'POST',
                headers:{
                    'Content-Type':'application/json'
                },
                body:JSON.stringify({
                    bookid
                }),
                cache:'force-cache'
            });
            const data = await res.json();
            console.log(data);
        }
        fetchUrl();
    },[params])
    return(
        <div>
            <PdfBookViewer fileUrl={`/Islam_and_Secularism.pdf`} />
        </div>
    )

}