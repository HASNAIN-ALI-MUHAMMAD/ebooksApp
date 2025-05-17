"use client";
import React, { useState } from "react";
import { Pencil, Save } from "lucide-react";
import Image from "next/image";

export default function UserProfile({userData}){
  // Simulated initial user data
  const [user, setUser] = useState(userData);
    console.log(userData)
    console.log(user)

  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState({
  name: user.name || "",
  email: user.email || "",
  image: user.image || "",
});


  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };


  const handleSave = () => {
    setUser(form);
    setEditMode(false);
  };

  return (
    <div className="w-full h-full mx-auto bg-white dark:bg-gray-900 rounded-2xl shadow-md p-6 border border-gray-200 dark:border-gray-700">
      <div className="flex flex-col items-center space-y-4">
        { user.image && <Image
          src={user.image || ''}
          width={60}
          height={50}
          alt="Profile"
          className=" rounded-full object-cover border-2 border-gray-300 dark:border-gray-600"
        />}

        {editMode ? (
          <>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-lg dark:bg-gray-800 dark:text-white"
              placeholder="Your name"
            />
            <p className="text-gray-500 dark:text-gray-400">{user.email}</p>

            <button
              onClick={handleSave}
              className="flex items-center gap-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              <Save className="w-4 h-4" /> Save
            </button>
          </>
        ) : (
          <>
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
              {user.name}
            </h2>
            <p className="text-gray-500 dark:text-gray-400">{user.email}</p>
            <button
              onClick={() => setEditMode(true)}
              className="flex items-center gap-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              <Pencil className="w-4 h-4" /> Edit Profile
            </button>
          </>
        )}
      </div>
    </div>
  );
};

