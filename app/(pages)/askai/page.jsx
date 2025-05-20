'use client'
import { useEffect } from "react";

export default function AskAi() {
    useEffect(()=>{
        async function aiFetch() {
            const res =await fetch('/api/aimodels',{
                method:'POST',
                body:JSON.stringify({query:'What is the meaning of life?'}),
                headers:{
                    'Content-Type':'application/json'
                }
            })
            const data = await res.json();
            console.log(data.choices[0].message.content);
        }
        aiFetch();
        })
  return (
    <div>
        <label htmlFor="query">Ask a question:</label>
        <input type="text" name="query" id="query" />
    </div>
  );
}