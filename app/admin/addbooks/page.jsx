'use client';
import { useState,useEffect } from "react";

export default function Page() {
    const [bookData,setBookData] = useState({});
    const [file,setFile] = useState();
    const [fileError,setFileError] = useState(null);
    const [error,setError] = useState(null);
    const [message,setMessage] = useState(null);
    const [isLoading,setIsLoading] = useState(false);
    const [booksLength,setBookLength] = useState(null);

    const handleFileChange  = (e)=>{
        setFileError(null);
        const FILE = e.target.files[0];
        const allowedTypes = [ 'application/epub+zip','application/pdf'];
        if(!FILE) return;
        if(!allowedTypes.includes(FILE.type)){
             return setFileError("File type is not allowed.") ;
        }
        setFileError(null);
        setFile(FILE);
    }

    
    const handleChangeText = (e) =>{
        setBookData({
            ...bookData,
            [e.target.name]:[e.target.value]
    })
    }

    const handleSubmit = async (e)=>{
        setError(null)
        setFileError(null)
        setMessage(null)
        e.preventDefault();
        setIsLoading(true);
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
        if(!data) return setError("Error occurred while fetching!");
        setIsLoading(false);
        console.log(data);
        if(data.error){
            return setError(data.error);
        }
        if(response.status!=200){
            setMessage(null)
           return setError(data);

        }
        if(response.ok){
            return setMessage("Book Added Successfully");
        }

    }
        catch(err){
            setIsLoading(false);
            setError(err.message);
            console.log(err.message);

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
    console.log(booksLength)


  return(
    <div className="flex flex-col items-center justify-center h-screen gap-4">
        <h1 className="text-4xl font-bold text-center text-gray-900 dark:text-black">Add a Book</h1>
        <form onSubmit={handleSubmit}>
            <div className="flex flex-col mt-4 gap-1 ">
                <label htmlFor="file-upload" className="block mb-2 text-lg  text-gray-900 dark:text-black">Upload File<p className="text-red-400">(EPUB FILES OR PDF FILES)</p></label>
                <div className="relative">
                    <input id="file-upload" onChange={handleFileChange} 
                    name="file-upload" type="file" required className="opacity-0 absolute"/>
                    <label htmlFor="file-upload"
                        className="cursor-pointer w-1/2 text-wrap px-4 py-2 bg-gray-600 text-white text-sm  rounded-md shadow hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
                    {file? `Selected: ${file.name}`:"Choose a file"}
                    </label>
                </div>
                {fileError && <p className="text-red-400">{fileError}</p>}
            </div>
            <div className="flex flex-col  mt-4">
                <label  htmlFor="title" className="block mb-2 text-lg  text-gray-900 dark:text-black">Name of the Book</label>
                <input onChange={handleChangeText} type="text" required name="title" placeholder="Book Name" 
                className="w-96 border-2 border-black p-2 rounded-lg" />
            </div>
            <div  className="flex flex-col  mt-4">
                <label htmlFor="author" className="block mb-2 text-lg  text-gray-900 dark:text-black">Author of the Book: </label>
                <input type="text" onChange={handleChangeText} required name="author" placeholder="Book Name" 
                className="w-96 border-2 border-black p-2 rounded-lg" />
            </div>
            <div  className="flex flex-col  mt-4">
                <label htmlFor="description"className="block mb-2 text-lg  text-gray-900 dark:text-black">A short description of the Book</label>
                <textarea id="description"  onChange={handleChangeText}  required name="description" rows="5" cols="50" 
                className="border-2 border-black p-2 rounded-lg w-96" 
                placeholder="Enter your description if any..."></textarea>

            </div>
            <div className="flex flex-col  mt-4">
                <input type="reset" placeholder="Reset"
                 className="cursor-pointer px-4 py-2 bg-gray-600 text-white text-sm font-medium rounded-md shadow hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2" value="Reset" />
            </div>
            <div className="flex flex-col  mt-4">
                <button type="submit"
                 className="cursor-pointer px-4 py-2 bg-gray-600 text-white text-sm font-medium rounded-md shadow hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
                    Upload Book
                    </button>
            </div>


        </form>
        {message && <p className="text-2xl text-green-300">{message}</p>}
        {error && <p className="text-2xl text-center text-red-800">{error}</p>}
        {isLoading && <div className="text-2xl text-center text-green-300">
            Loading...
            <p className="text-md text-red-300">It may take a few minutes to upload the file.</p>
            <p className="text-md text-green-200">Please wait!</p>

            </div>}


    </div>

  )
}