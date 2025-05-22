'use client'
import { useState } from "react";
import React from "react";
import { BookOpen, Lock, Globe } from "lucide-react";
import Link from "next/link";
import { LinearProgress } from "@mui/material";

const UserBookCard = ({ book }) => {
  const [loading,setloading] = useState(null)
  const {
    title,
    author,
    description,
    status,
    createdAt,
    link_pdf
  } = book;
  const date = new Date(createdAt)
  const isPublic = status === "Public";

  return (
    <div className="dark:bg-gray-100 w-1/1 items-center min-h-25 h-full cursor-pointer shadow-md text-black p-4 transition hover:shadow-xl border border-gray-200">
      {loading && <LinearProgress color="inherit" className="w-full mb-2"/>}
      <Link href={link_pdf} onClick={()=>setloading(true)} className="flex items-center justify-between mb-2">
        <h2 className="text-xl font-semibold text-wrap text-gray-700">{title}</h2>
        {isPublic ? (
          <Globe className="w-5 h-5 text-gray-600" title="Public" />
        ) : (
          <Lock className="w-5 h-5 text-gray-900" title="Private" />
        )}
      </Link>
      
      {author && (
        <p className="text-sm text-gray-600 mb-1">
          <span className="font-medium">Author:</span> {author}
        </p>
      )}
      <div className="flex items-center justify-between text-xs text-gray-500">
        <span className="flex items-center gap-1">
          <BookOpen className="w-4 h-4" />
          Uploaded: {date.toUTCString()}
        </span>
        <span className="capitalize">{status}</span>
      </div>
    </div>
  );
};

export default UserBookCard;
