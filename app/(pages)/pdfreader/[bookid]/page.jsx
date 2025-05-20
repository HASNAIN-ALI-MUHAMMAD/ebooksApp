'use client'
import PdfBookViewer from "@/app/(components)/pdfViewer";
import { useEffect, useState } from "react";
import BookInfoCard from "@/app/(components)/bookinfocard";
import CircularProgress from "@mui/material/CircularProgress";
import { BookInfoCardSkeleton } from "@/app/(components)/bookinfocard";
import { PDFViewerCardSkeleton } from "@/app/(components)/pdfViewer";

export default function PdfReader({params}) {
    const [book,setBook] = useState([]);
    const [url,setUrl] = useState();
    const [isLoading,setIsLoading] = useState(true)
    useEffect(()=>{
        async function fetchUrl(){
            if(!params) return;
            setIsLoading(true);
            const bookid = params.bookid;
            const res = await fetch(`/api/booksurl`,{
                method:'POST',
                headers:{
                    'Content-Type':'application/json'
                },
                body:JSON.stringify({
                    bookid:bookid
                }),
            });
            const data = await res.json();
            setBook(data.data[0])
            setUrl(data.data[0].url_pdf)
        }
        fetchUrl();
        setIsLoading(false);    

    },[params])
    if(!url){
        return(
            <div className="flex flex-col justify-center items-center  w-full h-screen">
                 <CircularProgress color="inherit" size={50} />
            </div>
        )
    }

    return(
        <div>
            { isLoading ?
            <div className="flex flex-col justify-center items-center mt-10 w-full h-screen">
                 <CircularProgress color="inherit" size={70} />
            </div> :
            <PdfBookViewer fileUrl={book.url_pdf} fileId={book._id}/>
            }
            { isLoading ? 
            <BookInfoCardSkeleton author={book.author!="Unknown" && book?.author} title={book.title} description={book.description} imageUrl={""}/>:
            <BookInfoCard author={book.author!="Unknown" && book?.author} title={book.title} description={book.description} imageUrl={""}/>}           
        </div>
    )

}