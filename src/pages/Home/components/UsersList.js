import React, { useEffect } from "react";
import moment from "moment";
import toast from "react-hot-toast";
import store from "../../../redux/store";
import { useDispatch, useSelector } from "react-redux";
import { CreateNewChat } from "../../../apicalls/chats";
import { setAllChats, setSelectedChat } from "../../../redux/userSlice";
import { ShowLoader, HideLoader } from "../../../redux/loaderSlice";

const UsersList = ({ searchKey, socket, onlineUsers }) => {
  const { allUsers, allChats, user, selectedChat } = useSelector(
    (state) => state.userReducer
  );
  const dispatch = useDispatch();

  const createNewChat = async (receipentUserId) => {
    try {
      dispatch(ShowLoader());
      const response = await CreateNewChat([user?._id, receipentUserId]);
      dispatch(HideLoader());
      if (response.success) {
        toast.success(response.message);
        const newChat = response?.data;
        const updatedChats = [...allChats, newChat];
        dispatch(setAllChats(updatedChats));
        dispatch(setSelectedChat(newChat));
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      dispatch(HideLoader());
      toast.error(error.message);
    }
  };

  const openChat = (receipentUserId) => {
    const chat = allChats.find(
      (chat) =>
        chat.members.map((member) => member._id).includes(user._id) &&
        chat.members.map((member) => member._id).includes(receipentUserId)
    );

    if (chat) {
      dispatch(setSelectedChat(chat));
    }
  };

  const getData = () => {
    // if searchKey is empty return all chats, else return filtered chats and users
    if (searchKey === "") {
      return allChats;
    }

    return allUsers.filter((user) =>
      user.name.toLowerCase().includes(searchKey.toLowerCase())
    );
  };

  const getIsSelectedChatOrNot = (userObj) => {
    if (selectedChat) {
      return selectedChat.members
        .map((member) => member._id)
        .includes(userObj._id);
    }

    return false;
  };

  const getDateInRegularFormat = (date) => {
    let result = "";
    // if date is today return time
    if (moment(date).isSame(moment(), "day")) {
      result = moment(date).format("hh:mm");
    }
    // if date is yesterday return yesterday and time
    else if (moment(date).isSame(moment().subtract(1, "day"), "day")) {
      result = `Yesterday ${moment(date).format("hh:mm")}`;
    }
    // if date is this year return date and time
    else if (moment(date).isSame(moment(), "year")) {
      result = moment(date).format("MMM DD hh:mm");
    }

    return result;
  };

  const getLastMessage = (userObj) => {
    const chat = allChats.find((chat) =>
      chat.members.map((member) => member._id).includes(userObj._id)
    );
    if (!chat || !chat.lastMessage) {
      return "";
    } else {
      const lastMessagePerson =
        chat?.lastMessage?.sender === user?._id ? "You: " : "";
      return (
        <div className="flex justify-between items-center w-full">
          <h2 className="text-gray-600 text-sm mr-2">
            {lastMessagePerson} {chat?.lastMessage?.text}
          </h2>
          <p className="text-gray-400 text-sm mt-[5px]">
            {getDateInRegularFormat(chat?.lastMessage?.createdAt)}
          </p>
        </div>
      );
    }
  };

  const getUnreadMessages = (userObj) => {
    const chat = allChats.find((chat) =>
      chat.members.map((member) => member._id).includes(userObj._id)
    );

    if (chat && chat.unreadMessages && chat.lastMessage.sender !== user._id) {
      return (
        <div className="bg-blue-500 text-white text-xs rounded-full w-5 h-5 px-2 py-1 flex items-center justify-center">
          <h3 className="font-semibold">{chat?.unreadMessages}</h3>
        </div>
      );
    }
  };

  useEffect(() => {
    socket.on("receive-message", (message) => {
      // if the chat area opened is not equal to chat in message, then increase unread messages by 1 and update last message
      const tempSelectedChat = store.getState().userReducer.selectedChat;
      let tempAllChats = store.getState().userReducer.allChats;

      if (tempSelectedChat?._id !== message.chat) {
        const updatedAllChats = tempAllChats.map((chat) => {
          if (chat._id === message.chat) {
            return {
              ...chat,
              unreadMessages: (chat?.unreadMessages || 0) + 1,
              lastMessage: message,
              updatedAt: message.createdAt,
            };
          }

          return chat;
        });

        tempAllChats = updatedAllChats;
      }

      // always latest message chat will be on top
      const latestChat = tempAllChats.find((chat) => chat._id === message.chat);
      const otherChats = tempAllChats.filter(
        (chat) => chat._id !== message.chat
      );

      tempAllChats = [latestChat, ...otherChats];
      console.log(tempAllChats);
      dispatch(setAllChats(tempAllChats));
    });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="flex flex-col gap-3 mt-5 w-full">
      {getData().map((chatObjOrUserObj) => {
        let userObj = chatObjOrUserObj;

        if (chatObjOrUserObj?.members) {
          userObj = chatObjOrUserObj?.members.find(
            (member) => member?._id !== user?._id
          );
        }

        return (
          <div
            key={userObj?._id}
            className={`shadow-sm border rounded-2xl bg-white flex justify-between items-center cursor-pointer w-full p-3 ${
              getIsSelectedChatOrNot(userObj) && "border-primary border-2"
            }`}
            onClick={() => openChat(userObj?._id)}
          >
            <div className="flex justify-center items-center w-full">
              <div className="w-14 h-12 bg-white flex items-center justify-center relative">
                {userObj?.profilePic && (
                  <img
                    src={userObj?.profilePic}
                    alt="User Profile"
                    className="w-full h-full rounded-full object-cover"
                  />
                )}
                {!userObj?.profilePic && (
                  <div className="bg-gray-400 w-12 h-full object-cover rounded-full flex items-center justify-center">
                    <h2 className="uppercase text-white text-2xl font-semibold">
                      {userObj?.name[0]}
                    </h2>
                    {onlineUsers.includes(userObj?._id) && (
                      <div>
                        <div className="bg-green-300 w-3 h-3 rounded-full absolute bottom-[1px] right-1"></div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div className="flex flex-col w-full ml-2">
                <div className="flex justify-between">
                  <h2>{userObj?.name}</h2>
                  {getUnreadMessages(userObj)}
                </div>
                {getLastMessage(userObj)}
              </div>
            </div>
            <div>
              {!allChats.find((chat) =>
                chat.members.map((member) => member?._id).includes(userObj?._id)
              ) && (
                <button
                  onClick={() => createNewChat(userObj?._id)}
                  className="border border-primary text-primary bg-white px-3 py-1 rounded-md"
                >
                  Message
                </button>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default UsersList;
