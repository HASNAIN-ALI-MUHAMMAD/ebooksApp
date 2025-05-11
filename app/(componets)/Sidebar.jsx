import React from 'react';
import { BookOpen, Bookmark, LogOut, User } from 'lucide-react';

const Sidebar = () => {
  return (
    <div className="flex flex-col h-screen w-full sm:w-64 bg-white shadow-md p-4 fixed sm:static top-0 left-0 z-10">
      {/* Profile */}
      <div className="flex items-center space-x-3 mb-8">
        <User className="w-8 h-8 text-gray-600" />
        <div>
          <p className="text-sm font-semibold">John Doe</p>
          <p className="text-xs text-gray-500">Reader</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex flex-col gap-4">
        <a
          href="#uploaded"
          className="flex items-center gap-3 text-gray-700 hover:text-blue-600 transition"
        >
          <BookOpen className="w-5 h-5" />
          <span className="text-sm">Books Uploaded</span>
        </a>
        <a
          href="#saved"
          className="flex items-center gap-3 text-gray-700 hover:text-blue-600 transition"
        >
          <Bookmark className="w-5 h-5" />
          <span className="text-sm">Saved Books</span>
        </a>
        <a
          href="#logout"
          className="flex items-center gap-3 text-gray-700 hover:text-red-500 transition mt-auto"
        >
          <LogOut className="w-5 h-5" />
          <span className="text-sm">Logout</span>
        </a>
      </nav>
    </div>
  );
};

export default Sidebar;
