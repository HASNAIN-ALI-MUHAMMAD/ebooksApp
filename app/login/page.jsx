"use client";
import { useState,useEffect } from "react";
import { signIn,signOut } from "next-auth/react";
import { Bounce, ToastContainer,Zoom,toast } from "react-toastify";
import { useSession } from "next-auth/react";

export default function Login() {
  const [info,setInfo] = useState({email:"",code:""})  
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [emailState,setemailState] = useState("invalid");
    const {data,status} = useSession();
    console.log("data",data,"status",status);
    const notify = ()=>toast("Code sent.",{
        theme:"dark",
        transition:Zoom,
        hideProgressBar:true,
        autoClose:3000
    }
    );


  function isValidEmail(email) {
        if(!email.includes('mail')) return;
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
    useEffect(()=>{
        if(isValidEmail(info.email)){
            return setemailState('valid')
        }
        setemailState('invalid')

    },[info.email]);

    const handleCode = (e)=>{
        e.preventDefault();
        // async function sendCode(email) {
        //     setemailState('codeLoading');
        //     const res = await fetch("/api/auth/verify",{
        //         method:'POST',
        //         body:JSON.stringify({
        //             email
        //         })
        //     });
        //     const data = await res.json();
        //     setemailState('code');
        // }
        // sendCode(info.email);
        notify()
    }
    const handleSubmit = (e)=>{
        e.preventDefault();
    }



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
        <ToastContainer/>
        <div className="flex flex-col items-center justify-center w-1/2 bg-gray-200 rounded-md p-4">
            <form onSubmit={handleSubmit}>
                <div className="flex flex-col items-center justify-center w-1/1 bg-gray-200 rounded-md p-2">
                    <label htmlFor="email" className="w-max">Enter a valid email</label>
                    <div className="flex flex-row  text-center">
                        <input type="email" id="email" name="email" 
                            value={info.email} placeholder="xyz@gmail.com" required autoComplete="off"
                            onChange={(e)=>setInfo({...info,email:e.target.value})} 
                            className="w-80 h-12 border-2 border-black rounded-md p-2 m-2 invalid:border-red-300 invalid:outline-none"/>
                    </div>
                        { emailState=="valid" && <button  onClick={handleCode} className=" border-black rounded-md p-2 w-max bg-gray-300 hover:bg-gray-500">Send Code</button>}
                    
                </div>
                 { emailState=="code" &&<div className="flex flex-col items-center justify-center bg-gray-200 rounded-md p-2 m-2">
                    <label htmlFor="code" className="w-20">Enter the code sent:</label>
                    <input type="code" required id="code" name="code" placeholder="code..."
                    value={info.password} onChange={(e)=>setInfo({...info,code:e.target.value})}
                    className="w-80 h-12 border-2 border-black rounded-md p-2 m-2" />
                </div>}
                {emailState=="validCode" && 
                <div className="flex flex-row items-center justify-center bg-gray-200 rounded-md p-2 m-2">
                    <button type="submit" className=" border-black rounded-md p-2 w-30 bg-gray-300 hover:bg-gray-500">Login</button>
                </div>}
            </form>
            <p>or</p>
            <div className="flex flex-col gap-2">
                   <button className=" border-black rounded-md p-2 w-max bg-gray-300 hover:bg-gray-500" onClick={()=>signIn("github")}>Sign in with GitHub</button>
                    <button className=" border-black rounded-md p-2 w-max bg-gray-300 hover:bg-gray-500" onClick={()=>signIn("google")}>Sign in with Google</button>
            </div>
         </div>
    </div>
  )
}