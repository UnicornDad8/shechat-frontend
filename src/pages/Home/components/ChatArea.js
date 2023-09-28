import React, { useState } from "react";
import toast from "react-hot-toast";
import { useSelector, useDispatch } from "react-redux";
import { SendMessage } from "../../../apicalls/messages";
import { ShowLoader, HideLoader } from "../../../redux/loaderSlice";

const ChatArea = () => {
  const dispatch = useDispatch();
  const [newMessage, setNewMessage] = useState("");
  const { selectedChat, user } = useSelector((state) => state.userReducer);
  const receipentUser = selectedChat.members.find(
    (member) => member._id !== user._id
  );

  const sendNewMessage = async () => {
    try {
      dispatch(ShowLoader());
      const message = {
        chat: selectedChat._id,
        sender: user._id,
        text: newMessage,
      };
      const response = await SendMessage(message);
      dispatch(HideLoader());

      if (response.success) {
        setNewMessage("");
      }
    } catch (error) {
      dispatch(HideLoader());
      toast.error(error.message);
    }
  };

  return (
    <div className="bg-white h-[87vh] border rounded-2xl w-full flex flex-col justify-between p-5">
      {/* receipents users */}
      <div>
        <div className="flex gap-5 items-center mb-2">
          {receipentUser?.profilePic && (
            <img
              src={receipentUser?.profilePic}
              alt="User Profile"
              className="w-10 h-10 rounded-full"
            />
          )}
          {!receipentUser?.profilePic && (
            <div className="bg-gray-500 rounded-full w-10 h-10 flex items-center justify-center">
              <h2 className="uppercase text-white text-2xl font-semibold">
                {receipentUser?.name[0]}
              </h2>
            </div>
          )}
          <h2>{receipentUser?.name}</h2>
        </div>
        <hr />
      </div>
      {/* chat messages */}
      <div>chat messages</div>
      {/* chat input */}
      <div>
        <div className="h-[60px] border border-gray-300 flex justify-between items-center rounded-lg">
          <input
            type="text"
            placeholder="type a message"
            className="w-[90%] border-0 h-full rounded-[6px] focus:outline-none"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
          />
          <button
            onClick={sendNewMessage}
            className="bg-primary h-[60px] overflow-hidden py-2 px-5 rounded-r-lg flex items-center text-white font-semibold"
          >
            <i class="fa-solid fa-play text-xl"></i>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatArea;
