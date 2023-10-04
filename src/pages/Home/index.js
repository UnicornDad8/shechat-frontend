import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import ChatArea from "./components/ChatArea";
import UserSearch from "./components/UserSearch";
import UsersList from "./components/UsersList";
import { io } from "socket.io-client";

const socket = io("http://localhost:5000");

const Home = () => {
  const [searchKey, setSearchKey] = useState("");
  const { selectedChat, user } = useSelector((state) => state.userReducer);

  useEffect(() => {
    // join the room
    if (user) {
      socket.emit("join-room", user._id);
    }
  }, [user]);

  return (
    <div className="flex gap-2">
      <div className="lg:w-96 xl:w-96 md:w-60 sm:w-60">
        <UserSearch searchKey={searchKey} setSearchKey={setSearchKey} />
        <UsersList searchKey={searchKey} socket={socket} />
      </div>
      <div className="w-full flex items-center justify-center">
        {selectedChat && <ChatArea socket={socket} />}
      </div>
    </div>
  );
};

export default Home;
