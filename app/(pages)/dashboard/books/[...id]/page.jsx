'use client';
import React from 'react';
import { useState,useEffect } from 'react';

async function booksData(params) {
    const id = await params.id;
    const res = await fetch(`/api/booksurl`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({bookid:id}),
    });
    const data = await res.json();
    return data;
}

export default function Books({params}) {
    const [book, setBook] = useState([]);
    useEffect(() => {
        booksData(params).then((data) => {
            setBook(data);
        })
    },[params.id]);
    console.log(book);
    return(
        <div>Books</div>
    )
}