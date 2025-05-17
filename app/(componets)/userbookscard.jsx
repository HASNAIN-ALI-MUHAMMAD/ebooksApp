import React from "react";
import { BookOpen, Lock, Globe } from "lucide-react";

const UserBookCard = ({ book }) => {
  const {
    title,
    author,
    description,
    status,
    createdAt,
  } = book;
    let titles = title.split("_").join(" ");

  const isPublic = status === "Public";

  return (
    <div className="dark:bg-gray-700 w-1/2 shadow-md rounded-2xl p-4 transition hover:shadow-xl border border-gray-200">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-xl font-semibold text-wrap text-gray-800 dark:text-white">{titles}</h2>
        {isPublic ? (
          <Globe className="w-5 h-5 text-green-500" title="Public" />
        ) : (
          <Lock className="w-5 h-5 text-red-500" title="Private" />
        )}
      </div>
      
      {author && (
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
          <span className="font-medium">Author:</span> {author}
        </p>
      )}

      {description && (
        <p className="text-sm text-gray-700 dark:text-gray-300 mb-2 line-clamp-3">
          {description}
        </p>
      )}

      <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
        <span className="flex items-center gap-1">
          <BookOpen className="w-4 h-4" />
          Uploaded: {new Date(createdAt).toLocaleDateString()}
        </span>
        <span className="capitalize">{status}</span>
      </div>
    </div>
  );
};

export default UserBookCard;
