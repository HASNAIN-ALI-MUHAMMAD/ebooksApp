'use client'
import BookCard, { BookCardSkeleton } from "./(components)/bookcard";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useDebounce } from "./(components)/debounce";
import clsx from "clsx";
import Layout from "./(components)/topbar";
import { AArrowUp, AArrowDown } from "lucide-react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  const [booksData, setBooksData] = useState([]);
  const [books, setBooks] = useState([]);
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 300);
  const [message, setMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [pagesBooks, setPagesBooks] = useState([]);
  const [pages, setPages] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [startIndex, setStartIndex] = useState(0);
  const [endIndex, setEndIndex] = useState(50);
  const [error, setError] = useState(null);
  const [booksViewStatus, setBooksViewStatus] = useState('public');
  const [fetchBooksUrl, setFetchBooksUrl] = useState('/api/booksdata');
  const [user, setUser] = useState(null);


  // fetching user data
  useEffect(() => {
    async function fetchUserData() {
      try {
        const res = await fetch('/api/userdata', {
          method: 'GET',
          credentials: 'include'
        });
        const data = await res.json();
        if (!res.ok || data.error) {
          setUser(null);
          return;
        }
        if (data?.user) {
          setUser(data.user);
        } else {
          setUser(null);
        }
      } catch (err) {
        console.error("Exception fetching user data:", err);
        setUser(null);
      }
    }
    fetchUserData();
  }, [booksViewStatus,fetchBooksUrl]);

  // setting books for each page
  useEffect(() => {
    const total = Math.ceil(books.length / 50);
    const arr = [];
    if (books.length > 0) {
      for (let i = 1; i <= Math.max(1, total); i++) {
        arr.push(i);
      }
    }
    setPages(arr);
  }, [books]);

  // handling page change function

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    setStartIndex((newPage - 1) * 50);
    setEndIndex(newPage * 50);
  };

  // main books fetching function

  useEffect(() => {
    setIsLoading(true);
    setError(null); 
    setMessage(null);

    async function getBooks() {
      const isPrivateFetch = fetchBooksUrl.includes('/private');

      if (isPrivateFetch && !user?.id) {
        setMessage("Please log in to view private books.");
        setBooks([]);
        setBooksData([]);
        setIsLoading(false);
        return;
      }

      const requestOptions = {
        method: 'POST', 
        next: { revalidate: 60 * 10 },
        headers: { 'Content-Type': 'application/json' },
      };

      const bodyPayload = {};
      if (user?.id) { 
        bodyPayload.userId = user.id;
      }
      
      if (Object.keys(bodyPayload).length > 0 || fetchBooksUrl.includes('/private')) {
          requestOptions.body = JSON.stringify(bodyPayload);
      } else if (fetchBooksUrl === '/api/booksdata') {
          requestOptions.method = 'POST';
          delete requestOptions.body;
      }


      try {
        const response = await fetch(fetchBooksUrl, requestOptions);
        const data = await response.json();

        if (!response.ok) {
          setError(data.message || data.error || `Error: ${response.statusText}`);
          setIsLoading(false);
          return;
        }
        
        if (data.error) {
          setError(data.error || "Failed to parse book data.");
          setBooks([]);
          setBooksData([]);
          setIsLoading(false);
          return;
        }
        if (!Array.isArray(data.message)) {
          setError("Invalid book data format: Expected an array.");
          setBooks([]);
          setBooksData([]);
          setIsLoading(false);
          return;
        }
        setBooksData(data.message);
        setBooks(data.message);
      } catch (e) {
        setError("A network error occurred, or the server is unreachable.");
        console.error("Fetch error:", e);
      } finally {
        setIsLoading(false);
      }
    }
    getBooks();
  }, [fetchBooksUrl, user?.id,booksViewStatus]);

  // handling search
  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    setCurrentPage(1);
    setStartIndex(0);
    setEndIndex(50);
  };


  // the books filter based on search
  useEffect(() => {
    setMessage(null);
    if (!booksData) return;

    let currentBooks = [...booksData]; 

    if (debouncedSearch.length > 0) {
      currentBooks = booksData.filter((book) =>
        book.title.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        (book.author && book.author.toLowerCase().includes(debouncedSearch.toLowerCase()))
      );
      if (currentBooks.length === 0) {
        setMessage("No books found matching your search.");
      }
    }
    setBooks(currentBooks);

  }, [debouncedSearch, booksData]);

  //removing books with no titles
  useEffect(() => {
    if (!books) return;
    const currentPagedBooks = books.slice(startIndex, endIndex).filter(book => book.title !== "Error");
    setPagesBooks(currentPagedBooks);
  }, [books, startIndex, endIndex]);

  //setting first page and books per page

  useEffect(() => {
    if (pages.length > 0 && !pages.includes(currentPage)) {
        setCurrentPage(1);
        setStartIndex(0);
        setEndIndex(50);
    } else if (pages.length === 0 && books.length > 0) {
        setCurrentPage(1);
        setStartIndex(0);
        setEndIndex(50);
    }
  }, [currentPage, pages, books.length]);

  
  // handling private and public books change
  const handlePublicBooksClick = () => {
    setBooksViewStatus("public");
    setFetchBooksUrl('/api/booksdata');
    setCurrentPage(1);
    setSearch("");
  };
// private
  const handlePrivateBooksClick = () => {
    if (!user?.id) {
      setMessage("Please log in to view private books");
      router.push('/login');
      return
        }
    setBooksViewStatus("private");
    setFetchBooksUrl('/api/booksdata/private');
    setCurrentPage(1);
    setSearch("");
  };


  if (error && !isLoading) { 
    return (
      <div className="flex flex-col min-h-screen">
        <Layout />
        <main className="flex flex-col flex-grow justify-center items-center py-10 px-4 text-center">
          <h2 className="text-red-600 text-3xl font-semibold mb-4">Oops! Something went wrong.</h2>
          <p className="text-red-500 text-lg mb-6">{typeof error === 'string' ? error : JSON.stringify(error)}</p>
          <button
            onClick={() => {
              setError(null); 
              setFetchBooksUrl(prevUrl => prevUrl); 
              if(prevUrl => prevUrl === '/api/booksdata/private' && !user?.id) fetchUserData();
            }}
            className="px-6 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
          >
            Try Again
          </button>
        </main>
      </div>
    );
  }

  return (
    <div className="flex mt-12 flex-col min-h-screen bg-white" id="topofthepage">
      <Layout />

      <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8 flex flex-col items-center">
          <input
            type="text"
            placeholder="Search by title or author..."
            className="w-full max-w-lg px-4 py-3 border-2 border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all hover:border-gray-400"
            value={search}
            onChange={handleSearchChange}
          />
        </div>

        <div className="mb-6 flex flex-wrap items-center justify-start gap-2 sm:gap-4">
          <button
            onClick={handlePublicBooksClick}
            disabled={isLoading && fetchBooksUrl === '/api/booksdata'}
            className={clsx(
              "px-4 py-2 text-sm font-medium rounded-md hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-colors",
              booksViewStatus === 'public' ? "bg-blue-200 text-blue-800 ring-2 ring-blue-500" : "bg-blue-100 text-blue-700"
            )}
          >
            Public Books
          </button>
          <button
            onClick={handlePrivateBooksClick}
            disabled={isLoading && fetchBooksUrl.includes('/private')}
            className={clsx(
              "px-4 py-2 text-sm font-medium rounded-md hover:bg-green-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 transition-colors",
               booksViewStatus === 'private' ? "bg-green-200 text-green-800 ring-2 ring-green-500" : "bg-green-100 text-green-700"
            )}
          >
            Private Books
          </button>
        </div>
        
        <div className="mb-6 flex flex-col sm:flex-row justify-between items-center gap-2">
          {(!isLoading && !message && !error && books.length!==0) && (
            <p className="text-md text-gray-700">
              Showing {pagesBooks.length > 0 ? startIndex + 1 : 0}-
              {Math.min(endIndex, books.length)} of {books.length} books found.
            </p>
          )}
          {(message && !isLoading) && (
            <p className="text-md text-orange-600">{message}</p>
          )}
          {(error && !isLoading) && ( 
             <p className="text-md text-red-500">Error: {typeof error === 'string' ? error : 'Could not load books.'}</p>
          )}
          {(books && books.length > 50 && !isLoading) && (
            <Link href={'#bottomofthepage'} className="p-2 rounded-full bg-gray-200 hover:bg-gray-300 transition-colors text-gray-600">
              <AArrowDown size={20}/>
            </Link>
          )}
        </div>

        {isLoading ? (
          <div className="flex flex-wrap justify-center sm:justify-start -mx-2">
            {[...Array(9)].map((_, i) => (
              <div key={i} className="p-2 w-full md:w-1/2 lg:w-1/3">
                <BookCardSkeleton />
              </div>
            ))}
          </div>
        ) : (
          pagesBooks.length > 0 ? (
            <div className="flex flex-wrap justify-center sm:justify-start -mx-2">
              {pagesBooks.map((book) => (
                <div key={book._id || book.title} className="p-2 w-full md:w-1/2 lg:w-1/3">
                    <BookCard
                    author={book.author}
                    title={book.title}
                    link_epub={book.link_epub}
                    link_pdf={book.link_pdf}
                    username={book?.username}
                    />
                </div>
              ))}
            </div>
          ) : (
            (!message && !error && books.length==0) && <p className="text-center text-xl text-gray-500 py-10">No books to display currently.</p>
          )
        )}
        
        {!isLoading && books && books.length > 50 && pages.length > 1 && (
          <div id="bottomofthepage" className="mt-10 flex flex-wrap justify-center items-center gap-2 py-4">
            {pages.map(page => (
              <button
                key={page}
                className={clsx(
                  "px-4 py-2 text-sm font-medium rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-opacity-50",
                  currentPage === page
                    ? "bg-blue-600 text-white focus:ring-blue-500"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300 focus:ring-gray-400"
                )}
                onClick={() => handlePageChange(page)}
              >
                {page}
              </button>
            ))}
          </div>
        )}

        {books && books.length > 50 && !isLoading && (
          <div className="mt-8 flex justify-end">
            <Link href={'#topofthepage'} className="p-2 rounded-full bg-gray-200 hover:bg-gray-300 transition-colors text-gray-600">
              <AArrowUp size={20}/>
            </Link>
          </div>
        )}
      </main>
    </div>
  );
}