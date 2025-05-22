'use client'
import { useState, useEffect, useRef } from 'react';
import { Viewer, Worker } from '@react-pdf-viewer/core';
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
import 'react-toastify/dist/ReactToastify.css';

export default function PdfBookViewer({ fileUrl, fileId }) {
  const pathname = usePathname();
  const [currentPage, setCurrentPage] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [lastpage, setLastPage] = useState(null);
  const notified = useRef(false);
  const [pageState, setPageState] = useState('show');
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const notify = (mess, typ) => toast(mess, {
    theme: "light",
    transition: Zoom,
    hideProgressBar: false,
    autoClose: typ === 'error' ? 5000 : 3000,
    type: typ,
    position: "top-center"
  });

  const pageNavigationPluginInstance = pageNavigationPlugin();
  const zoomPluginInstance = zoomPlugin();
  const getFilePluginInstance = getFilePlugin();
  const rotatePluginInstance = rotatePlugin();
  const thumbnailPluginInstance = thumbnailPlugin();

  const { ZoomInButton, ZoomOutButton, ZoomPopover } = zoomPluginInstance;
  const { DownloadButton } = getFilePluginInstance;
  const { Thumbnails } = thumbnailPluginInstance;
  const { RotateForwardButton, RotateBackwardButton } = rotatePluginInstance;
  const {
    GoToNextPageButton,
    GoToPreviousPageButton,
    CurrentPageInput,
    NumberOfPages,
  } = pageNavigationPluginInstance;

  useEffect(() => {
    const fetchLastPage = async () => {
      setIsLoading(true);
      try {
        const res = await fetch(`/api/booksprogress`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            fileId,
            type: 'lastpage'
          })
        });
        const data = await res.json();

        if (data.error) {
          notify(data.error, 'error');
          setIsLoggedIn(false);
          setLastPage(0);
        } else {
          if (!data.isLoggedIn && !notified.current) {
            notify('You are not logged in. Progress won\'t be saved!', 'warning');
            notified.current = true;
          }
          setIsLoggedIn(!!data.isLoggedIn);

          if (data.message && !notified.current) {
            notify(data.message, 'success');
            notified.current = true;
          }
          
          setLastPage(typeof data.lastPage === 'number' && data.lastPage > 0 ? data.lastPage - 1 : 0);
        }
      } catch (err) {
        console.error('Fetch error:', err);
        notify('Could not load your progress.', 'error');
        setLastPage(0);
        setIsLoggedIn(false);
      } finally {
        setIsLoading(false);
      }
    };
    if (fileId) {
        fetchLastPage();
    } else {
        setIsLoading(false);
        setLastPage(0);
    }
  }, [fileId]);

  const updateDbsProgress = async (page) => {
    if (!isLoggedIn) return;
    try {
      const res = await fetch('/api/booksprogress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fileId,
          pageNumber: page,
          type: 'updatepage'
        })
      });
      const data = await res.json();
      if (data.error) {
        console.error("Error updating progress:", data.error);
      }
    } catch (e) {
      console.error("Network error updating progress:", e);
    }
  };

  useEffect(() => {
    if (!isLoggedIn || currentPage < 1) return;

    const timeoutId = setTimeout(() => {
      updateDbsProgress(currentPage);
    }, 3000);

    return () => clearTimeout(timeoutId);
  }, [currentPage, isLoggedIn, fileId]);

  const handlePageState = () => {
    setPageState(prev => (prev === 'hide' ? 'show' : 'hide'));
  };

  if (!fileUrl) {
    return (
        <div className="flex justify-center items-center h-screen bg-gray-100">
             <ToastContainer position="top-center"/>
            <p className="text-xl text-gray-700">No PDF file specified.</p>
        </div>
    );
  }

  return (
    <div className="flex flex-col md:flex-row h-screen bg-gray-200">
      <ToastContainer position="top-center" />
      
      <div className={`fixed md:static top-0 left-0 h-full z-20 transition-transform duration-300 ease-in-out ${pageState === 'show' ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 bg-gray-50 border-r border-gray-300 shadow-lg md:shadow-none w-64 md:w-48 lg:w-56 print:hidden`}>
        <div className="p-2 text-right md:hidden">
            <button onClick={handlePageState} className="p-2 hover:text-blue-600 text-gray-700">
                <Menu size={24} />
            </button>
        </div>
        <div className="h-[calc(100%-40px)] md:h-full overflow-y-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200 p-1 pt-0 md:pt-2">
          {isLoading ? (
            <div className="flex justify-center items-center h-full">
              <CircularProgress size={24}/>
            </div>
          ): (
             <Thumbnails />
          )}
        </div>
      </div>

      <div className="flex-1 flex flex-col overflow-hidden h-screen">
        <div className="flex items-center justify-center flex-wrap gap-1 sm:gap-2 bg-gray-700 text-white px-2 py-1.5 shadow-md print:hidden">
          <div className="md:hidden mr-auto">
             <button onClick={handlePageState} className="p-1.5 hover:bg-gray-600 rounded">
                <Menu size={20} />
            </button>
          </div>
          <ZoomOutButton />
          <ZoomInButton />
          <div className="hidden sm:block"><ZoomPopover /></div>
          <div className="mx-1 border-l border-gray-500 h-5"></div>
          <GoToPreviousPageButton />
          <div className="flex items-center">
            <CurrentPageInput />
            <span className="px-1">/</span>
            <NumberOfPages />
          </div>
          <GoToNextPageButton />
          <div className="mx-1 border-l border-gray-500 h-5"></div>
          <RotateBackwardButton />
          <RotateForwardButton />
          <div className="ml-auto">
            <DownloadButton />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto bg-gray-300">
          <Worker workerUrl={`https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js`}>
            {(isLoading || lastpage === null) ? (
              <div className="flex justify-center items-center h-full text-gray-600">
                <CircularProgress color="inherit" size={32}/>
                <p className="ml-3 text-lg">Loading PDF...</p>
              </div>
            ) : (
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
                defaultScale={1.2}
              />
            )}
          </Worker>
        </div>
      </div>
    </div>
  );
}