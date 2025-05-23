"use client"; 

import Layout from "../../(components)/topbar";
import { useState, useEffect, Suspense } from "react"; 
import { signIn } from "next-auth/react";
import { ToastContainer, Zoom, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css'; 
import { useRouter, useSearchParams } from "next/navigation";
import { CircularProgress } from "@mui/material";

function ActualLoginForm() {
    const router = useRouter();
    const searchParams = useSearchParams(); 

    const [info, setInfo] = useState({ email: "", code: "" });
    const [formError, setFormError] = useState(null); 
    const [loading, setLoading] = useState(null); 
    const [emailState, setEmailState] = useState("invalid"); 

    const notify = (message, type = 'info') => toast(message, {
        theme: "light",
        transition: Zoom,
        hideProgressBar: false,
        autoClose: type === 'error' ? 5000 : 3000,
        type: type
    });

    useEffect(() => {
        const oauthError = searchParams.get('error');
        if (oauthError) {
            let friendlyMessage = `Login error: ${oauthError}`;
            if (oauthError === "OAuthAccountNotLinked") {
                friendlyMessage = "This email is linked to another login method. Please use that method.";
            } else if (oauthError === "Callback" || oauthError === "OAuthCallback") {
                 friendlyMessage = "There was an issue during the login process. Please try again.";
            }
            notify(friendlyMessage, "error");
        }
    }, [searchParams, router]); 

    useEffect(() => {
        async function checkLoginStatus() {
            try {
                const res = await fetch('/api/isLoggedIn', { 
                    method: 'GET',
                    credentials: 'include'
                });
                if (res.ok) {
                    const data = await res.json();
                    if (data.user) {
                        router.push('/dashboard');
                    }
                }
            } catch (e) {
                console.error("Failed to check login status", e);
            }
        }
        checkLoginStatus();
    }, [router]);

    useEffect(() => {
        if (formError) {
            notify(formError, 'error');
            setFormError(null);
        }
    }, [formError]); 

    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    useEffect(() => {
        setEmailState(isValidEmail(info.email) ? 'valid' : 'invalid');
    }, [info.email]);

    const handleSendCode = async () => {
        if (loading) return;
        setLoading('send_code');
        try {
            const res = await fetch("/api/auth/verify", {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: info.email, type: "email" })
            });
            const data = await res.json();
            if (!res.ok || data.error) {
                setFormError(data.error || "Failed to send code.");
            } else {
                notify(data.message || "Verification code sent!", 'success');
                setEmailState('code');
            }
        } catch (e) {
            setFormError("An error occurred. Please try again.");
        } finally {
            setLoading(null);
        }
    };

    const handleSubmitCode = async () => {
        if (loading) return;
        if (!info.code.trim()) {
            setFormError("Please enter the verification code.");
            return;
        }
        setLoading('submit_code');
        try {
            const result = await signIn('credentials', {
                redirect: false, 
                email: info.email,
                code: info.code,
            });

            if (result?.error) {
                setFormError(result.error || "Invalid code or login failed.");
            } else if (result?.ok) {
                notify("Login successful!", 'success');
                router.push("/dashboard");
            } else {
                 setFormError("Login failed. Please try again.");
            }
        } catch (e) {
            setFormError("An unexpected error occurred.");
        } finally {
            setLoading(null);
        }
    };

    const handleOAuthSignIn = (provider) => {
        if (loading) return;
        setLoading(provider);
        const callbackUrl = '/dashboard';
        signIn(provider, { callbackUrl });
    };

    return (
        <div className="flex flex-col items-center mt-10 md:mt-16 px-4 w-full">
            <div className="bg-white shadow-xl rounded-lg p-6 sm:p-8 w-full max-w-md">
                <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">Login or Sign Up</h2>
                        <div className="space-y-3">
                            <OAuthButton provider="github" loading={loading} onClick={() => handleOAuthSignIn("github")} label="Sign in with Github" icon={null /* Add Github icon component here */} />
                            <OAuthButton provider="google" loading={loading} onClick={() => handleOAuthSignIn("google")} label="Sign in with Google" icon={null /* Add Google icon component here */} />
                        </div>
            </div>
        </div>
    );
}

const OAuthButton = ({ provider, loading, onClick, label, icon }) => (
    <button
        type="button"
        onClick={onClick}
        disabled={!!loading && loading !== provider}
        className={`w-full flex justify-center items-center gap-2 font-semibold py-2.5 px-4 rounded-md shadow-sm border focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-70
            ${provider === 'github' ? 'bg-gray-800 hover:bg-gray-900 text-white border-gray-800 focus:ring-gray-500' : ''}
            ${provider === 'google' ? 'bg-white hover:bg-gray-50 text-gray-700 border-gray-300 focus:ring-blue-500' : ''}
        `}
    >
        {loading === provider ? <CircularProgress color="inherit" size={20} /> : (icon || label)}
        {loading !== provider && icon && <span className="flex-1 text-left">{label}</span>}
    </button>
);


export default function LoginPage() {
    return (
        <div className="flex flex-col min-h-screen bg-gray-50">
            <ToastContainer position="top-center" />
            <div className="w-full sticky top-0 z-50 shadow-sm"> 
                <Layout />
            </div>
            <main className="flex-grow flex items-start md:items-center justify-center py-6">
                <Suspense fallback={
                    <div className="flex flex-col justify-center items-center h-full pt-20 text-gray-600">
                        <CircularProgress color="inherit" size={32}/>
                        <p className="mt-3 text-lg">Loading login options...</p>
                    </div>
                }>
                    <ActualLoginForm />
                </Suspense>
            </main>
        </div>
    );
}