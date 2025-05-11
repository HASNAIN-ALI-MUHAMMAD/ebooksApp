"use client";
import Link from "next/link";
export default function Layout(){
    return(
        <div className="flex flex-row justify-center item-center gap-6">
            <Link href="/">Home </Link>
            <Link href="/login">Login</Link>
            <Link href="/dashboard">Dashboard</Link>
        </div>
    )
}
