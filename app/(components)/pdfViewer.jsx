'use client'
import '../../pdfConfig'
import { useState,useEffect,useRef, use } from 'react';
import { Viewer } from '@react-pdf-viewer/core';
import { Worker } from '@react-pdf-viewer/core';
import '@react-pdf-viewer/core/lib/styles/index.css';
import '@react-pdf-viewer/default-layout/lib/styles/index.css';
import { pageNavigationPlugin } from '@react-pdf-viewer/page-navigation';
import { zoomPlugin } from '@react-pdf-viewer/zoom';
import { getFilePlugin } from '@react-pdf-viewer/get-file';
import { rotatePlugin } from '@react-pdf-viewer/rotate';
import { thumbnailPlugin } from '@react-pdf-viewer/thumbnail';
import { Button, CircularProgress } from '@mui/material';
import { Menu } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { Bounce, ToastContainer,Zoom,toast } from "react-toastify";


export default function PdfBookViewer({ fileUrl,fileId }) {
  const pathname = usePathname();
  const [currentPage, setCurrentPage] = useState(0);
  const [isLoading,setIsLoading] = useState(null);
  const [lastpage,setLastPage] = useState(null);
  const notified = useRef(false);
  const [pageState,setPageState] = useState('show');
  const [isLoggedIn,setIsLoggedIn] = useState(false);
  const notify = (mess,typ)=>toast(mess,{
          theme:"light",
          transition:Zoom,
          hideProgressBar:true,
          autoClose:3000,
          type:typ
      }
      );
  const zoomPluginInstance = zoomPlugin();
  const getFilePluginInstance = getFilePlugin();
  const thumbnailPluginInstance = thumbnailPlugin();
   const pageNavigationPluginInstance = pageNavigationPlugin();
  const { ZoomInButton, ZoomOutButton } = zoomPluginInstance;
  const rotatePluginInstance = rotatePlugin();
const { RotateForwardButton, RotateBackwardButton } = rotatePluginInstance;
  const {
    GoToNextPage,
    GoToPreviousPage,
    CurrentPageInput,
    NumberOfPages,
  } = pageNavigationPluginInstance;
  const { DownloadButton } = getFilePluginInstance;
  const {Thumbnails} = thumbnailPluginInstance;
  useEffect(() => {
    const fetchLastPage = async () => {
      try {
        setIsLoading(true)
        const res = await fetch(`/api/booksprogress`,{
          method:'POST',
          headers: { 'Content-Type': 'application/json' },
          body:JSON.stringify({
            fileId,
            type:'lastpage'
        })
        });
        const { lastPage,message } = await res.json();
        if(!lastpage && !notified.current) { 
          notify('You are not logged in! Progress won`t be saved!','error');
          setIsLoggedIn(false)
          setLastPage(0)
          setIsLoading(false)
          return notified.current=true 
        }
        console.log('lastPage',lastPage)
        if (!notified.current && message) {
          notify(message, 'success');
        setIsLoggedIn(true)
          notified.current = true;
        }
        if (typeof lastPage === 'number') {
          setLastPage(lastPage-1)
          console.log('lastpage',lastpage)
        }
        setIsLoading(false)
        } catch (err) {
        console.error('Fetch error:', err);
      }
    };
    fetchLastPage();
  }, []);

  const updateDbsProgress = async(page)=>{
    if(!isLoggedIn)return;
      const res = await fetch('/api/booksprogress',{
        method:'POST',
        headers: { 'Content-Type': 'application/json' },
        body:JSON.stringify({
          fileId,
          pageNumber:page,
          type:'updatepage'
        })
      })
      const data = await res.json();
      if(data.error) return console.log(data.error);
      console.log(data)
  }  

useEffect(() => {
  if(isLoggedIn !== true) return;
  if (currentPage < 2) return;

  const timeoutId = setTimeout(() => {
    if(isLoggedIn===true){
      updateDbsProgress(currentPage);
    }
  }, 3000);

  return () => clearTimeout(timeoutId);
}, [currentPage]);

  const handlePageState = ()=>{
    if(pageState == 'hide'){
      setPageState("show")
      return
    }
    return setPageState("hide")

  }
  console.log("page",currentPage)

  return (
<div className="flex h-screen bg-gray-100">
  <ToastContainer/>
      {/* Sidebar Thumbnail Viewer */}
      <div>
        <button onClick={handlePageState} className='absolute hover:text-green-900'><Menu/></button>
      </div>
    
    {pageState == 'show' &&
      <div className="w-40 overflow-y-auto mt-6 border-r border-gray-300 bg-white shadow-inner p-2">
        <Thumbnails />
      </div>
  } 

      {/* Main Content */}
      <div className="flex flex-col m-6 flex-1">
        {/* Custom Toolbar */}
        <div className="flex items-center justify-center gap-4 bg-white px-4 py-2 shadow">
          <ZoomOutButton />
          <ZoomInButton />
          <GoToPreviousPage />
          <CurrentPageInput />
          <span className="text-gray-600">/</span>
          <NumberOfPages />
          <GoToNextPage />
          <div className="ml-auto">
            <DownloadButton />
          </div>
          <div className="flex items-center gap-2">
            <RotateBackwardButton />
            <RotateForwardButton />
          </div>

        </div>

        {/* PDF Viewer */}
        <div className="flex-1 overflow-hidden">
          <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js">
          {(lastpage !== null && !isLoading)?
            <Viewer
              fileUrl={fileUrl}
              initialPage={lastpage}
              onPageChange={(e) => {
                setCurrentPage(e.currentPage + 1); 
              }}
              plugins={[
                zoomPluginInstance,
                pageNavigationPluginInstance,
                getFilePluginInstance,
                thumbnailPluginInstance,
                rotatePluginInstance
              ]}
              enableSmoothScroll
              defaultScale={1.4}
            /> : <p>loading...</p>}
          </Worker>
        </div>
      </div>
    </div>
  );
}
