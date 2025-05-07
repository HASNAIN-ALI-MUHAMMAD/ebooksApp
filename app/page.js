'use client'
import Image from "next/image";
import BookCard from "./(componets)/bookcard";
import { useState,useEffect } from "react";
import Link from "next/link";
import { useDebounce } from "./(componets)/debounce";
import clsx from "clsx";

export default function Home() {
  const [booksData,setBooksData] = useState([]);
  const [books,setBooks] = useState([]);
  const [search,setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 200);
  const [message,setMessage] = useState(null);
  const [isLoading,setIsLoading] = useState(true);
  const [pageNumber,setPageNumber] = useState(0);
  const [pagesBooks,setPagesBooks] = useState([]);
  const [pages,setpages] = useState([]);
  const [currentPage,setCurrentPage] = useState(1);
  const [startIndex,setStartIndex] = useState(0);
  const [endIndex,setEndIndex] = useState(50);


  
  
  useEffect(()=>{
    const total = (books.length)/50;
    const arr = [];
    for(let i=1;i<=total+1;i++){
      arr.push(i);
    }
    setpages(arr)
  },[books])
  console.log(pages)
  const handlePageChange = (e)=>{
    const newPage =parseInt(e.target.value)
    setCurrentPage(newPage)
    setStartIndex(((newPage-1)*50));
    return setEndIndex((newPage*50))

  }


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
      setPagesBooks(filteredBooks);
      if(books.length == 0 && debouncedSearch.length>0){
        return setMessage("No books found...");
      }
      setMessage(null);
    }

  },[debouncedSearch,booksData,search])

  useEffect(()=>{
    function filterPages(){
      const filteredBooks = books.filter((book,index)=>{
        return index >= startIndex && index < endIndex;
      })
      setPagesBooks(filteredBooks);

    }
    filterPages()
  },[books,startIndex,endIndex])
  
  return (
    <div className="flex flex-col flex-wrap flex-grow justify-center items-center min-h-screen py-2 ">
      <p>{pagesBooks.length}</p>
      <div className="flex flex-wrap float-left gap-2">
        <Link href="/admin/addbooks" className="text-xl text-white bg-gray-500 hover:bg-gray-700 rounded-lg px-4 py-2 m-2"> Add Books </Link>
      </div>
      <div className="flex flex-wrap float-left gap-2 ">
        <input type="text" placeholder="Search" className="w-60 lg:w-96 hover:bg-gray-200 focus:border-gray-500 focus:outline-none border-2 border-black p-2 rounded-lg" value={search} onChange={handlechange} />
      </div>
    <div className="flex flex-wrap py-3 px-3">
      {
        pagesBooks.map((book,index) => {
          return (
          <BookCard key={book._id} author={book.author} title={book.title} url={book.link} url_pdf={book.url_pdf}>
          </BookCard>
        )})
      }
      {message&& <><p className="text-center text-3xl">{message}</p></>}
      {isLoading && <p className="text-center text-3xl">Loading...</p>}
    </div>
      <div>
        {
          books.length<=50? null:pages.map(page=>{
            return <button className={clsx(
              "w-10 py-3 bg-gray-300 hover:bg-gray-100",
              currentPage==page && "bg-red-500"
            )} onClick={handlePageChange} value={page}>{page}</button>
        })}
        

      </div>
    </div>

  );
}
