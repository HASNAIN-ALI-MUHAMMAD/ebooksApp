'use client'
import PdfBookViewer from "@/app/(componets)/pdfViewer";
import { useEffect, useState } from "react";
import BookInfoCard from "@/app/(componets)/bookinfocard";

export default function PdfReader({params}) {
    const [book,setBook] = useState([]);
    const [url,setUrl] = useState("https://xbbvmxhdycfieaodzwlr.supabase.co/storage/v1/object/public/ebooks/1.pdf")
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
            });
            const data = await res.json();
            setBook(data.data)
            console.log(data);
        }
        fetchUrl();
    },[params])
    return(
        <div>
            <PdfBookViewer fileUrl={url} />
            <BookInfoCard author={book.author!="Unknown" && book.author} title={book.title} description={book.description} imageUrl={""}/>           
        </div>
    )

}