import React, { useEffect, useCallback, useState } from "react";
import toast from "react-hot-toast";
import moment from "moment";
import { useSelector, useDispatch } from "react-redux";
import { SendMessage } from "../../../apicalls/messages";
import { ShowLoader, HideLoader } from "../../../redux/loaderSlice";
import { GetMessages } from "../../../apicalls/messages";
import { ClearChatMessages } from "../../../apicalls/chats";
import { setAllChats } from "../../../redux/userSlice";

const ChatArea = ({ socket }) => {
  const dispatch = useDispatch();
  const [newMessage, setNewMessage] = useState("");
  const { selectedChat, user, allChats } = useSelector(
    (state) => state.userReducer
  );
  const [messages = [], setMessages] = useState([]);
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

  const getMessages = useCallback(async () => {
    try {
      dispatch(ShowLoader());
      const response = await GetMessages(selectedChat._id);
      dispatch(HideLoader());

      if (response.success) {
        setMessages(response.data);
      }
    } catch (error) {
      dispatch(HideLoader());
      toast.error(error.message);
    }
  }, [dispatch, selectedChat._id]);

  const clearUnreadMessages = useCallback(async () => {
    try {
      dispatch(ShowLoader());
      const response = await ClearChatMessages(selectedChat._id);
      dispatch(HideLoader());

      if (response.success) {
        const updatedChats = allChats.map((chat) => {
          if (chat._id === selectedChat._id) {
            return response.data;
          }

          return chat;
        });

        dispatch(setAllChats(updatedChats));
      }
    } catch (error) {
      dispatch(HideLoader());
      toast.error(error.message);
    }
  }, [dispatch, allChats, selectedChat?._id]);

  useEffect(() => {
    getMessages();
    if (selectedChat?.lastMessage?.sender !== user?._id) {
      clearUnreadMessages();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedChat]);

  return (
    <div className="bg-white h-full border rounded-2xl w-full flex flex-col justify-between p-5">
      <div>
        <div className="flex gap-5 items-center mb-2">
          {receipentUser?.profilePic && (
            <img
              src={receipentUser?.profilePic}
              alt="User Profile"
              className="w-12 h-10 rounded-full"
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
      <div className="h-[67vh] flex items-center py-3">
        <div className="h-full w-full overflow-y-scroll">
          <div className="flex flex-col gap-2">
            {messages.map((message) => {
              const isCurrentUserIsSender = message.sender === user._id;

              return (
                <div
                  key={message._id}
                  className={`flex ${isCurrentUserIsSender && "justify-end"}`}
                >
                  <div className="flex flex-col">
                    <h2
                      className={`${
                        isCurrentUserIsSender
                          ? "bg-primary text-white rounded-bl-none"
                          : "bg-gray-300 text-gray-800 rounded-tr-none"
                      } py-3 px-5 rounded-xl`}
                    >
                      {message.text}
                    </h2>
                    <h2 className="mt-1 mb-4 ml-[3px] text-gray-500 text-sm">
                      {moment(message.createdAt).format("hh:mm A")}
                    </h2>
                  </div>
                  {isCurrentUserIsSender && (
                    <i
                      className={`fa-solid fa-check text-lg p-1 ${
                        message.read ? "text-green-600" : "text-gray-400"
                      }`}
                    ></i>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
      <div className="bg-white">
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
            <i className="fa-solid fa-play text-xl"></i>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatArea;
