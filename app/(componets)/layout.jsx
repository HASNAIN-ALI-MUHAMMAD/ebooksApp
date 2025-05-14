"use client";
import Image from "next/image";
import Link from "next/link";
import Signout from "./Signout";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import clsx from "clsx";
import { LinearProgress } from "@mui/material";

export default function Layout(){
    const [user,setUser] = useState(null);
    const pathname = usePathname();
    const [linkState,setLinkState] = useState('');
    console.log("pathname",pathname);
    
    const handleLinkState = (e)=>{
        if(`http://localhost:3000${pathname}` == e.target.href) return;
        setLinkState('loading');
        return;
      }

    useEffect(()=>{
        async function User() {
            const res = await fetch("/api/getUser",{
                method:'GET',
                credentials:'include'
            });
            const data = await res.json();
            if(data.error) return user;
            setUser(data.user);
            console.log("user",data);
        }
        User();
    },[])
    return(
        <div className="flex flex-col fixed top-0 left-0 w-full z-50">
            { linkState == 'loading' &&<div className="flex flex-col w-full"><LinearProgress color="inherit" className="w-full"/></div>} 
        <div className="flex flex-row gap-4 bg-gray-200 w-full p-1 border-b-2 mb-2 py-2">
            <div className="flex flex-col px-3 items-center text-center">
                <Link href={'/'} onClick={handleLinkState}  className={clsx("flex flex-row w-max items-center hover:text-gray-400",pathname=='/'? "text-gray-400 hover:text-gray-900":"text-black")}>
                    Home
                </Link>
            </div>
           { user ?
           <>
            <div className="flex flex-col  px-3">
                <Link href={'/dashboard'} onClick={handleLinkState} className={clsx("flex flex-row w-max items-center hover:text-gray-400",pathname=='/dasboard'? "text-gray-400 hover:text-gray-900":"text-black")}>
                    Dashboard
                </Link>
            </div>
            <div className="flex flex-col  px-3">
                <Link href={'/admin/addbooks'} onClick={handleLinkState}  className={clsx("flex flex-row w-max items-center hover:text-gray-400",pathname=='/admin/addbooks'? "text-gray-400 hover:text-gray-900":"text-black")}>
                    Store
                </Link>
            </div>
            <div className="flex flex-col px-3 items-center text-center right-0 top-1 absolute">
                <Link href={'/dashboard'} onClick={handleLinkState} className={clsx("flex flex-row items-center w-max hover:text-gray-400",pathname=='/dashboard'? "text-gray-400 hover:text-gray-900":"text-black")}>
                    <Image src="/user.jpeg" alt="logo" width={30} height={30} className="rounded-full"/>
                    <p className="text-sm">{user.email || user.name}</p>
                </Link>
            </div>


           </>  
                :
            <div className="flex flex-col px-3">
                <Link href={'/login'} onClick={handleLinkState}  className={clsx("flex flex-row w-max items-center hover:text-gray-400",pathname=='/login'? "text-gray-400 hover:text-gray-900":"text-black")}>
                    Login
                </Link>
            </div>
            }
        </div>
            
         </div>

    )
}
