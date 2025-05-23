'use client';
import { useState, useEffect, useRef, useCallback } from "react";
import { Bounce, ToastContainer, Zoom, toast } from "react-toastify";
import TopbarLayout from "@/app/(components)/topbar";
import { Brain, UploadCloud, AlertTriangle, CheckCircle } from "lucide-react";
import { CircularProgress } from "@mui/material";
import Confirm from "@/app/(components)/confirm"; 

export default function AddBookPage() { 
    const [bookData, setBookData] = useState({ title: '', author: '', description: '', status: '' });
    const [file, setFile] = useState(null); 
    const inputRef = useRef(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isLoadingFile, setIsLoadingFile] = useState(false);
    const [booksLength, setBookLength] = useState(0); 
    const [aiRes, setAiRes] = useState(null); 
    const [submitStatus, setSubmitStatus] = useState(null); 

    const [topbarHeight, setTopbarHeight] = useState(60);
    const topbarRef = useCallback(node => {
        if (node !== null) {
            setTopbarHeight(node.getBoundingClientRect().height);
        }
    }, []);


    const notify = (mess, typ) => toast(mess, {
        position: "top-center",
        theme: "light",
        transition: Zoom,
        hideProgressBar: false,
        autoClose: typ === 'error' ? 5000 : 3000, 
        type: typ,
        closeOnClick: true,
        pauseOnHover: true,
    });

    async function processFileAndExtractInfo(fileToProcess) {
        setIsLoadingFile(true);
        setAiRes(null); 
        setBookData(prev => ({ ...prev, author: '', description: '' }));

        const formData = new FormData();
        formData.append("file", fileToProcess);

        try {
            const pdfRes = await fetch('/api/process/pdf', { method: 'POST', body: formData });
            const pdfData = await pdfRes.json();

            if (pdfData.error || !pdfData.text) {
                notify(pdfData.error || "Could not extract text from PDF.", 'warning');
                setIsLoadingFile(false);
                return;
            }

            // Now ask AI
            const aiApiRes = await fetch('/api/aimodels', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ text: pdfData.text })
            });
            const aiData = await aiApiRes.json();

            if (aiData?.error || !aiData?.data) {
                notify(aiData?.error || "AI could not extract details. Please enter manually.", 'info');
            } else {
                setAiRes(aiData.data);
                notify("AI has suggested some details for your book!", 'success');
            }
        } catch (err) {
            console.error("Error processing file or with AI:", err);
            notify("An error occurred during file processing. Please try again or enter details manually.", 'error');
        } finally {
            setIsLoadingFile(false);
        }
    }


    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (!selectedFile) {
            setFile(null); 
            setBookData(prev => ({ ...prev, title: '' })); 
            return;
        }

        const allowedTypes = ['application/pdf', 'application/epub+zip'];
        if (!allowedTypes.includes(selectedFile.type)) {
            notify("Invalid file type. Please upload PDF or EPUB.", 'error');
            if (inputRef.current) inputRef.current.value = null;
            setFile(null);
            return;
        }

        setFile(selectedFile);
        const filenameParts = selectedFile.name.split('.');
        filenameParts.pop(); 
        const titleFromFilename = filenameParts.join('.');
        setBookData(prev => ({ ...prev, title: titleFromFilename, author: '', description: '' })); 

        if (selectedFile.type === 'application/pdf') {
            processFileAndExtractInfo(selectedFile);
        } else {
            notify("EPUB selected. Please fill in the details manually.", "info");
        }
    };

    const handleChangeText = (e) => {
        setBookData({ ...bookData, [e.target.name]: e.target.value });
    };

    const validateForm = () => {
        if (!file) { notify("Please select a file.", 'error'); return false; }
        if (!bookData.title?.trim()) { notify("Book title is required.", 'error'); return false; }
        if (!bookData.author?.trim()) { notify("Author name is required.", 'error'); return false; }
        if (!bookData.description?.trim()) { notify("Description is required.", 'error'); return false; }
        if (!bookData.status || bookData.status === 'Select share status') { notify("Please select a share status.", 'error'); return false; }
        return true;
    };

    const attemptSubmit = async (e) => {
        if (e?.preventDefault) e.preventDefault();
        if (!validateForm()) return;

        if (submitStatus !== 'confirmed') {
            setSubmitStatus('confirming');
            return;
        }

        setIsLoading(true);
        const formData = new FormData();
        formData.append("file", file);
        Object.keys(bookData).forEach(key => {
            formData.append(key, bookData[key]);
        });
        formData.append('bookId', String(booksLength + 1)); 

        try {
            const response = await fetch("/api/addbooks", { method: "POST", body: formData });
            const data = await response.json();

            if (!response.ok || data.error) {
                notify(data.error || `Error: ${response.statusText}`, 'error');
            } else {
                notify("Book added successfully!", 'success');
                setFile(null);
                if (inputRef.current) inputRef.current.value = null;
                setBookData({ title: '', author: '', description: '', status: '' });
                setAiRes(null);
                setSubmitStatus(null); 
                fetchBooksLength();
            }
        } catch (err) {
            console.error("Submit error:", err);
            notify(err.message || "An unexpected error occurred.", 'error');
        } finally {
            setIsLoading(false);
            if (submitStatus === 'confirmed') setSubmitStatus(null); 
        }
    };

    const fetchBooksLength = async () => {
        try {
            const res = await fetch('/api/booksdata',{
                method:'POST',
                credentials:'include'
            });
            const data = await res.json();
            if (data?.length) {
                setBookLength(data.length);
            } else {
                 setBookLength(0);
            }
        } catch (error) {
            notify("Failed to fetch books length:", 'error');
            return;
        }
    };

    useEffect(() => {
        fetchBooksLength();
    }, []);

    useEffect(() => {
        if (aiRes) {
            setBookData(prev => ({
                ...prev, 
                title: aiRes.title?.trim() || prev.title,
                author: aiRes.author?.trim() || '',
                description: aiRes.summary?.trim() || '',
            }));
        }
    }, [aiRes]);

    useEffect(() => {
        if (submitStatus === 'confirmed') {
            attemptSubmit();
        }
    }, [submitStatus]);

    const handleReset = () => {
        setFile(null);
        if (inputRef.current) inputRef.current.value = null;
        setBookData({ title: '', author: '', description: '', status: '' });
        setAiRes(null);
        setIsLoadingFile(false);
        setIsLoading(false);
        setSubmitStatus(null);
        notify("Form cleared.", "info");
    }

    return (
        <div className="flex flex-col min-h-screen bg-gray-100 print:bg-white">
            <div ref={topbarRef} className="w-full">
                <TopbarLayout />
            </div>
            <ToastContainer />

            <main className="flex-grow flex flex-col items-center justify-start w-full px-4 mt-20 py-6 sm:px-6 lg:px-8" style={{ paddingTop: `${topbarHeight + 24}px` }}> {/* Adjust 24px as needed for spacing */}
                <div className="w-full max-w-3xl p-6 sm:p-8 bg-white shadow-xl rounded-lg">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 sm:mb-8">
                        <h1 className="text-2xl sm:text-3xl font-semibold text-gray-800">Add a New Book</h1>
                    </div>

                    <form onSubmit={attemptSubmit} className="space-y-6">
                        <div>
                            <label htmlFor="file-upload" className="block text-sm font-medium text-gray-700 mb-1">
                                Book File <span className="text-xs text-gray-500">(PDF or EPUB)</span>
                            </label>
                            <input
                                id="file-upload"
                                type="file"
                                accept=".pdf,.epub"
                                onChange={handleFileChange}
                                ref={inputRef}
                                className="block w-full text-sm text-gray-700 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 disabled:opacity-50"
                                disabled={isLoading || isLoadingFile}
                            />
                            {file && <p className="mt-2 text-xs text-gray-600">Selected: {file.name}</p>}
                            {isLoadingFile && (
                                <div className="text-xs text-blue-600 mt-2 flex items-center gap-2">
                                    <CircularProgress size={14} color="inherit" />
                                    <span>Scanning file for details... (this may take a moment)</span>
                                </div>
                            )}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
                            <div>
                                <label htmlFor="title" className="block text-sm font-medium text-gray-700">Title <span className="text-red-500">*</span></label>
                                <input type="text" id="title" name="title" value={bookData.title || ''} onChange={handleChangeText} disabled={isLoading}
                                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm p-2.5 disabled:bg-gray-100" placeholder="e.g., The Great Gatsby" />
                            </div>
                            <div>
                                <label htmlFor="author" className="block text-sm font-medium text-gray-700">Author <span className="text-red-500">*</span></label>
                                <input type="text" id="author" name="author" value={bookData.author || ''} onChange={handleChangeText} disabled={isLoading}
                                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm p-2.5 disabled:bg-gray-100" placeholder="e.g., F. Scott Fitzgerald" />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description <span className="text-red-500">*</span></label>
                            <textarea id="description" name="description" value={bookData.description || ''} onChange={handleChangeText} rows="4" disabled={isLoading}
                                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm p-2.5 disabled:bg-gray-100" placeholder="A short summary of the book..."></textarea>
                        </div>

                        <div>
                            <label htmlFor="status" className="block text-sm font-medium text-gray-700">Share Status <span className="text-red-500">*</span></label>
                            <select id="status" name="status" value={bookData.status || 'Select share status'} onChange={handleChangeText} disabled={isLoading}
                                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm p-2.5 disabled:bg-gray-100">
                                <option disabled value="Select share status">Select share status</option>
                                <option value="Private">Private (Only you can see)</option>
                                <option value="Public">Public (Visible to everyone)</option>
                            </select>
                        </div>

                        <div className="flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-3 space-y-3 space-y-reverse sm:space-y-0 pt-2">
                            <button type="button" onClick={handleReset} disabled={isLoading || isLoadingFile}
                                className="w-full sm:w-auto justify-center inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-60">
                                Clear Form
                            </button>
                            <button type="submit" disabled={isLoading || isLoadingFile}
                                className="w-full sm:w-auto justify-center inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-60">
                                {isLoading ? <CircularProgress color="inherit" size={20} /> : <><UploadCloud size={18} className="mr-2 -ml-1"/> Upload Book</>}
                            </button>
                        </div>
                        {
                            submitStatus === 'confirming' &&
                            <Confirm
                                title="Confirm Upload"
                                text={`Are you sure you want to upload "${bookData.title || 'this book'}" as ${bookData.status?.toLowerCase()}?`}
                                setResponse={(res) => {
                                    setSubmitStatus(res ? 'confirmed' : null);
                                }}
                            />
                        }
                    </form>
                </div>
            </main>
        </div>
    );
}