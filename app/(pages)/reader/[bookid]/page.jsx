'use client';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import EpubReader from '@/app/(componets)/epubreader';
import BookInfoCard from '@/app/(componets)/bookinfocard';
import { CircularProgress } from '@mui/material';

export default function BookReaderPage({ params }) {
    const [file, setFile] = useState();
    const [bookdata,setbookdata] = useState([]);
    const [error,setError] = useState();
    const [isLoading,setIsLoading] = useState(false);

    useEffect(()=>{
        if(!params) return;
            setIsLoading(true);
        const fetchBook = async () => {
            const bookid =await params.bookid;
            const response = await fetch(`/api/booksurl/`,{
                method:'POST',
                headers:{
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    bookid: bookid,
                })

            });
            const data = await response.json();
            if(data.error){
                setError(data.error)
                setIsLoading(false);
                return;
            }
            const book = await data.data[0];
            console.log("book data",book);
            const url = book.url_epub;
            console.log("epubfile url",url);
            setbookdata(book)
            setFile(url)
            setIsLoading(false);
        }
        fetchBook();


        },[params]);
        if(isLoading) return <div className='flex flex-col justify-center items-center w-full  h-screen'><CircularProgress color='inherit'/></div>


    return(
        <div className='flex flex-col  items-center justify-center h-full'>
            {(error && !isLoading) ? <div className='text-red-500'>{error}</div>: <h1 className='text-xl p-4 mb-4'>Enjoy reading!</h1> }
            {( file && !isLoading )&& <EpubReader file={file }/>}
            <div>
                { file &&<BookInfoCard title={bookdata.title} author={bookdata.author!="Unknown" && bookdata.author} description={bookdata.description} imageUrl={""}/>}
            </div>

        </div>

    )
}
