import React from "react";

const UserSearch = ({ searchKey, setSearchKey }) => {
  return (
    <div className="relative">
      <input
        type="text"
        placeholder="Search user or chat"
        className="w-full pl-10 text-gray-500"
        value={searchKey}
        onChange={(e) => setSearchKey(e.target.value)}
      />
      <i className="fa-solid fa-magnifying-glass absolute top-3.5 left-3.5 text-gray-500"></i>
    </div>
  );
};

export default UserSearch;
