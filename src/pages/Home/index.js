import React, { useState } from "react";
import ChatArea from "./components/ChatArea";
import UserSearch from "./components/UserSearch";
import UsersList from "./components/UsersList";

const Home = () => {
  const [searchKey, setSearchKey] = useState("");

  return (
    <div className="flex gap-5">
      <div className="w-96">
        <UserSearch searchKey={searchKey} setSearchKey={setSearchKey} />
        <UsersList searchKey={searchKey} />
      </div>
      <div>
        <ChatArea />
      </div>
    </div>
  );
};

export default Home;
