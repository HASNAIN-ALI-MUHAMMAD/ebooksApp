'use client';
import { useState,useEffect,useRef } from "react";
import { Bounce, ToastContainer,Zoom,toast } from "react-toastify";
import Layout from "@/app/(components)/topbar";
import { Brain } from "lucide-react";
import { CircularProgress } from "@mui/material";
import Confirm from "@/app/(components)/confirm";

export default function Page() {
    const [bookData,setBookData] = useState({title:'',author:'',description:'',status:''});
    const [file,setFile] = useState();
    const inputRef = useRef(null); 
    const [fileError,setFileError] = useState(null);
    const [error,setError] = useState(null);
    const [message,setMessage] = useState(null);
    const [isLoading,setIsLoading] = useState(null);
    const [isLoadingFile,setIsLoadingFile] = useState(false);
    const [booksLength,setBookLength] = useState(null);
    const [pdfText,setPdfText] = useState(null);
    const [aiRes,setAiRes] = useState({});
    const [submitStatus,setSubmitStatus] = useState(null);


    const notify = (mess,typ)=>toast(mess,{
        theme:"light",
        transition:Zoom,
        hideProgressBar:true,
        autoClose:3000,
        type:typ
    });

    async function process(fileUp){
        const formData = new FormData();
        formData.append("file",fileUp);
        const res = await fetch('/api/process/pdf',{
            method:'POST',
            body:formData
        })
        const data = await res.json()
        setPdfText(data.text)
        console.log(data)
        async function askAi(pdf){
            const res = await fetch('/api/aimodels',{
                method:'POST',
                body:JSON.stringify({ text:pdf })
            })
            const data = await res.json();
            if(data?.error) {
                setIsLoadingFile(false);
                console.log(data)
                return  notify("Please enter the details manually.Unable to scan the file.",'error');
            }
            setAiRes(data?.data);
            console.log(data)
            setIsLoadingFile(false);
        }
        askAi(data.text)
    }


    const handleFileChange = (e) => {
        setIsLoadingFile(true);
        const FILE = e.target.files[0];
        const allowedTypes = [ 'application/epub+zip','application/pdf'];
        if(!FILE) return;
        if(!allowedTypes.includes(FILE.type)){
            setIsLoadingFile(false)
            if (inputRef.current) inputRef.current.value = null;
             return notify("File type is not allowed.",'error');
        }
        setFileError(null);
        setFile(FILE);
        let filename = FILE.name.split('.');
        setBookData({ ...bookData, title:filename[0] })
        // process(FILE);
        setIsLoadingFile(false);
    }

    const handleChangeText = (e) =>{
        setError(null)
        setBookData({ ...bookData, [e.target.name]:e.target.value })
    }
    const handleSubmit = async (e)=>{
        if(e?.preventDefault) e.preventDefault();
        if(!file) return notify("Please select file.",'error');
        if(!bookData.title) return notify("Please enter title.",'error')
        if(!bookData.author) return notify("Please enter title.",'error')
        if(!bookData.description) return notify("Please enter title.",'error')
        if(!bookData.status ||  bookData.status == 'Select share status') return notify("Please select share status.",'error');
        if(submitStatus != 'confirmed'){
            return setSubmitStatus('confirming')
        }
        setError(null)
        setFileError(null)
        setMessage(null)
        setIsLoading('submit');
        const formData = new FormData();
        formData.append("file",file);
        for(const key in bookData){
            formData.append(key,bookData[key])
        }
        formData.append('bookId',booksLength+1)
        try{
            const response = await fetch("/api/addbooks",{
                method:"POST",
                body:formData
            })
            const data = await response.json();
            if(!data) return notify("Error occurred while fetching!",'error');
            setIsLoading(null);
            if(data.error){ return notify(data?.error,'error'); }
            if(response.status!=200){ return notify(data,'error'); }
            if(response.ok){ return notify("Book Added Successfully",'success'); }
        }
        catch(err){
            setIsLoading(false);
            notify(err.message,'error');
        }
    }
    useEffect(()=>{
        async function booksLength(){
            const res = await fetch('/api/booksdata');
            const data = await res.json();
            setBookLength(data.length);
        }
        booksLength()
    },[file])

    useEffect(()=>{
        setBookData({
            title:aiRes.title,
            author:aiRes.author,
            description:aiRes.summary,
        })
        return;
    },[aiRes])

    useEffect(() => {
        if (submitStatus === 'confirmed') {
            handleSubmit(new Event('submit')); // simulate submit event
        }
    }, [submitStatus]);

    return(
    <div className="flex flex-col items-center justify-start min-h-screen px-4 py-6 bg-gray-50">
        <Layout/>
        <ToastContainer/>
        <div className="w-full max-w-4xl p-6 mt-10 bg-white shadow-md rounded-md">
            <h1 className="text-3xl mb-6">Add a Book</h1>
            <form className="space-y-6">

                {/* File Upload */}
                <div>
                    <label htmlFor="file-upload" className="block text-lg font-medium text-gray-700">Upload File <span className="text-sm text-red-500">(PDF or EPUB)</span></label>
                    <input id="file-upload" type="file" onChange={handleFileChange} ref={inputRef} className="mt-2 block w-max text-sm text-gray-900 file:bg-gray-200 file:border focus:outline-none focus:file:bg-gray-500 hover:file:bg-gray-500 file:rounded-lg file:p-2" />
                    {file && <p className="mt-2 text-sm text-gray-600">Selected file: {file.name}</p>}
                    {isLoadingFile && (
                        <div className="text-sm text-gray-500 mt-2 flex items-center gap-2">
                            <CircularProgress size={16} />
                            <span>Scanning your file...</span>
                        </div>
                    )}
                    {fileError && <p className="text-red-500 text-sm mt-1">{fileError}</p>}
                </div>

                {/* Title and Author */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label htmlFor="title" className="block text-lg font-medium text-gray-700">Book Title</label>
                        <input type="text" id="title" name="title" value={bookData.title} disabled={isLoadingFile} onChange={handleChangeText} className="mt-1 disabled:opacity-50 block hover:bg-gray-300 focus:bg-white w-full border border-gray-300 rounded-md p-2" placeholder="Enter book title" />
                    </div>
                    <div>
                        <label htmlFor="author" className="block text-lg font-medium text-gray-700">Author</label>
                        <input type="text" id="author" name="author" value={bookData.author} onChange={handleChangeText} disabled={isLoadingFile} className="mt-1 block disabled:opacity-50 w-full hover:bg-gray-300 focus:bg-white border border-gray-300 rounded-md p-2" placeholder="Enter author name" />
                    </div>
                </div>

                {/* Description */}
                <div>
                    <label htmlFor="description" className="block text-lg font-medium text-gray-700">Description</label>
                    <textarea id="description" name="description" value={bookData.description}  onChange={handleChangeText} rows="5" disabled={isLoadingFile} className="mt-1 block disabled:opacity-50 hover:bg-gray-300 focus:bg-white  w-full h-40 border border-gray-300 rounded-md p-2" placeholder="A short description of the book"></textarea>
                </div>

                {/* Share Status */}
                <div>
                    <label htmlFor="status" className="block text-lg font-medium text-gray-700">Share Status</label>
                    <select id="status" name="status" onChange={handleChangeText} className="mt-1 block w-full border hover:bg-gray-300  focus:bg-white border-gray-300 rounded-md p-2">
                        <option value={null}>Select share status</option>
                        <option value="Private">Private</option>
                        <option value="Public">Public</option>
                    </select>
                </div>

                {/* Buttons */}
                <div className="flex flex-col sm:flex-row sm:justify-between gap-4">
                    <input type="reset" onClick={() => { setFile(null); setBookData({ title: '' }); }} value="Reset" className="w-full sm:w-auto cursor-pointer px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600" />
                    <button type="button" onClick={handleSubmit} className="w-full sm:w-auto px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700">
                        {isLoading === 'submit' ? <CircularProgress color="inherit" size={18}/> : "Upload Book"}
                    </button>
                </div>
                {
                    submitStatus == 'confirming' && 
                    <Confirm text={`Do you confirm uploading the file as ${bookData.status}?`} setResponse={(res)=>{
                        if(res){
                        setSubmitStatus('confirmed');
                        return
                        }
                    }}/>
                }

                {/* Messages */}
                {message && <p className="text-green-600 text-sm">{message}</p>}
                {error && <p className="text-red-600 text-sm">{error}</p>}
                {isLoading && <div className="text-gray-600 text-sm">Uploading file... Please wait.</div>}

            </form>
        </div>
    </div>
    )
}
