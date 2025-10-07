import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";

const SignUp = () => {
  const navigate = useNavigate();
  const [data, setData] = useState({
    userName: "",
    email: "",
    password: "",
  });
  const backendUrl=`https://capncut-backend-1.onrender.com`
  // Handles input change
  function handleChange(e) {
    const { name, value } = e.target;
    setData((prev) => ({ ...prev, [name]: value }));
  }

  // Handles form submission
  async function handleSubmit(e) {
    e.preventDefault();
    try {
      const res = await axios.post(`${backendUrl}/signUpData`, data);
      if (res.status === 201) {
        toast.success("Your account has been created successfully.");
        navigate("/login");
      }
    } catch (err) {
      console.error(err);
      if (err.response) {
        if (err.response.status === 400) toast.error("User already exists");
        else if (err.response.status === 500) toast.error("Signup failed");
      } else {
        toast.error("Network error");
      }
    }
    setData({ userName: "", email: "", password: "" });
  }

  return (
    <div className="bg-gradient-to-tl from-white via-blue-100 to-blue-400 min-h-screen flex items-center justify-center px-4">
      <div className="bg-white dark:bg-gray-900 w-full max-w-sm sm:max-w-md md:max-w-lg p-6 sm:p-8 rounded-2xl shadow-lg flex flex-col">
        {/* Header */}
        <div className="text-center mb-6">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-2">
            Create Your Account
          </h2>
          <p className="text-gray-500 dark:text-gray-300 text-sm sm:text-base">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-blue-600 dark:text-blue-400 font-medium hover:underline"
            >
              Login here
            </Link>
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col">
            <label
              htmlFor="userName"
              className="font-medium mb-1 text-gray-700 dark:text-gray-200"
            >
              Username
            </label>
            <input
              id="userName"
              type="text"
              name="userName"
              placeholder="Enter your username"
              value={data.userName}
              onChange={handleChange}
              required
              className="outline-2 outline-gray-300 dark:outline-gray-600 px-4 py-3 rounded-lg font-normal bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-400"
            />
          </div>

          <div className="flex flex-col">
            <label
              htmlFor="email"
              className="font-medium mb-1 text-gray-700 dark:text-gray-200"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              name="email"
              placeholder="Enter your email"
              value={data.email}
              onChange={handleChange}
              required
              className="outline-2 outline-gray-300 dark:outline-gray-600 px-4 py-3 rounded-lg font-normal bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-400"
            />
          </div>

          <div className="flex flex-col">
            <label
              htmlFor="password"
              className="font-medium mb-1 text-gray-700 dark:text-gray-200"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              name="password"
              placeholder="Enter your password"
              value={data.password}
              onChange={handleChange}
              required
              className="outline-2 outline-gray-300 dark:outline-gray-600 px-4 py-3 rounded-lg font-normal bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-400"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 cursor-pointer hover:bg-blue-500 text-white font-semibold py-3 rounded-lg mt-2 shadow-md transition-colors duration-200"
          >
            Sign Up
          </button>
        </form>
      </div>
    </div>
  );
};

export default SignUp;
