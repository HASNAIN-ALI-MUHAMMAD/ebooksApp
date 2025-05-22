"use client";
import Image from "next/image";
import Link from "next/link";
import Signout from "./Signout";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import clsx from "clsx";
import { LinearProgress } from "@mui/material";
import { Menu, X } from "lucide-react";

export default function TopbarLayout() {
    const [user, setUser] = useState([]);
    const pathname = usePathname();
    const [linkState, setLinkState] = useState('');
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const handleLinkState = (e) => {
        const currentHref = `${window.location.origin}${pathname}`;
        if (e.currentTarget.href.startsWith(`${currentHref}#`) || e.currentTarget.href === currentHref) {
          setMobileMenuOpen(false);
          return;
        }
        setLinkState('loading');
        setMobileMenuOpen(false); 
    };

    useEffect(() => {
        async function fetchUser() {
            try {
                const res = await fetch("/api/userdata", {
                    method: 'GET',
                    credentials: 'include'
                });
                const data = await res.json();
                if (data.error) {
                    console.error("Error fetching user:", data.error);
                    setUser(null);
                    return;
                }
                setUser(data.user);
                console.log(data)
            } catch (error) {
                console.error("Failed to fetch login status:", error);
                setUser(null);
            }
        }
        fetchUser();
    }, []);

    useEffect(() => {
      setLinkState('');
    }, [pathname]);

    const navLinkClasses = (hrefPath) => clsx(
        "block md:inline-block px-3 py-2 rounded-md text-sm font-medium hover:text-gray-500 transition-colors",
        pathname === hrefPath ? "text-gray-600 font-semibold bg-gray-200 md:bg-transparent" : "text-black"
    );

    const userProfileLinkClasses = clsx(
      "flex items-center gap-2 px-3 py-1 md:py-0 rounded-md hover:bg-gray-300 transition-colors",
      pathname === '/dashboard' ? "bg-gray-300" : ""
    );

    return (
        <div className="fixed top-0 left-0 w-full z-50  shadow-md print:hidden"> 
            {linkState === 'loading' && <div className="w-full"><LinearProgress color="inherit" className="!bg-blue-500" /></div>}
            <div className="bg-gray-100 w-full p-2 md:px-4 md:py-3 border-b border-gray-300">
                <div className="container mx-auto flex items-center justify-between">
                    <div className="flex-shrink-0">
                        <Link href={'/'} onClick={handleLinkState} className={navLinkClasses('/')}>
                            Home
                        </Link>
                    </div>

                    <nav className="hidden md:flex items-center space-x-2 md:space-x-3 lg:space-x-4">
                        {user.email ? (
                            <>
                                <Link href={'/dashboard'} onClick={handleLinkState} className={navLinkClasses('/dashboard')}>
                                    Dashboard
                                </Link>
                                <Link href={'/addbooks'} onClick={handleLinkState} className={navLinkClasses('/addbooks')}>
                                    Add Books
                                </Link>
                            </>
                        ) : (
                            <Link href={'/login'} onClick={handleLinkState} className={navLinkClasses('/login')}>
                                Login
                            </Link>
                        )}
                    </nav>

                    {user.email && (
                        <div className="hidden md:flex items-center ml-auto md:ml-4"> 
                             <Link href={'/dashboard'} onClick={handleLinkState} className={userProfileLinkClasses}>
                                <Image 
                                    src={user?.image || '/user.jpeg'} 
                                    alt="User" width={28} height={28} className="rounded-full"/>
                                {/* <span className="text-sm hidden lg:block ml-2">{user}</span>  */}
                            </Link>
                        </div>
                    )}

                    <div className="md:hidden flex items-center">
                        {user.email && (
                            <Link href={'/dashboard'} onClick={handleLinkState} className="mr-2 p-1">
                                <Image src={"/user.jpeg"} alt="User" width={28} height={28} className="rounded-full"/>
                            </Link>
                        )}
                        <button
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className="p-2 rounded-md text-gray-700 hover:bg-gray-200 focus:outline-none focus:bg-gray-200"
                            aria-label="Main menu"
                            aria-expanded={mobileMenuOpen}
                        >
                            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    </div>
                </div>
            </div>

            {mobileMenuOpen && (
                <div className="md:hidden bg-gray-50 border-b border-gray-300 shadow-lg">
                    <nav className="flex flex-col space-y-1 px-2 pt-2 pb-3">
                        {user ? (
                            <>
                                <Link href={'/dashboard'} onClick={handleLinkState} className={navLinkClasses('/dashboard')}>
                                    Dashboard
                                </Link>
                                <Link href={'/addbooks'} onClick={handleLinkState} className={navLinkClasses('/addbooks')}>
                                    Add Books
                                </Link>
                                <div className="px-1 pt-3 mt-2 border-t border-gray-200">
                                    <Signout />
                                </div>
                            </>
                        ) : (
                            <Link href={'/login'} onClick={handleLinkState} className={navLinkClasses('/login')}>
                                Login
                            </Link>
                        )}
                    </nav>
                </div>
            )}
        </div>
    );
}