"use client";
import { useState,useEffect } from "react";
import { signIn, signOut } from "next-auth/react";
import { useSession } from "next-auth/react";

export default function Login() {
  const [info,setInfo] = useState({email:"",password:""})  
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
    const {data,status} = useSession();
    console.log("data",data,"status",status)
    if(data?.user) {
        return (
            <div className="flex flex-col items-center justify-center h-screen">
                <div className="flex flex-col items-center justify-center w-1/2 bg-gray-200 rounded-md p-2 m-2">
                    <p className="text-xl">You are logged in!</p>
                    <p className="text-xl">Email: {data.user.email}</p>
                    <p className="text-xl">Name: {data.user.name}</p>
                    <button onClick={() => signOut()}>Sign Out</button>
                </div>
            </div>
    )}
  return(
    <div className="flex flex-col items-center justify-center h-screen">
        <div className="flex flex-col items-center justify-center w-1/2 bg-gray-200 rounded-md p-2 m-2">
            <form>
                <div className="flex flex-row items-center justify-center bg-gray-200 rounded-md p-2 m-2">
                    <label htmlFor="email" className="w-20">Email</label>
                    <input type="email" id="email" name="email" 
                    value={info.email} placeholder="xyz@gmail.com"
                    onChange={(e)=>setInfo({...info,email:e.target.value})} 
                    className="w-80 h-12 border-2 border-black rounded-md p-2 m-2"/>
                </div>
                <div className="flex flex-row items-center justify-center bg-gray-200 rounded-md p-2 m-2">
                    <label htmlFor="password" className="w-20">Password</label>
                    <input type="password" id="password" name="password" placeholder="123@abc/.-}afg"
                    value={info.password} onChange={(e)=>setInfo({...info,password:e.target.value})}
                    className="w-80 h-12 border-2 border-black rounded-md p-2 m-2" />
                </div>
                <div className="flex flex-row items-center justify-center bg-gray-200 rounded-md p-2 m-2">
                    <button type="submit" className=" border-black rounded-md p-2 w-30 bg-gray-300 hover:bg-gray-500">Login</button>
                </div>
            </form>
                    <button className=" border-black rounded-md p-2 w-max bg-gray-300 hover:bg-gray-500" onClick={()=>signIn("github")}>Sign in with GitHub</button>
                    <button className=" border-black rounded-md p-2 w-max bg-gray-300 hover:bg-gray-500" onClick={()=>signIn("google")}>Sign in with Google</button>
                    <button className=" border-black rounded-md p-2 w-max bg-gray-300 hover:bg-gray-500" onClick={()=>signOut()}>Sign Out</button>
                    
        </div>
        <div>
            <p>{info.email}</p>
            <p>{info.password}</p>

        </div>
    </div>
  )
}