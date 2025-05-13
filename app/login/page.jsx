"use client";
import Layout from "../(componets)/layout";
import { useState,useEffect } from "react";
import { signIn,signOut } from "next-auth/react";
import { Bounce, ToastContainer,Zoom,toast } from "react-toastify";
import Signout from "../(componets)/Signout";
import { useRouter } from "next/navigation";
export default function Login() {
    const router = useRouter();
    const [user,setUser] = useState(null);
  const [info,setInfo] = useState({email:"",code:""})  
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [message,setMessage] = useState(null);
  const [emailState,setemailState] = useState("invalid");
    useEffect(()=>{
        async function user() {
            const res = await fetch('/api/getUser',{
                method:'GET',
                credentials:'include'
            })
            const data = await res.json();
            if(data.user) return setUser(data.user);
        }
        user();
    },[])



    const notify = (mess)=>toast(mess,{
        theme:"light",
        transition:Zoom,
        hideProgressBar:true,
        autoClose:3000
    }
    );
    useEffect(()=>{
        if(error){
            notify(error)
        }
    },[error])

  function isValidEmail(email) {
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
        async function sendCode(email) {
            const res = await fetch("/api/auth/verify",{
                method:'POST',
                body:JSON.stringify({
                    email,
                    type:"email"
                })
            });
            const data = await res.json();
            if(data.error) return setError(data.error);
            setMessage(data.message)
            setemailState('code');
            notify(data.message)

        }
        sendCode(info.email);
    }
    const handleSubmit = ()=>{
        setLoading(true)
        if(!info.code) {
            return setError("Please enter code");
        }
        async function verify() {
            const res = await fetch('api/auth/verify',{
                method:'POST',
                body:JSON.stringify({
                    email:info.email,
                    code:info.code,
                    type:"code"
            })})
            const data = await res.json();
            if(data.error) return setError(data.error);
            notify(data.message);
            setLoading(false)
            router.push("/dashboard")
        }
        verify();
    }



    if(user) {
        return (
            <div className="flex flex-col items-center justify-center h-screen">
                <Layout/>
                <div className="flex flex-col items-center justify-center w-1/2 bg-gray-200 rounded-md p-2 m-2">
                    <p className="text-xl">You are logged in!</p>
                    <p className="text-xl">Email: {user.email}</p>
                    <Signout/>
                </div>
            </div>
    )}
  return(
    <div className="flex flex-col items-center justify-center h-screen">
        <ToastContainer/>
                <Layout/>
        <div className="flex flex-col items-center justify-center w-1/2 bg-gray-200 rounded-md p-4">
            <form>
                <div className="flex flex-col items-center justify-center w-1/1 bg-gray-200 rounded-md p-2">
                    <label htmlFor="email" className="w-max">Enter a valid email</label>
                    <div className="flex flex-row  text-center">
                        <input type="email" id="email" name="email" 
                            value={info.email} placeholder="xyz@gmail.com" required autoComplete="off"
                            onChange={(e)=>setInfo({...info,email:e.target.value})} 
                            className="w-80 h-12 border-2 border-black rounded-md p-2 m-2 invalid:border-red-300 invalid:outline-none"/>
                    </div>
                        { emailState=="valid" && <button  type="button" onClick={handleCode} className=" border-black rounded-md p-2 w-max bg-gray-300 hover:bg-gray-500">Send Code</button>}
                    
                </div>
                 { emailState=="code" &&

                 <div className="flex flex-col items-center justify-center bg-gray-200 rounded-md p-2 m-2">
                    <label htmlFor="code" className="w-max">Enter the code sent:</label>
                    <input type="text" required id="code" name="code" placeholder="code..."
                    value={info.code} onChange={(e)=>setInfo({...info,code:e.target.value})}
                    className="w-80 h-12 border-2 border-black rounded-md p-2 m-2" />
                <div className="flex flex-row items-center justify-center bg-gray-200 rounded-md p-2">
                    <button type="button" onClick={handleSubmit} className="border-black rounded-md p-2 w-30 bg-gray-300 hover:bg-gray-500">Submit</button>
                </div>
                </div>

                }

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