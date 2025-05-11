import { NextResponse } from "next/server";
export function middleware(req){
    console.log("New Request incoming:");
    const isLoggedInMan = req.cookies.get('token')?.value;
    const isLoggedInAuth = req.cookies.get('next-auth.session-token')?.value || req.cookies.get('__Secure-next-auth.session-token')?.value ;
    
    const pathname = req.nextUrl.pathname;
    if(pathname.startsWith("/dashboard") || pathname.startsWith("/admin/addbooks") ){
        const redURL = new URL("/login",req.url);
        redURL.searchParams.set("message",'unauth')
        if(!isLoggedInMan || !isLoggedInAuth){
            return NextResponse.redirect(redURL)
        }
    }
    return NextResponse.next();

}

export const config ={
    matcher:['/admin/:path*']
}