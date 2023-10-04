import React from "react";

const UserSearch = ({ searchKey, setSearchKey }) => {
  return (
    <div className="relative">
      <input
        type="text"
        placeholder="Chats"
        className="w-full h-[45px] pl-10 text-gray-500 rounded-3xl focus:outline-none focus:ring-2 focus:ring-gray-600 focus:border-transparent"
        value={searchKey}
        onChange={(e) => setSearchKey(e.target.value)}
      />
      <i className="fa-solid fa-magnifying-glass absolute top-3.5 left-3.5 text-gray-500"></i>
    </div>
  );
};

export default UserSearch;
