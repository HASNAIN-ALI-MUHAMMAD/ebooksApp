'use client';
import { useState,useEffect } from "react";
import { X } from "lucide-react";

export default function Confirm({text,setResponse}){
    const [display,setDisplay] = useState('flex');
    const handleConfirm = ()=>{
        setResponse(true);
        setDisplay('hidden')
    }
    const handleClose = ()=>{
        setResponse(false)
        setDisplay('hidden')
    }

    return(
        <div className={` flex flex-col backdrop-blur-[1px] justify-center items-center fixed top-0 left-0 right-0 bottom-0 overflow-screen h-screen ${display}`}>
            <div className="">
                <div className="flex flex-col h-50 w-100 z-10 bg-white rounded-lg shadow-lg">
                    <div className="p-3 flex justify-between items-center">
                        <h1 className="text-lg">Confirm</h1>
                        <button className="cursor-pointer hover:text-gray-500" onClick={handleClose}><X/></button>
                    </div>
                    <div className="flex flex-col p-4 bg-gray-300 h-full">
                        <p className="text-xl ">{text}</p>
                    </div>
                    <div className="bg-gray-300 w-full h-20">
                        <button className="w-full sm:w-auto px-4 py-2 bg-gray-300 text-black rounded-md hover:bg-gray-500 float-right" onClick={handleConfirm}>Confirm</button>
                    </div>
                </div>
            </div>
        </div>
        
    )
}
