'use client'
import { useState, useEffect } from "react"
import UserBookCard from "./userbookscard" 
import { useRouter } from "next/navigation";
import clsx from "clsx";
import { BookCardSkeleton } from "./bookcard"; 
import Link from "next/link";
import { toast, Zoom } from 'react-toastify'; 
import { PlusCircle } from "lucide-react";


export default function Uploads() {
    const router = useRouter();
    const [books, setBooks] = useState([]);
    const [filteredBooks, setFilteredBooks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filterStatus, setFilterStatus] = useState("all");

    const notify = (mess, typ) => toast(mess, {
        theme: "light", transition: Zoom, hideProgressBar: true, autoClose: 3000, type: typ
    });

    useEffect(() => {
        setLoading(true);
        setError(null);
        async function getBooks() {
            try {
                const res = await fetch('/api/userbooks', { method: 'GET' });
                if (!res.ok) throw new Error(`Failed to fetch books: ${res.statusText}`);
                const data = await res.json();
                if (data.error) {
                    setError(data.error); setBooks([]);
                } else {
                    setBooks(data.allBooks || []);
                }
            } catch (err) {
                setError(err.message); setBooks([]);
                notify(err.message, 'error');
            } finally {
                setLoading(false);
            }
        }
        getBooks();
    }, []);

    useEffect(() => {
        if (!books) { setFilteredBooks([]); return; }
        if (filterStatus === "all") {
            setFilteredBooks(books);
        } else {
            const filtered = books.filter((book) => book.status && book.status.toLowerCase() === filterStatus);
            setFilteredBooks(filtered);
        }
    }, [filterStatus, books]);

    const filterButtonClasses = (status) => clsx(
        "px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm rounded-md transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-blue-500",
        filterStatus === status
            ? 'bg-blue-600 text-white shadow-sm'
            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
    );

    return (
        <div className='flex flex-col gap-4 sm:gap-6 w-full'>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4 p-1">
                <h2 className='text-xl sm:text-2xl font-semibold text-gray-800'>My Uploads</h2>
                <div className='flex flex-wrap gap-2'>
                    <button className={filterButtonClasses('all')} onClick={() => setFilterStatus('all')}>All</button>
                    <button className={filterButtonClasses('private')} onClick={() => setFilterStatus('private')}>Private</button>
                    <button className={filterButtonClasses('public')} onClick={() => setFilterStatus('public')}>Public</button>
                </div>
            </div>

            {error && (
                <div className="my-4 p-3 bg-red-100 text-red-700 rounded-md text-sm">
                    <p><span className="font-semibold">Error:</span> {error}</p>
                    <button className="mt-1 text-xs text-blue-600 hover:underline" onClick={() => router.refresh()}>Try Again</button>
                </div>
            )}

            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-5'>
                {loading ? (
                    Array.from({ length: 4 }).map((_, index) => <BookCardSkeleton key={index} />)
                ) : filteredBooks.length > 0 ? (
                    filteredBooks.map((book) => (
                        <UserBookCard key={book.id || book.title} book={book} />
                    ))
                ) : (
                    <div className="col-span-full flex flex-col gap-4 items-center justify-center py-10 text-center bg-gray-50 rounded-lg min-h-[200px] sm:min-h-[300px]">
                        <p className="text-gray-500 text-base sm:text-lg">
                            {filterStatus === 'all' ? "You haven't uploaded any books yet." : `No ${filterStatus} books found.`}
                        </p>
                        <Link
                            href={'/addbooks'}
                            className="flex items-center gap-2 px-4 py-2 sm:px-5 sm:py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm sm:text-base font-medium shadow hover:shadow-md"
                        >
                            <PlusCircle size={18} />
                            Add New Book
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
}