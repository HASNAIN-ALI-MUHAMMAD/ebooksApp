import React from 'react';
import Link from 'next/link';


export const BookCardSkeleton = () => {
  return (
    <div className="bg-gray-200 p-4 rounded-lg mb-4 shadow-md w-full h-50  lg:w-1/4 md:w-1/2 flex flex-col justify-center items-center animate-pulse gap-2">
      <div className="w-32 h-40 bg-gray-300 rounded-md" /> {/* Placeholder for image or cover */}
      <div className="h-5 w-3/4 bg-gray-300 rounded" />
      <div className="h-4 w-1/2 bg-gray-300 rounded" />
      <div className="h-8 w-full bg-gray-300 rounded-md" />
    </div>
  );
};




const BookCard = ({ title, author,link_pdf ,children}) => {
  return (
    <div className="bg-white bg-gray-300 p-4 rounded-lg mb-4 shadow-md w-1/1 lg:w-1/3 md:w-1/2 flex flex-col justify-center gap-2 items-center grow">
 
            <>  
            {children}
              <h2 className="text-lg font-semibold px-3 text-gray-800 mb-2 h-15 text-center">{title}</h2>
              <p className="text-gray-600 text-sm mb-2">by {author}</p>
  
             { link_pdf &&
              <Link
                href={link_pdf ? link_pdf :""}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full text-gray-900 p-1.5  rounded-md bg-gray-100 text-sm hover:bg-gray-400 transition"
              >
                Read Book as PDF
              </Link>
              }
            </>




    </div>

  );
};

export default BookCard;
