import React from "react";
import moment from "moment";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { CreateNewChat } from "../../../apicalls/chats";
import { setAllChats, setSelectedChat } from "../../../redux/userSlice";
import { ShowLoader, HideLoader } from "../../../redux/loaderSlice";

const UsersList = ({ searchKey }) => {
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
            {moment(chat?.lastMessage?.createdAt).format("hh:mm A")}
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

  return (
    <div className="flex flex-col gap-3 mt-5 w-96">
      {getData().map((chatObjOrUserObj) => {
        let userObj = chatObjOrUserObj;

        if (chatObjOrUserObj.members) {
          userObj = chatObjOrUserObj.members.find(
            (member) => member._id !== user._id
          );
        }

        return (
          <div
            key={userObj._id}
            className={`shadow-sm border rounded-2xl bg-white flex justify-between items-center cursor-pointer w-full ${
              getIsSelectedChatOrNot(userObj) && "border-primary border-2"
            }`}
            onClick={() => openChat(userObj._id)}
          >
            <div className="flex justify-center items-center w-full m-2">
              <div className="w-14 h-12 bg-white flex items-center justify-center">
                {userObj?.profilePic && (
                  <img
                    src={userObj?.profilePic}
                    alt="User Profile"
                    className="w-full h-full rounded-full object-cover"
                  />
                )}
                {!userObj?.profilePic && (
                  <div className="bg-gray-500 w-full h-full object-cover rounded-full flex items-center justify-center">
                    <h2 className="uppercase text-white text-2xl font-semibold">
                      {userObj?.name[0]}
                    </h2>
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
                chat.members.map((member) => member._id).includes(userObj._id)
              ) && (
                <button
                  onClick={() => createNewChat(userObj._id)}
                  className="border border-primary text-primary bg-white px-3 py-1 rounded-md mr-2"
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
