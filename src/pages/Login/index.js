import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { LoginUser } from "../../apicalls/users";
import { ShowLoader, HideLoader } from "../../redux/loaderSlice";

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [user, setUser] = useState({
    email: "",
    password: "",
  });

  const login = async (e) => {
    try {
      dispatch(ShowLoader());
      const response = await LoginUser(user);
      dispatch(HideLoader());
      if (response.success) {
        toast.success(response.message);
        localStorage.setItem("token", response.data);
        setTimeout(() => {
          window.location.href = "/";
        }, 3000);
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      dispatch(HideLoader());
      toast.error(error.message);
    }
  };

  useEffect(() => {
    if (localStorage.getItem("token")) {
      navigate("/");
    }
  }, [navigate]);

  return (
    <div className="h-screen bg-primary flex items-center justify-center">
      <div className="bg-white shadow-md lg:p-7 p-5 m-2 flex flex-col gap-5 w-96 rounded-[42px]">
        <h2 className="sm:text-2xl text-md font-semibold flex items-center uppercase text-primary justify-center">
          Shechat - Login
          <span className="ml-4 bg-blue-500 p-2 rounded-full">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="#fff"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9"
              />
            </svg>
          </span>
        </h2>
        <hr />
        <input
          type="text"
          value={user.email}
          onChange={(e) => setUser({ ...user, email: e.target.value })}
          placeholder="Email"
        />
        <input
          type="password"
          value={user.password}
          onChange={(e) => setUser({ ...user, password: e.target.value })}
          placeholder="Password"
        />
        <button className="contained-btn" onClick={login}>
          Login
        </button>
        <div className="flex items-center justify-center sm:flex-row flex-col">
          <p className="text-gray-500">Don't have an account yet?</p>
          <Link
            to="/register"
            className="ml-1 underline text-blue-500 font-semibold"
          >
            Register
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
