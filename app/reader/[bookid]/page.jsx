'use client';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import EpubReader from '@/app/(componets)/epubreader';

export default function BookReaderPage({ params }) {
    const bookid = params.bookid;
    const [file, setFile] = useState();



    useEffect(()=>{
        if(!bookid) return;
            const githubFileUrl = `https://hasnain-ali-muhammad.github.io/ebooks/epubs/${bookid}.epub`;
            setFile(githubFileUrl); 
      
        },[bookid]);


    return(
        <div className='flex flex-col items-center justify-center h-full'>
            <h1 className='text-2xl font-bold mb-4'>Book Reader</h1>
            {file && <EpubReader file={file}/>} 

        </div>
    )
}
