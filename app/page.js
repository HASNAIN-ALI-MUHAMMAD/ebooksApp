'use client'
import Image from "next/image";
import BookCard from "./(componets)/bookcard";
import { useState,useEffect } from "react";
import { booksData } from "@/public/gutenberg_books/books";
import Link from "next/link";
import { useDebounce } from "./(componets)/debounce";

export default function Home() {
  const [books,setBooks] = useState([]);
  const [search,setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 200);
  const [message,setMessage] = useState(null);
  const handlechange = (e) => {
    setSearch(e.target.value);
  }
  useEffect(() => {
    setBooks(booksData);
  }, [books]);
  useEffect(()=>{
    if(debouncedSearch.length > 0){
      const filteredBooks = booksData.filter((book) => {
        return book.title.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
                book.author.toLowerCase().includes(debouncedSearch.toLowerCase())})
      setBooks(filteredBooks);
      if(books.length == 0 && debouncedSearch.length>0){
        return setMessage("No books found...")
      }
      setMessage(null)
    }
  },[debouncedSearch])
  return (
    <div className="flex flex-col flex-wrap flex-grow justify-center items-center min-h-screen py-2 sm:shrink-4">
      <div className="flex flex-wrap float-left gap-2">
        <Link href="/admin/addbooks" className="text-xl text-white bg-gray-500 hover:bg-gray-700 rounded-lg px-4 py-2 m-2"> Add Books </Link>
      </div>
      <div className="flex flex-wrap float-left gap-2 ">
        <input type="text" placeholder="Search" className="w-96 sm:w-60 border-2 border-black p-2 rounded-lg" value={search} onChange={handlechange} />
      </div>
    <div className="flex flex-wrap py-3 px-3">
      {
        books.map((book,index) => {
          return (
          <BookCard key={book.id} author={book.author} title={book.title} url_pdf={book.url_pdf || ""} url={book.link || ""}>
          </BookCard>
        )})
      }
      {message&& <><p className="text-center text-3xl">{message}</p></>}
    </div>
    </div>
  );
}
