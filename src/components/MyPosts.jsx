import React, { useEffect, useState } from "react";
import axios from "axios";

const MyPosts = () => {
  const [posts, setPosts] = useState([]);
  const token = localStorage.getItem("token");
   const backendUrl=`https://capncut-backend-1.onrender.com`
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await axios.get(`${backendUrl}/myPosts`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setPosts(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchPosts();
  }, [token]);

  return (
    <div className="min-h-screen flex flex-col p-10 md:p-7 bg-[#101034]">
      <h1 className="text-white mb-4 md:mb-2 text-[41px] font-medium">My Posts</h1>
      <div className="border-b-2 border-zinc-400 mb-8"></div>
      {posts.length === 0 ? (
        <h2 className="text-white text-xl">No posts yet.</h2>
      ) : (
        posts.map((post) => (
          <div
            key={post._id}
            className="flex flex-col gap-2 mb-6 items-center justify-center"
          >
            <div className="bg-blue-700 py-7 px-7 w-[80vw]  md:w-[90vw]   rounded-[5px] shadow-md text-white">
              <h3 className="font-medium text-[25px] mb-2">{post.title}</h3>
              <p className="mt-1 text-gray-200 text-justify">{post.Description}</p>
            </div>
            {post.image && (
              <img
                src={post.image}
                alt={post.title}
                className="w-full max-h-64 object-cover rounded mt-2"
              />
            )}
          </div>
        ))
      )}
    </div>
  );
};

export default MyPosts;
