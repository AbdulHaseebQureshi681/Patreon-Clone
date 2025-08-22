"use client";
import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { useAuthStore } from "@/store/dashboardHandler";
import { toast } from "react-hot-toast";
import { Toaster } from "react-hot-toast";
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
  const [preview, setPreview] = useState(null);
  const [imgError, setImgError] = useState(null);
  const [bannerPreview, setBannerPreview] = useState(null);
  const [bannerImgError, setBannerImgError] = useState(null);
  const [isPending,setIsPending] = useState(false);

  useEffect(() => {
    if (!session) {
      router.push("/login");
    }
  }, [session, router]);
  // Revoke previous preview URL on change/unmount
  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
      if (bannerPreview) URL.revokeObjectURL(bannerPreview);
    };
  }, [preview,bannerPreview]);
  const onSubmit = async (data) => {
    if (imgError || bannerImgError) return; // guard when image invalid
    setIsPending(true);
    try {
      await updateDashboard({
        name:data.name,
        email:data.email,
        username:data.username,
        profileImage:data.profileImage,
        bannerImage:data.bannerImage,
        bio:data.bio
      });
       
    } catch (err) {
     toast.error("Profile update failed");
    } finally {
      setIsPending(false);
    }
    reset();
    toast.success("Profile updated successfully");
  };

const handleProfileImageChange = (e) => {
  const file = e.target.files?.[0];
  setImgError(null);
  if (!file) {
    if (preview) { URL.revokeObjectURL(preview); setPreview(null); }
    return;
  }

  // Size check (max 2MB)
  const maxSizeMB = 2;
  if (file.size > maxSizeMB * 1024 * 1024) {
    setImgError(`File too large! Max ${maxSizeMB}MB allowed.`);
    if (preview) { URL.revokeObjectURL(preview); setPreview(null); }
    return;
  }

  // Validate dimensions & ratio
  const objectUrl = URL.createObjectURL(file);
  const img = new Image();
  img.src = objectUrl;

  img.onload = () => {
    const { width, height } = img;
    const ratio = width / height;

    if (Math.abs(ratio - 1) > 0.01) {
      setImgError("Image must be square (1:1 ratio).");
      URL.revokeObjectURL(objectUrl);
      if (preview) { URL.revokeObjectURL(preview); setPreview(null); }
      return;
    }

    if (width < 100 || height < 100) {
      setImgError("Image must be at least 100x100px.");
      URL.revokeObjectURL(objectUrl);
      if (preview) { URL.revokeObjectURL(preview); setPreview(null); }
      return;
    }

    // Passed
    if (preview) URL.revokeObjectURL(preview);
    setPreview(objectUrl);
  };

  img.onerror = () => {
    setImgError("Invalid image file.");
    URL.revokeObjectURL(objectUrl);
    if (preview) { URL.revokeObjectURL(preview); setPreview(null); }
  };
}

const handleBannerImageChange = (e) => {
  const file = e.target.files?.[0];
  setBannerImgError(null);
  if (!file) {
    if (bannerPreview) { URL.revokeObjectURL(bannerPreview); setBannerPreview(null); }
    return;
  }

  // Size check (max 2MB)
  const maxSizeMB = 5;
  if (file.size > maxSizeMB * 1024 * 1024) {
    setBannerImgError(`File too large! Max ${maxSizeMB}MB allowed.`);
    if (bannerPreview) { URL.revokeObjectURL(bannerPreview); setBannerPreview(null); }
    return;
  }

  // Validate dimensions & ratio
  const objectUrl = URL.createObjectURL(file);
  const img = new Image();
  img.src = objectUrl;

  img.onload = () => {
    const { width, height } = img;
    const ratio = width / height;

    if (Math.abs(ratio - 4) > 0.01) {
      setBannerImgError("Image must be 4:1 ratio (e.g. 1200x300).");
      URL.revokeObjectURL(objectUrl);
    
      if (bannerPreview) {
        URL.revokeObjectURL(bannerPreview);
        setBannerPreview(null);
      }
      return;
    }
    // Enforce minimum dimensions
    const minW = 400, minH = 100;
    if (width < minW || height < minH) {
      setBannerImgError(`Image must be at least ${minW}x${minH}px.`);
      URL.revokeObjectURL(objectUrl);
      if (bannerPreview) {
        URL.revokeObjectURL(bannerPreview);
        setBannerPreview(null);
      }
      return;
    }
    


    // Passed
    if (bannerPreview) URL.revokeObjectURL(bannerPreview);
    setBannerPreview(objectUrl);
  };

  img.onerror = () => {
    setBannerImgError("Invalid image file.");
    URL.revokeObjectURL(objectUrl);
    if (bannerPreview) { URL.revokeObjectURL(bannerPreview); setBannerPreview(null); }
  };
}

  return (
    <div className="w-full max-w-3xl mx-auto px-4 py-10">
      <h1 className="text-2xl md:text-3xl font-bold mb-6 flex justify-center items-center">
        Welcome to your dashboard
      </h1>

      <div className="rounded-lg border border-gray-800 bg-gray-900/40 backdrop-blur-sm">
        <form className="p-6 md:p-8 grid gap-5" action="#" onSubmit={handleSubmit(onSubmit)} encType="multipart/form-data">
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
              accept="image/*"
              className="file:mr-4 file:rounded-md file:border-0 file:bg-blue-600 file:px-3 file:py-2 file:text-white file:text-sm file:hover:bg-blue-500 bg-gray-800/60 border border-gray-700 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500"
              {...register("profileImage", { onChange: handleProfileImageChange })}
            />
            <p className="text-red-500">{imgError}</p>
            <p className="text-red-500">{errors.profileImage?.message}</p>
            {preview && (
              <div className="mt-2">
                <img src={preview} alt="Profile preview" className="h-24 w-24 rounded-full object-cover border border-gray-700" />
              </div>
            )}
          </div>

          <div className="grid gap-2">
            <label className="text-sm text-slate-300" htmlFor="bannerImage">
              Banner Image
            </label>
            <input
              id="bannerImage"
              type="file"
              accept="image/*"
              // onChange={handleBannerImageChange}
              className="file:mr-4 file:rounded-md file:border-0 file:bg-blue-600 file:px-3 file:py-2 file:text-white file:text-sm file:hover:bg-blue-500 bg-gray-800/60 border border-gray-700 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500"
              {...register("bannerImage", { onChange: handleBannerImageChange })}
            />
            <p className="text-red-500">{bannerImgError}</p>
            {bannerPreview && (
              <div className="mt-2">
                <img src={bannerPreview} alt="Banner preview" className="h-24 w-full object-cover border border-gray-700" />
              </div>
            )}
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
            type="submit"
            disabled={isPending || !!imgError || !!bannerImgError}
            className={`inline-flex items-center justify-center rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/40 ${(isPending || imgError || bannerImgError) ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            Submit
          </button>
          </div>
        </form>
      </div>
      <Toaster />
    </div>

  );
};

export default Dashboard;
