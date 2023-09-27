import React, { useState } from "react";
import { useSelector } from "react-redux";
import ChatArea from "./components/ChatArea";
import UserSearch from "./components/UserSearch";
import UsersList from "./components/UsersList";

const Home = () => {
  const [searchKey, setSearchKey] = useState("");
  const { selectedChat } = useSelector((state) => state.userReducer);

  return (
    <div className="flex gap-5">
      <div className="w-96">
        <UserSearch searchKey={searchKey} setSearchKey={setSearchKey} />
        <UsersList searchKey={searchKey} />
      </div>
      <div className="w-full">{selectedChat && <ChatArea />}</div>
    </div>
  );
};

export default Home;
