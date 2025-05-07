'use client';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import EpubReader from '@/app/(componets)/epubreader';

export default function BookReaderPage({ params }) {
    const [file, setFile] = useState();



    useEffect(()=>{
        if(!params) return;
        const fetchBook = async () => {
            const bookid = params.bookid;
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
            const book = await data.data;
            const url = book.url_epub;
            console.log(book)
            console.log(url)
            setFile(url)


        }
        fetchBook();
      
        },[params]);


    return(
        <div className='flex flex-col items-center justify-center h-full'>
            <h1 className='text-2xl font-bold mb-4'>Book Reader</h1>
            {file && <EpubReader file={file}/>} 

        </div>
    )
}
