import React, { useState } from "react";
import { useSelector } from "react-redux";
import ChatArea from "./components/ChatArea";
import UserSearch from "./components/UserSearch";
import UsersList from "./components/UsersList";
import { io } from "socket.io-client";

const Home = () => {
  const socket = io("http://localhost:5000");
  const [searchKey, setSearchKey] = useState("");
  const { selectedChat } = useSelector((state) => state.userReducer);

  return (
    <div className="flex gap-2">
      <div className="w-96">
        <UserSearch searchKey={searchKey} setSearchKey={setSearchKey} />
        <UsersList searchKey={searchKey} />
      </div>
      <div className="w-full flex items-center justify-center">
        {selectedChat && <ChatArea />}
      </div>
    </div>
  );
};

export default Home;
