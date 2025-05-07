import React from 'react';
import Link from 'next/link';

const BookCard = ({ title, author, url,url_pdf ,children}) => {
  return (
    <div className="bg-white bg-gray-300 p-4 rounded-lg mb-4 shadow-md w-1/2  lg:w-1/3 md:w-1/2 flex flex-col justify-center gap-2 items-center grow">
 
            <>  
            {children}
              <h2 className="text-lg font-semibold text-gray-800 mb-2 h-15 text-center">{title}</h2>
              <p className="text-gray-600 text-sm mb-2">by {author}</p>

              <Link
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full text-gray-900 p-1.5  rounded-md bg-gray-100 text-sm hover:text-gray-700 transition"
              >
                Read Book as Epub
              </Link>
              <Link
                href={url_pdf}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full text-gray-900 p-1.5  rounded-md bg-gray-100 text-sm hover:text-gray-700 transition"
              >
                Read Book as PDF
              </Link>
            </>




    </div>

  );
};

export default BookCard;
