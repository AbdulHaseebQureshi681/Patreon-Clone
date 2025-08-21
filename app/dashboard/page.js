"use client";
import React, { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { useAuthStore } from "@/store/dashboardHandler";
const Dashboard = () => {
  const { data: session } = useSession();
  const {dashUser,error,updateDashboard} = useAuthStore();
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm(
    {
      defaultValues:{
        name:session?.user?.name,
        email:session?.user?.email,
        username:session?.user?.username,
        profileImage:session?.user?.profileImage,
        bannerImage:session?.user?.bannerImage,
        bio:session?.user?.bio
      }
    }
  );
  useEffect(() => {
    if (!session) {
      router.push("/login");
    }
  }, [session, router]);
  const onSubmit = (data) => {
    try {
      updateDashboard({
        name:data.name,
        email:data.email,
        username:data.username,
        profileImage:"",
        bannerImage:"",
        bio:data.bio
      });
      console.log(dashUser);
    } catch (err) {
      console.log(error);
    }
    reset();
  };

  return (
    <div className="w-full max-w-3xl mx-auto px-4 py-10">
      <h1 className="text-2xl md:text-3xl font-bold mb-6 flex justify-center items-center">
        Welcome to your dashboard
      </h1>

      <div className="rounded-lg border border-gray-800 bg-gray-900/40 backdrop-blur-sm">
        <form className="p-6 md:p-8 grid gap-5" action="#">
          <div className="grid gap-2">
            <label className="text-sm text-slate-300" htmlFor="name">
              Name
            </label>
            <input
              id="name"
              type="text"
              placeholder="Your name"
              className="bg-gray-800/60 border border-gray-700 rounded-md px-3 py-2 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500"
              {...register("name", {
                required: { value: true, message: "Name is required" },
                maxLength: {
                  value: 100,
                  message: "Name must be at most 100 characters long",
                },
              })}
            />
            <p className="text-red-500">{errors.name?.message}</p>
          </div>

          <div className="grid gap-2">
            <label className="text-sm text-slate-300" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              type="email"
              placeholder="you@example.com"
              className="bg-gray-800/60 border border-gray-700 rounded-md px-3 py-2 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500"
              {...register("email", {
                required: { value: true, message: "Email is required" },
                pattern: {
                  value: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
                  message: "Invalid email address",
                },
              })}
            />
            <p className="text-red-500">{errors.email?.message}</p>
          </div>

          <div className="grid gap-2">
            <label className="text-sm text-slate-300" htmlFor="username">
              Username
            </label>
            <input
              id="username"
              type="text"
              placeholder="@username"
              className="bg-gray-800/60 border border-gray-700 rounded-md px-3 py-2 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500"
              {...register("username", {
                required: { value: true, message: "Username is required" },
                maxLength: {
                  value: 100,
                  message: "Username must be at most 100 characters long",
                },
                minLength: {
                  value: 3,
                  message: "Username must be at least 3 characters long",
                },
              })}
            />
            <p className="text-red-500">{errors.username?.message}</p>
          </div>

          <div className="grid gap-2">
            <label className="text-sm text-slate-300" htmlFor="profileImage">
              Profile Image
            </label>
            <input
              id="profileImage"
              type="file"
              className="file:mr-4 file:rounded-md file:border-0 file:bg-blue-600 file:px-3 file:py-2 file:text-white file:text-sm file:hover:bg-blue-500 bg-gray-800/60 border border-gray-700 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500"
              {...register("profileImage")}
            />
            <p className="text-red-500">{errors.profileImage?.message}</p>
          </div>

          <div className="grid gap-2">
            <label className="text-sm text-slate-300" htmlFor="bannerImage">
              Banner Image
            </label>
            <input
              id="bannerImage"
              type="file"
              className="file:mr-4 file:rounded-md file:border-0 file:bg-blue-600 file:px-3 file:py-2 file:text-white file:text-sm file:hover:bg-blue-500 bg-gray-800/60 border border-gray-700 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500"
              {...register("bannerImage")}
            />
            <p className="text-red-500">{errors.bannerImage?.message}</p>
          </div>

          <div className="grid gap-2">
            <label className="text-sm text-slate-300" htmlFor="bio">
              Bio
            </label>
            <textarea
              id="bio"
              rows={5}
              placeholder="Tell something about yourself..."
              className="bg-gray-800/60 border border-gray-700 rounded-md px-3 py-2 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500"
              {...register("bio", {
                required: { value: true, message: "Bio is required" },
                maxLength: {
                  value: 1000,
                  message: "Bio must be at most 1000 characters long",
                },
                minLength: {
                  value: 10,
                  message: "Bio must be at least 10 characters long",
                },
              })}
            />
            <p className="text-red-500">{errors.bio?.message}</p>
          </div>

          <div className="pt-2">
            <button
            onClick={handleSubmit(onSubmit)}
              type="submit"
              className="inline-flex items-center justify-center rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/40"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Dashboard;
