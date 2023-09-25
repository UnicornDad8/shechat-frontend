import React, { useEffect, useCallback } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { GetAllUsers, GetCurrentUser } from "../apicalls/users";
import { ShowLoader, HideLoader } from "../redux/loaderSlice";
import { setUser, setAllUsers } from "../redux/userSlice";
import logo from "../images/logo.png";

const ProtectedRoute = ({ children }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.userReducer);

  const getCurrentUser = useCallback(async () => {
    try {
      dispatch(ShowLoader());
      const response = await GetCurrentUser();
      const allUsersResponse = await GetAllUsers();
      dispatch(HideLoader());
      if (response.success) {
        dispatch(setUser(response.data));
        dispatch(setAllUsers(allUsersResponse.data));
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      dispatch(HideLoader());
      toast.error(error.message);
    }
  }, [dispatch]);

  useEffect(() => {
    if (localStorage.getItem("token")) {
      getCurrentUser();
    }

    if (!localStorage.getItem("token")) {
      navigate("/login");
    }
  }, [getCurrentUser, navigate]);

  return (
    <div className="h-screen w-screen bg-gray-100">
      <div className="flex justify-between px-5 py-2 bg-blue-500">
        <div className="w-auto h-10 flex items-center">
          <img className="w-full h-full object-cover" src={logo} alt="logo" />
        </div>
        <div className="flex items-center">
          <h2 className="underline text-white text-md">
            <i className="fa-solid fa-user mr-2"></i>
            {user?.name}
          </h2>
          <i
            onClick={() => {
              localStorage.removeItem("token");
              navigate("/login");
            }}
            className="fa-solid fa-right-from-bracket ml-5 text-white cursor-pointer"
          ></i>
        </div>
      </div>

      <div className="p-5">{children}</div>
    </div>
  );
};

export default ProtectedRoute;
