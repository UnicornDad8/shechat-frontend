import React from "react";
import { useSelector } from "react-redux";

const ChatArea = () => {
  const { selectedChat } = useSelector((state) => state.userReducer);

  return <div>{selectedChat && <h2>{selectedChat._id}</h2>}</div>;
};

export default ChatArea;
