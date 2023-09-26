import React from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { CreateNewChat } from "../../../apicalls/chats";
import { setAllChats, setSelectedChat } from "../../../redux/userSlice";
import { ShowLoader, HideLoader } from "../../../redux/loaderSlice";

const UsersList = ({ searchKey }) => {
  const { allUsers, allChats, user } = useSelector(
    (state) => state.userReducer
  );
  const dispatch = useDispatch();

  const createNewChat = async (receipentUserId) => {
    try {
      dispatch(ShowLoader());
      const response = await CreateNewChat([user._id, receipentUserId]);
      dispatch(HideLoader());
      if (response.success) {
        toast.success(response.message);
        const newChat = response.data;
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
        chat.members.includes(user._id) &&
        chat.members.includes(receipentUserId)
    );

    if (chat) {
      dispatch(setSelectedChat(chat));
    }
  };

  return (
    <div className="flex flex-col gap-3 mt-5">
      {allUsers
        .filter(
          (userObj) =>
            (userObj?.name?.toLowerCase().includes(searchKey?.toLowerCase()) &&
              searchKey) ||
            allChats.some((chat) => chat.members.includes(userObj._id))
        )
        .map((userObj) => {
          return (
            <div
              key={userObj._id}
              className="shadow-sm border p-5 rounded-2xl bg-white flex justify-between items-center"
              onClick={() => openChat(userObj._id)}
            >
              <div className="flex gap-5 items-center">
                {userObj?.profilePic && (
                  <img
                    src={userObj?.profilePic}
                    alt="User Profile"
                    className="w-10 h-10 rounded-full"
                  />
                )}
                {!userObj?.profilePic && (
                  <div className="bg-gray-500 rounded-full w-10 h-10 flex items-center justify-center">
                    <h2 className="uppercase text-white text-2xl font-semibold">
                      {userObj?.name[0]}
                    </h2>
                  </div>
                )}
                <h2>{userObj?.name}</h2>
              </div>
              <div>
                {!allChats.find((chat) =>
                  chat.members.includes(userObj._id)
                ) && (
                  <button
                    onClick={() => createNewChat(userObj._id)}
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
