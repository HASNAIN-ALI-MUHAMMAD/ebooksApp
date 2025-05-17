'use client'
import Image from "next/image";
import BookCard from "./(componets)/bookcard";
import { useState,useEffect } from "react";
import Link from "next/link";
import { useDebounce } from "./(componets)/debounce";
import clsx from "clsx";
import Layout from "./(componets)/topbar";
import { AArrowUp } from "lucide-react";
import { AArrowDown } from "lucide-react";

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
  const [error,setError]  =useState(null);

  useEffect(()=>{
    const total = Math.ceil(books.length)/50;
    const arr = [];

    for(let i=1;i<=total+1;i++){
      arr.push(i);
    }    
    setpages(arr)

  },[books,currentPage])
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
        next:{
          revalidate:60*10
        },
        headers: {
          'Content-Type': 'application/json',
        }
        
      });
      if(!response.ok) return setError("Error while fetching book data.")
      const data = await response.json();
      console.log(data)
      if(data.error) return setError(data.message);
      if (!Array.isArray(data.message)) {
        setError("Invalid book data format.");
        return;
      }
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
      return
    }

  },[debouncedSearch,booksData,search,books.length])

  useEffect(()=>{
    if(!books) return;
    function filterPages(){
      const filteredBooks = books.filter((book,index)=>{
        return index >= startIndex && index < endIndex && book.title !== "Error"
      })
      setPagesBooks(filteredBooks);
    }
    filterPages()
  },[books,startIndex,endIndex]);


  useEffect(()=>{
    if(pages.includes(currentPage)) return;
    setCurrentPage(1);
    setStartIndex(0);
    setEndIndex(50);
  },[currentPage,debouncedSearch,pages])
  if(error){
    return(
      <div className="flex felx-col justify-center items-center min-h-screen py-2 text-center">
        <p className="text-red-500 text-3xl">{error}</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col flex-wrap flex-grow justify-center items-center min-h-screen " id="topofthepage">
      <div className="w-full">
        <Layout/>
      </div>
      <div className="flex flex-col justify-center items-center gap-2 mt-16">
        <input type="text" placeholder="Search books..." className="w-60 lg:w-96 hover:bg-gray-200 hover:transition transition focus:border-gray-500 focus:outline-none border-2 border-black p-2 rounded-lg" value={search} onChange={handlechange} />
      {books.length>50 && <Link href={'#bottomofthepage'} className="w-max text-center p-1 rounded-lg bg-gray-300 hover:bg-gray-100"><AArrowDown/></Link>}
        {(books && !isLoading) && <p>{books.length} books found!</p>}


      </div>
    <div className="flex flex-wrap py-3 px-3">
      {
        pagesBooks.map((book,index) => {
          return (
          <BookCard key={book._id} author={book.author} title={book.title} link_epub={book.link_epub} link_pdf={book.link_pdf}>
          </BookCard>
        )})
      }
      {message&& <><p className="text-center text-3xl">{message}</p></>}
      {isLoading && <p className="text-center text-3xl">Loading...</p>}
    </div>
      <div id="bottomofthepage">
        {
          books.length<=50? null:pages.map(page=>{
            return <button key={page} className={clsx(
              "w-10 py-3 bg-gray-300 hover:bg-gray-100",
              currentPage==page && "bg-gray-500"
            )} onClick={handlePageChange} value={page}>{page}</button>
        })}
        

      </div>

        { books.length>50 &&<Link href={'#topofthepage'} className="w-max text-center p-1 rounded-lg bg-gray-300 hover:bg-gray-100 m-2"><AArrowUp/></Link>}
    </div>

  );
}
