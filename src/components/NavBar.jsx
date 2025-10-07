import React, { use, useEffect, useState } from "react";
import SignUp from "./SignUp";
import { IoMdClose } from "react-icons/io";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { MdOutlineRemoveRedEye } from "react-icons/md";
import { toast } from "react-toastify";
import { AiFillLike } from "react-icons/ai";
import { FaRegComment } from "react-icons/fa";
import { CgProfile } from "react-icons/cg";
import { MdOutlinePostAdd } from "react-icons/md";
import { VscFeedback } from "react-icons/vsc";
import { FaUserEdit } from "react-icons/fa";
import { LuPenLine } from "react-icons/lu";
import { PiNewspaperFill } from "react-icons/pi";
import { ClipLoader } from "react-spinners";
import { GiHamburgerMenu } from "react-icons/gi";
import { IoIosTrendingUp } from "react-icons/io";
import { MdOutlineFileUpload } from "react-icons/md";
import { IoMdAdd } from "react-icons/io";
const NavBar = () => {
  // Navigating to Login page
  const navigate = useNavigate();
  const backendUrl = `https://capncut-backend-1.onrender.com`;
  // formData Managing
  const [formdata, setFormData] = useState(false);
  const [ui, setUi] = useState(false);
  const [userData, setUserData] = useState({
    title: "",
    Description: "",
    image: null,
  });
  const [logout, setLogout] = useState(false);
  const [loading, setLoading] = useState(false);
  const [posts, setPosts] = useState([]);
  const [userId, setUserId] = useState(null);
  const [openReplies, setOpenReplies] = useState({});
  const [isOpen, setIsOpen] = useState(false);
  const [loader, setLoader] = useState(false);
  function managePostData(e) {
    const { name, value } = e.target;
    setUserData((prev) => ({
      ...prev,
      [name]: value,
    }));
  }
  useEffect(() => {
    function checkTokenForLogout() {
      const checkToken = localStorage.getItem("token");
      if (!checkToken) {
        setLogout(false);
      } else {
        setLogout(true);
      }
    }
    checkTokenForLogout();
  }, []);
  useEffect(() => {
    const token = localStorage.getItem("token");
    let userId = null;
    if (token) {
      try {
        const decoded = jwt_decode(token);
        userId = decoded.userId;
        setUserId(userId);
      } catch (e) {
        toast.error(e);
      }
    }
    getPostData(userId);
  }, []);
  async function getPostData(currentUserId) {
    try {
      const res = await axios.get(`${backendUrl}/formData`);

      // map through posts and set likesCount + isLiked
      const postsWithLikes = res.data.map((post) => ({
        ...post,
        isLiked: post.likes?.includes(currentUserId) || false, // check if current user liked
        likesCount: post.likes?.length || 0, // total likes count
        repliesCount: post.replies?.length || 0,
      }));

      setPosts(postsWithLikes);
    } catch (err) {
      console.error(err);
    }
  }
  // toggle replyconst [openReplies, setOpenReplies] = useState({});
  const [replyText, setReplyText] = useState({});

  function handleReplyChange(e, postId) {
    setReplyText((prev) => ({ ...prev, [postId]: e.target.value }));
  }

  function toggleReplies(postId) {
    setOpenReplies((prev) => ({ ...prev, [postId]: !prev[postId] }));
  }

  function handleReplyChange(e, postId) {
    setReplyText((prev) => ({ ...prev, [postId]: e.target.value }));
  }

  async function handleReplySubmit(postId) {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Please login to reply");
      return;
    }
    try {
      const res = await axios.post(
        `${backendUrl}/reply/${postId}`,
        { text: replyText[postId] },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      // update local posts with new reply:
      setPosts((prev) =>
        prev.map((p) =>
          p._id === postId ? { ...p, replies: res.data.replies } : p
        )
      );
      setReplyText((prev) => ({ ...prev, [postId]: "" }));
    } catch (err) {
      console.error(err);
      toast.error("Failed to reply");
    }
  }

  async function handelFormData(e) {
    e.preventDefault();

    // handeling edge cases
    if (!userData.title && userData.Description) {
      return toast.error("please fill the title");
    }
    if (!userData.Description && userData.title) {
      toast.error("please fill the Description");
      return;
    }
    if (!userData.title && !userData.Description) {
      toast.error("please fill the title and Description");
      return;
    }
    // checking token at the time of post
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Please Login First");
      return;
    }
    setLoading(true); // start the loader
    // sending postData to the backend
    try {
      const postDataSending = await axios.post(
        `${backendUrl}/formData`,
        {
          title: userData.title,
          Description: userData.Description,
          image: userData.image,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        }
      );
      setPosts((prev) => [...prev, postDataSending.data]);
      setUserData({ title: "", Description: "", image: null });
      setFormData(false);
      toast.success("Your post has been updated successfully!", {
        className: "p-2 text-[14px] bg-white font-bold ",
      });
    } catch (e) {
      toast.error(e);
    } finally {
      setLoading(true);
    }
  }
  // handel logout of the user
  function handelLogout() {
    const checkTokenOfuser = localStorage.getItem("token");
    if (!checkTokenOfuser) {
      toast.error("Something went Wrong");
    }
    localStorage.removeItem("token");
    toast.success("Logout successfully");
    setLogout(false);
  }
  function goToLoginPage() {
    navigate("/login");
  }
  // handeling postClick
  function handelPostClick() {
    const checkToken = localStorage.getItem("token");
    if (!checkToken) {
      setUi(true);
      // navigate("/login");
      //setFormData(false);
    } else {
      setFormData(true);
    }
  }
  // file handeling (image)
  function handelFileChanges(e) {
    const file = e.target.files[0];
    if (!file) {
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => {
      setUserData((prev) => ({
        ...prev,
        image: reader.result,
      }));
    };
    reader.readAsDataURL(file);
  }
  // handel like functionality
  async function handelLikeChanges(postId) {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Please login to like");
      return;
    }
    try {
      const res = await axios.post(
        `${backendUrl}/like/${postId}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setPosts((prev) =>
        prev.map((p) =>
          p._id === postId
            ? { ...p, likesCount: res.data.likesCount, isLiked: !p.isLiked }
            : p
        )
      );
    } catch (err) {
      if (err.response?.status === 400) {
        toast.info("You already liked this post");
      } else {
        console.error(err);
        toast.error("Something went wrong");
      }
    }
  }

  return (
    <>
      <div>
        <div className=" bg-[#101014] h-30 md:h-23 w-full px-2 py-6 static">
          <div className="flex justify-between items-center px-6 py-4 md:py-3">
            {/* Logo */}

            <button
  onClick={() => setIsOpen(!isOpen)}
  className="
    flex items-center justify-center sm:justify-start
    gap-3 sm:gap-5
    px-5 sm:px-7 py-2.5 sm:py-3
    rounded-[10px]
    bg-[#7895E5] cursor-pointer
    shadow-md shadow-blue-900/30
    border-b-[3px] border-b-white
    transition-all duration-300
    hover:bg-[#6783d9] active:scale-95
    focus:outline-none focus:ring-2 focus:ring-sky-400
  "
>
  <GiHamburgerMenu
    className="text-white mt-0.5 sm:mt-1"
    size={22}
  />
  <h1 className="text-white text-xl sm:text-2xl font-bold hidden sm:block">
    Menu
  </h1>
</button>


            {/* Desktop Menu */}
            <nav className=" md:flex items-center gap-6 text-white font-medium">
              {/* <Link to="/prompt" className=" px-4 py-2 rounded-[10px] flex items-center gap-2 text-white">
               <PiNewspaperFill size={20}/> Prompt
              </Link>
              <Link to="/myPosts" className="text-white px-4 py-2 rounded-[10px] flex items-center gap-2  ">
               <LuPenLine size={20}/> My Posts
              </Link> */}
              <button
  onClick={handelPostClick}
  className="
    flex items-center justify-center sm:justify-start
    gap-2 sm:gap-3
    px-5 sm:px-6 py-2.5 sm:py-3
    rounded-[10px]
    bg-[#7895E5]
    text-white text-lg sm:text-xl md:text-2xl font-bold
    shadow-md shadow-blue-900/30
    border-b-[3px] border-b-white
    transition-all duration-300
    hover:bg-[#6783d9] active:scale-95
    focus:outline-none focus:ring-2 focus:ring-sky-400 cursor-pointer
  "
>
  Submit
</button>

              {/* <Link
                to="/contactUs"
                className="flex items-center gap-2 px-3 py-2 text-white rounded-[8px]  cursor-pointer"
              >
                <VscFeedback size={16} /> Contact us
              </Link> */}
              {/* {logout && (
                <button
                  onClick={handelLogout}
                  className="flex items-center gap-2 px-3 py-2 bg-red-600 hover:bg-red-700 rounded-[8px]  cursor-pointer"
                >
                  <CgProfile size={20} /> Logout
                </button>
              )} */}
            </nav>
            <div
  className={`
    fixed top-5 left-0 
    h-[90vh] sm:h-[92vh] 
    w-[88vw] sm:w-[55vw] md:w-[30vw] lg:w-[22vw]
    rounded-[25px] sm:rounded-[25px] md:rounded-[30px]
    bg-[#0f0f1a]
    flex flex-col gap-6
    transform transition-transform duration-300 ease-in-out
    p-6 sm:p-8
    border border-sky-400/60
    z-50
    ${isOpen ? "translate-x-0" : "-translate-x-full border-none"}
  `}
>
  {/* Close Button */}
  <button
    onClick={() => setIsOpen(!isOpen)}
    className="self-end text-gray-400 hover:text-white transition"
  >
    <IoMdClose size={28} />
  </button>

  {/* Title */}
  <div className="flex justify-between items-center mt-3 mb-2">
    <h1 className="text-white font-bold text-2xl sm:text-[2rem] tracking-wide">
      CapnCut Help
    </h1>
  </div>

  {/* Ask for Help Button */}
  <button
    onClick={handelPostClick}
    className="
      flex items-center justify-center sm:justify-start gap-3 sm:gap-5
      mt-2 px-5 sm:px-6 py-3 sm:py-4 mb-4
      bg-gradient-to-r from-blue-500 to-purple-500
      rounded-[10px]
      text-lg sm:text-xl
      text-white font-bold
      cursor-pointer
      shadow-md shadow-blue-900/30
      transition-all duration-300 hover:scale-[1.02] active:scale-95
    "
  >
    <IoMdAdd size={28} className="sm:size-[32]" />
    <span className="sm:block">Ask For Help</span>
  </button>

  {/* Links */}
  <Link
    to="/prompt"
    className="flex items-center gap-3 px-3 py-2 sm:px-4 sm:py-3 text-white text-base sm:text-[18px] font-bold rounded-[8px] hover:bg-[#1a1a26] transition"
  >
    <PiNewspaperFill size={22} /> Prompt
  </Link>

  <Link
    to="/myPosts"
    className="flex items-center gap-3 px-3 py-2 sm:px-4 sm:py-3 text-white text-base sm:text-[18px] font-bold rounded-[8px] hover:bg-[#1a1a26] transition"
  >
    <LuPenLine size={22} /> My Posts
  </Link>

  <Link
    to="/contactUs"
    className="flex items-center gap-3 px-3 py-2 sm:px-4 sm:py-3 text-white text-base sm:text-[18px] font-bold rounded-[8px] hover:bg-[#1a1a26] transition"
  >
    <VscFeedback size={20} /> Contact Us
  </Link>

  {logout && (
    <button
      onClick={handelLogout}
      className="
        flex items-center gap-3 px-3 py-3 sm:px-4 sm:py-4
        bg-red-600 hover:bg-red-700
        rounded-[8px] text-white text-base sm:text-[18px]
        font-bold mt-3
        transition active:scale-95
      "
    >
      <CgProfile size={22} /> Logout
    </button>
  )}
</div>

            {/* mobile only */}
            {/* Hamburger - Mobile only */}
            {/* <button
              className="md:hidden flex flex-col gap-1.5 p-2 cursor-pointer"
              onClick={() => setIsOpen(!isOpen)}
            >
              <span className="w-6 h-0.5 bg-white rounded"></span>
              <span className="w-6 h-0.5 bg-white rounded"></span>
              <span className="w-6 h-0.5 bg-white rounded"></span>
            </button> */}
          </div>

          {/* Mobile Menu */}
          {/* <div
            className={`fixed top-0 right-0 w-64 h-full bg-[#1e2a5b] shadow-lg p-6 flex flex-col gap-4 transform transition-transform duration-300 ease-in-out
            ${isOpen ? "translate-x-0" : "translate-x-full"} md:hidden z-50`}
           >
            <button
              className="md:hidden flex flex-col gap-1.5 p-1"
              onClick={() => setIsOpen(!isOpen)}
            >
              <IoMdClose
                className=" bg-[#ff0000] text-white rounded-[2px] cursor-pointer"
                size={20}
              ></IoMdClose>
            </button>
            <Link
              to="/prompt"
              className=" px-4 py-2 rounded-[8px] text-white flex items-center gap-2  font-medium">
                <PiNewspaperFill size={20}/> Prompt
            </Link>
            <Link
              to="/myPosts"
              className="text-white flex items-center gap-2 px-4 py-2 rounded-[8px]"
            >
              <LuPenLine size={20}/> My Posts
            </Link>
            <button
              onClick={handelPostClick}
             className="flex items-center gap-2 px-4 py-2 rounded-[8px]  cursor-pointer text-white font-bold"
            >
              <MdOutlinePostAdd size={20} /> Post
            </button>
            <Link
              to="/contactUs"
              className="flex items-center gap-2 px-3 py-2 rounded-[8px]  text-white cursor-pointer"
            >
              <VscFeedback size={16} /> Contact us
            </Link>
            {logout && (
              <button
                onClick={handelLogout}
                className="flex items-center gap-2 px-3 py-2 bg-red-600 hover:bg-red-700 rounded-[8px]  text-white cursor-pointer"
              >
                <CgProfile size={20} /> Logout
              </button>
            )}
          </div> */}

          {ui && (
            <div className="fixed inset-0  flex justify-center items-center z-50 p-4">
              <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg w-full max-w-sm sm:max-w-md p-6 sm:p-8 flex flex-col items-center">
                {/* Heading */}
                <h1 className="text-center text-red-600 dark:text-red-400 font-bold text-lg sm:text-xl mb-4">
                  Please Login to Post Your Ideas and Suggestions!
                </h1>

                {/* Info Icon (optional) */}
                <div className="mb-4 flex justify-center">
                  <svg
                    className="w-12 h-12 text-red-400 dark:text-red-500"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    ></path>
                  </svg>
                </div>

                {/* Buttons */}
                <div className="flex flex-col  sm:flex-row justify-between gap-4 w-full mt-2">
                  <button
                    onClick={goToLoginPage}
                    className="bg-blue-600 hover:bg-blue-500 cursor-pointer text-white font-medium rounded-lg py-2 px-4 sm:py-3 w-full sm:w-auto transition-all duration-200 shadow-md"
                  >
                    Login
                  </button>
                  <button
                    onClick={() => setUi(false)}
                    className="bg-gray-300 dark:bg-gray-700 cursor-pointer hover:bg-gray-400 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 font-medium rounded-lg py-2 px-4 sm:py-3 w-full sm:w-auto transition-all duration-200 shadow-md"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}
          {formdata === true && (
            <div className="fixed inset-0 flex justify-center  overflow-y-hidden items-center z-[999] bg-black/50 p-7">
              <div
                className=" bg-[#131319] md:p-8 text-white font-medium shadow-md rounded-[12px] 
                 max-w-[800px] h-[90vh] max-h-[95vh] p-6 overflow-y-auto
                 sm:w-[80vw] sm:h-auto sm:max-h-[100vh] sm:p-4 border-1 border-zinc-600"
              >
                {/* Header */}
                <div className="flex justify-between items-center mb-4">
                  <h1 className="font-bold text-[22px] sm:text-[20px] md:text-[25px] lg:text-[33px]">
                    Ask For Help
                  </h1>
                  <button onClick={() => setFormData(false)}>
                    <IoMdClose
                      className="text-red-600 cursor-pointer hover:text-rose-800"
                      size={25}
                    />
                  </button>
                </div>
                <hr className="mb-4 border-gray-600" />

                {/* Form */}
                <form className="flex flex-col gap-4" onSubmit={handelFormData}>
                  {/* Title */}
                  <div className="flex flex-col gap-1">
                    <label className="text-gray-200 font-medium text-sm sm:text-[14px] md:text-[18px]">
                      What effect are you trying to create?
                    </label>
                    <input
                      type="text"
                      name="title"
                      value={userData.title}
                      onChange={managePostData}
                      placeholder="eg. How to make that Tom AI effect like in TikTok"
                      className="w-full p-3 rounded-[6px] border-1 bg-gray-800 border-gray-600 text-white placeholder:text-gray-400 outline-none  md:text-[15px] sm:text-[14px]"
                    />
                  </div>

                  {/* Description */}
                  <div className="flex flex-col gap-1">
                    <label className="text-gray-200 font-medium text-sm sm:text-[14px] md:text-[18px]">
                      Describe what you saw
                    </label>
                    <textarea
                      name="Description"
                      value={userData.Description}
                      onChange={managePostData}
                      placeholder="I saw this amazing TikTok where..."
                      className="w-full p-3 h-[17vh]  sm:h-[20vh] rounded-[6px] font-medium  border-1 bg-gray-800 border-gray-600 text-white placeholder:text-gray-400 resize-none outline-none  md:text-[15px] sm:text-[14px]"
                    />
                  </div>

                  {/* File Upload */}
                  <div className="flex flex-col gap-2 w-full">
                    <label className="text-gray-200 font-medium text-sm sm:text-[14px] md:text-[18px]">
                      Upload Reference (Optional)
                    </label>

                    <div className="flex flex-col justify-center items-center border-dotted border-zinc-600 border-2 rounded-[10px] py-6 px-3 transition-all duration-300 hover:border-sky-400 hover:bg-[#111]">
                      <MdOutlineFileUpload
                        size={35}
                        color="blue"
                        className="mb-3"
                      />
                      <input
                        type="file"
                        onChange={handelFileChanges}
                        className="text-gray-300 text-sm sm:text-base bg-[#0f0f1a] border border-zinc-700 rounded-md px-2 py-2 w-[90%] sm:w-[80%] md:w-[60%] cursor-pointer file:cursor-pointer file:mr-3 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-sky-600 file:text-white hover:file:bg-sky-500 transition"
                      />
                    </div>
                  </div>

                  {/* community guidelines */}
                  <div className="text-zinc-500">
                    <h2 className="text-[20px] font-bold  text-[#2b06d4]">
                      Community Guidelines
                    </h2>
                    <p className="text-[15px] leading-relaxed text-gray-600 font-medium text-justify">
                      Please keep this community safe and respectful. Do not
                      share vulgar content, hate speech, or abusive language.
                      Any spam, illegal, or harmful posts may be removed and
                      accounts may be suspended.
                    </p>
                  </div>
                  {/* Buttons */}
                  <div className="flex flex-col sm:flex-row justify-between md:gap-10 gap-3 mt-2">
                    <button
                      type="submit"
                      className="w-full sm:w-1/2 bg p-3 rounded-[6px] cursor-pointer bg-linear-to-r from-blue-500 to-purple-500 font-bold  text-white text-[18px]"
                    >
                      {loading ? "Posting..." : "Post"}
                    </button>
                    <button
                      type="button"
                      onClick={() => setFormData(false)}
                      className="w-full sm:w-1/2 bg-red-700 hover:bg-red-600 p-3 rounded-[6px] cursor-pointer text-white text-[16px] font-bold"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
        {/* // content section */}
        <div className="bg-[#101014] w-full min-h-screen">
         <div className="flex flex-col items-center justify-center py-10 sm:py-12 px-4 sm:px-6 md:px-10 text-center">
  {/* Icon + Title */}
  <div className="flex flex-wrap justify-center items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
    <IoIosTrendingUp
      size={38}
      className="text-[#7895E5] sm:size-[45px] md:size-[55px]"
    />
    <h1 className="text-white text-3xl sm:text-4xl md:text-5xl font-semibold leading-tight">
      Trending This Week
    </h1>
  </div>

  {/* Subtitle */}
  <h2 className="text-gray-400 font-medium text-base sm:text-[17px] md:text-[20px] max-w-[90%] sm:max-w-[70%] md:max-w-[60%]">
    Popular effects everyone's asking about
  </h2>
</div>


          <div className="flex gap-4 overflow-x-auto px-4 sm:px-6 py-3 scrollbar-hide">
            {[
              { img: "card-1.jpg", title: "Anime AI effects", views: "2.1M" },
              { img: "card-2.jpg", title: "Prompt Elevation", views: "6.1M" },
              {
                img: "card-3.jpg",
                title: "Dynamic Overlay Mastery",
                views: "4.1M",
              },
              { img: "card-4.jpg", title: "Focus in Motion", views: "5.1M" },
              { img: "card-5.jpg", title: "Floating Aura", views: "3.1M" },
              { img: "card-6.png", title: "Visual Abstraction", views: "2.1M" },
              { img: "card-7.png", title: "Volumetric Text", views: "4.5M" },
              { img: "card-8.jpg", title: "Typographic", views: "3.2M" },
            ].map((card, i) => (
              <div
                key={i}
                className="cards flex-shrink-0 relative rounded-[15px] cursor-pointer transform transition-transform duration-300 hover:-translate-y-2
                   w-[80vw] sm:w-[40vw] md:w-[20vw] h-[50vh] sm:h-[55vh] md:h-[55vh]"
              >
                <img
                  src={card.img}
                  className="object-cover w-full h-full rounded-[13px]"
                  alt={card.title}
                />
                <div className="absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-black/70 via-transparent to-transparent rounded-b-[13px]">
                  <h1 className="text-gray-100 font-bold text-[16px] sm:text-[17px] md:text-[17px] leading-tight">
                    {card.title}
                  </h1>
                  <div className="flex gap-2 items-center text-zinc-400 text-sm sm:text-[14px] md:text-[14px]">
                    <MdOutlineRemoveRedEye size={20} />
                    <span>{card.views} views</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      {posts.length === 0 ? (
        <div className=" bg-[#101014] flex justify-center items-center">
          <ClipLoader size={50} color="blue" />
        </div>
      ) : (
        <>
          <div className="min-h-screen bg-[#101014] w-full">
            <div className="latest-questions flex flex-col items-center justify-center mb-5">
              <h1 className="md:text-6xl text-white font-medium mb-1 -mt-20 text-3xl ">
                Latest Questions
              </h1>
              <h2 className="text-gray-400 font-medium md:text-[17px]">
                Find tutorials for the latest editing effects
              </h2>
            </div>
            <div className="flex flex-col items-center justify-center md:p-10 p-2">
              {posts.map((post, i) => (
                <div
                  key={post._id || i}
                  className="flex flex-col bg-[#1a1a24] min-h-60 rounded-xl p-5 md:p-7 shadow-md mb-7 w-full md:w-[60%]"
                >
                  <div className="flex items-center gap-2">
                    <FaUserEdit
                      className="text-[#3651ff] font-bold"
                      size={22}
                    />
                    <h2 className="text-[#7e7d7b] md:text-[18px] font-medium mb-1 text-[19.2px]">
                      {post.user?.userName}
                    </h2>
                  </div>

                  <h1 className="text-white font-medium text-[19.5px] md:text-[x-large] mb-3">
                    {post.title}
                  </h1>
                  <p className="text-[#b4a6a6] mb-2 text-justify font-medium md:text-[18px] text-[15.2px]">
                    {post.Description}
                  </p>
                  {post.image && (
                    <>
                      <img
                        src={post.image}
                        alt="post"
                        className="object-cover rounded-[12px] w-full"
                      ></img>
                    </>
                  )}
                  <div className="flex items-center justify-between gap-3 mt-3">
                    {/* like button */}
                    <button
                      onClick={() => handelLikeChanges(post._id)}
                      className={`text-xl transition-colors duration-200 gap-2 ${
                        post.isLiked
                          ? "text-[#0025ff]"
                          : "text-gray-200 hover:text-sky-100"
                      }`}
                    >
                      <div className="flex items-center gap-[2px] bg-[#02a0ef] px-3 py-2 rounded-[20px] transform transition-transform cursor-pointer duration-300 hover:-translate-y-1">
                        <h1 className="text-[16.5px] font-bold">
                          {post.likesCount || 0}
                        </h1>
                        <AiFillLike className="font-bold " />
                      </div>
                    </button>

                    {/* reply toggle button */}
                    <button
                      onClick={() => toggleReplies(post._id)}
                      className="bg-gray-600 px-4 py-2 rounded-[18px] text-white hover:bg-gray-500 flex gap-1 cursor-pointer "
                    >
                      <FaRegComment className="mt-1" />
                      <h1 className="text-white font-medium text-[16px]">
                        {post.replies?.length || 0} helps
                      </h1>
                    </button>
                  </div>
                  {openReplies[post._id] && (
                    <div className="mt-3 transition-all duration-300 ">
                      {/* existing replies list */}
                      {post.replies && post.replies.length > 0 && (
                        <div className="mb-2">
                          {post.replies.map((r, idx) => (
                            <div key={idx} className="text-gray-300 mb-1">
                              <span className="font-medium">
                                {r.user?.userName || "User"}:
                              </span>{" "}
                              {r.text}
                            </div>
                          ))}
                        </div>
                      )}

                      {/* reply input */}
                      <div className="flex gap-2">
                        <input
                          type="text"
                          placeholder="Write a reply..."
                          value={replyText?.[post._id] || ""}
                          onChange={(e) => handleReplyChange(e, post._id)}
                          className="flex-1 flex p-3 rounded-[6px] bg-gray-700 text-white outline-none"
                          required
                        />
                        <button
                          onClick={() => handleReplySubmit(post._id)}
                          className="bg-blue-700 px-5  rounded-[6px] cursor-pointer text-[16px] font-medium text-white  hover:bg-blue-600"
                        >
                          Post
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default NavBar;
