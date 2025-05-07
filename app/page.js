'use client'
import Image from "next/image";
import BookCard from "./(componets)/bookcard";
import { useState,useEffect } from "react";
import Link from "next/link";
import { useDebounce } from "./(componets)/debounce";

export default function Home() {
  const [booksData,setBooksData] = useState([]);
  const [books,setBooks] = useState([]);
  const [search,setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 200);
  const [message,setMessage] = useState(null);
  const [isLoading,setIsLoading] = useState(true);
  
  useEffect(()=>{
    setIsLoading(true);
    async function getBooks() {
      const response = await fetch("http://localhost:3000/api/booksdata",{
        method:'GET',
        cache:'force-cache',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const data = await response.json();
      console.log(data)
      setBooksData(data.message);
      setBooks(data.message)
      setIsLoading(false)
    }
    getBooks();
},[])

  const handlechange = (e) => {
    setSearch(e.target.value);
  }

  useEffect(()=>{
    if(search.length == 0){
      setBooks(booksData);
      return;
    }
    if(debouncedSearch.length > 0){
      const filteredBooks = booksData.filter((book) => {
        return book.title.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
                book.author.toLowerCase().includes(debouncedSearch.toLowerCase())})
      setBooks(filteredBooks);
      if(books.length == 0 && debouncedSearch.length>0){
        return setMessage("No books found...");
      }
      setMessage(null);
    }

  },[debouncedSearch,booksData,search])
  return (
    <div className="flex flex-col flex-wrap flex-grow justify-center items-center min-h-screen py-2 ">
      <div className="flex flex-wrap float-left gap-2">
        <Link href="/admin/addbooks" className="text-xl text-white bg-gray-500 hover:bg-gray-700 rounded-lg px-4 py-2 m-2"> Add Books </Link>
      </div>
      <div className="flex flex-wrap float-left gap-2 ">
        <input type="text" placeholder="Search" className="w-60 lg:w-96 hover:bg-gray-200 focus:border-gray-500 focus:outline-none border-2 border-black p-2 rounded-lg" value={search} onChange={handlechange} />
      </div>
    <div className="flex flex-wrap py-3 px-3">
      {
        books.map((book,index) => {
          return (
          <BookCard key={book._id} author={book.author} title={book.title} url={book.link} url_pdf={book.url_pdf}>
          </BookCard>
        )})
      }
      {message&& <><p className="text-center text-3xl">{message}</p></>}
      {isLoading && <p className="text-center text-3xl">Loading...</p>}
    </div>
    </div>
  );
}
