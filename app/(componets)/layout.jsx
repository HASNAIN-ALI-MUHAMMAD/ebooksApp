"use client";
import Image from "next/image";
import Link from "next/link";
import Signout from "./Signout";
import { useEffect, useState } from "react";
export default function Layout(){
    const [user,setUser] = useState();
    useEffect(()=>{
        async function User() {
            const res = await fetch("/api/getUser",{
                method:'GET',
                credentials:'include'
            });
            const data = await res.json();
            if(data.error) return;
            setUser(data.message);
            console.log("user",data.message);
        }
        User();
    },[])
    {user &&
        <div className="flex flex-col w-full px-3">
            <Link href={'/dashboard'} className="flex flex-row items-center gap-2">
                <Image src="/user.jpeg" alt="logo" width={30} height={30} className="rounded-full"/>
                <p className="text-md">Hasnain</p>
            </Link>
            <div className="w-30 text-center p-1 rounded-lg bg-gray-300 hover:bg-gray-100 m-2">
                <Signout/>
            </div>
        </div>
    }
}
