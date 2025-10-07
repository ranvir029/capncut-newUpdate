import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { IoIosArrowRoundBack } from "react-icons/io";

const Login = () => {
  const navigate = useNavigate();
   const backendUrl=`https://capncut-backend-1.onrender.com`
  const [data, setFormData] = useState({
    email: "",
    password: "",
  });

  // Handle input change
  function handelFormChange(e) {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  // Handle back button
  function handelBack() {
    navigate("/");
  }

  // Handle login
  async function handelLogin(e) {
    e.preventDefault();

    if (!data.email && !data.password) {
      toast.error("Please enter your email and password");
      return;
    }
    if (!data.email) {
      toast.error("Please enter your email");
      return;
    }
    if (!data.password) {
      toast.error("Please enter your password");
      return;
    }

    try {
      const LoginData = await axios.post(`${backendUrl}/loginData`, {
        email: data.email,
        password: data.password,
      });
      localStorage.setItem("token", LoginData.data.token);
      toast.success(LoginData.data.message, {
        className: "p-2 text-[14px] bg-white font-medium",
      });
      navigate("/");
    } catch (err) {
      const msg = err.response?.data?.message || "Network error";
      toast.error(msg);
    }
  }

  return (
    <div className="bg-gradient-to-tl from-blue-200 via-blue-100 to-blue-400 min-h-screen relative flex flex-col">
      {/* Back Button */}
      <button
        onClick={handelBack}
        className="absolute top-4 left-4 flex items-center bg-white px-3 cursor-pointer sm:px-4 py-2 rounded-xl shadow-md hover:shadow-lg transition-shadow"
      >
        <IoIosArrowRoundBack size={25} className="text-blue-600" />
        <span className="text-blue-600 font-semibold ml-1">Back</span>
      </button>

      {/* Login Form Container */}
      <div className="flex justify-center items-center flex-1 px-4">
        <div className="bg-white dark:bg-gray-900 shadow-lg w-full max-w-sm sm:max-w-md md:max-w-lg p-6 sm:p-8 rounded-2xl flex flex-col">
          {/* Header */}
          <div className="flex flex-col items-center mb-6">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-2 text-center">
              Welcome Back!
            </h2>
            <p className="text-gray-500 dark:text-gray-300 text-center text-sm sm:text-base">
              We missed you! Please enter your details
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handelLogin} className="flex flex-col gap-4">
            <div className="flex flex-col">
              <label htmlFor="email" className="mb-1 font-medium text-gray-700 dark:text-gray-200">
                Email
              </label>
              <input
                id="email"
                type="email"
                name="email"
                placeholder="Enter Your Email"
                value={data.email}
                onChange={handelFormChange}
                className="outline-2 outline-gray-300 dark:outline-gray-600 px-4 py-2 rounded-lg font-normal bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-400"
              />
            </div>

            <div className="flex flex-col">
              <label htmlFor="password" className="mb-1 font-medium text-gray-700 dark:text-gray-200">
                Password
              </label>
              <input
                id="password"
                type="password"
                name="password"
                placeholder="Enter Password"
                value={data.password}
                onChange={handelFormChange}
                className="outline-2 outline-gray-300 dark:outline-gray-600 px-4 py-2 rounded-lg font-normal bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-400"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-500 cursor-pointer text-white font-semibold py-3 rounded-lg mt-2 transition-colors duration-200 shadow-md"
            >
              Sign In
            </button>
          </form>

          {/* Signup Link */}
          <p className="text-gray-500 dark:text-gray-300 text-center mt-4 text-sm sm:text-base">
            Don't have an account?{" "}
            <Link to="/signup" className="text-blue-600 dark:text-blue-400 font-medium hover:underline">
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
