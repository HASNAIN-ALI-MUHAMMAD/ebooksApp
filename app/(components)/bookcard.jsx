'use client'
import React from 'react';
import Link from 'next/link';

export const BookCardSkeleton = () => {
  return (
    <div className="bg-white p-4 rounded-lg shadow-lg w-full h-72 flex flex-col justify-start items-center animate-pulse gap-3">
      <div className="w-32 h-40 bg-gray-300 rounded-md mt-2" />
      <div className="h-5 w-3/4 bg-gray-300 rounded mt-2" />
      <div className="h-4 w-1/2 bg-gray-300 rounded" />
      <div className="h-9 w-full bg-gray-300 rounded-md mt-auto mb-2" />
    </div>
  );
};

const BookCard = ({ title, author, link_pdf,username='Anonymous', children }) => {
  return (
    <div className="bg-white p-4 rounded-lg shadow-lg w-full h-full flex flex-col justify-between items-center text-center flex-grow">
      <div className="w-full">
        {children}
        <h2 className="text-xl font-semibold text-gray-900 mb-1 min-h-[2.5em] leading-tight line-clamp-2">
          {title}
        </h2>
        <p className="text-gray-600 text-sm mb-3">
          by <span className="font-medium text-gray-700">{author}</span>
        </p>
        <p className="text-gray-600 text-sm mb-3">
          Uploaded by: <span className="font-medium text-gray-700">{username}</span>
        </p>
      </div>

      {link_pdf && (
        <Link
          href={link_pdf}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-auto w-full block text-white bg-blue-600 hover:bg-blue-700 p-2.5 rounded-md text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
        >
          Read Book as PDF
        </Link>
      )}
    </div>
  );
};

export default BookCard;