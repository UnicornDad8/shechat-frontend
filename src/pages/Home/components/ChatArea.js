import React from "react";
import { useSelector } from "react-redux";

const ChatArea = () => {
  const { selectedChat, user } = useSelector((state) => state.userReducer);
  const receipentUser = selectedChat.members.find(
    (member) => member._id !== user._id
  );

  return (
    <div className="bg-white h-[87vh] border rounded-2xl w-full flex flex-col justify-between p-5">
      {/* receipents users */}
      <div>{receipentUser.name}</div>
      {/* chat messages */}
      <div>chat messages</div>
      {/* chat input */}
      <div>chat input</div>
    </div>
  );
};

export default ChatArea;
