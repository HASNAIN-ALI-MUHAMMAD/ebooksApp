'use client'
import React from 'react';

const BookInfoCard = ({ title, author, description, imageUrl }) => {
  return (
    <div className="w-full max-w-6xl mx-auto bg-white shadow-md rounded-2xl overflow-hidden flex flex-col md:flex-row items-center p-6 md:p-8 gap-6">
      {/* Cover Image */}
      {/* <div className="w-full md:w-1/3 flex justify-center">
        <img
          src={imageUrl}
          alt={title}
          className="rounded-xl object-cover w-full h-64 md:h-full"
        />
      </div> */}

      {/* Book Info */}
      <div className="w-full md:w-2/3 space-y-4">
        <h2 className="text-3xl font-bold text-gray-800">{title}</h2>
        <p className="text-lg text-gray-600 font-semibold">By {author}</p>
        <p className="text-gray-700 text-base leading-relaxed">
          {description}
        </p>
      </div>
    </div>
  );
};

export default BookInfoCard;