"use client";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
import { useSession } from "next-auth/react";
import { useAuthStore } from "@/store/dashboardHandler";
import { toast } from "react-hot-toast";
import { Toaster } from "react-hot-toast";
const Upload = () => {
    const [filePreview, setFilePreview] = useState(null);
    const { data: session } = useSession();
    const { register, handleSubmit, formState: { errors }, reset } = useForm(
      {
      defaultValues: {
        title: '',
        content: '',
        file: null,
      }
    }
    );
    const { uploadPost } = useAuthStore();
    const onSubmit = async ( data) => {
        const { title, content, file } = data;
        const user = session?.user?._id;
        try {
         await uploadPost({ title, content, image: file, user });
        } catch (error) {
          console.log(error);
        }
        reset();
        toast.success("Post uploaded successfully");
        setFilePreview(null);
    }
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
          const reader = new FileReader();
          reader.onload = (e) => {
            setFilePreview(e.target.result);
          };
          reader.readAsDataURL(file);
        }
      };
  return (
    <div className="min-h-[calc(100vh-4rem)] w-full bg-gradient-to-br from-[#0b0225] via-[#070512] to-[#02010a] flex items-center justify-center px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        whileHover={{ y: -2 }}
        className="text-white w-full max-w-xl rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl shadow-[0_20px_80px_-20px_rgba(124,58,237,0.35)]"
      >
        <div className="relative overflow-hidden rounded-2xl">
          <div className="pointer-events-none absolute inset-0 opacity-30 [background:radial-gradient(1200px_400px_at_50%_-10%,rgba(124,58,237,0.25),transparent_60%)]" />
          <div className="px-8 pt-8">
            <motion.h1
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-2xl font-semibold tracking-tight"
            >
              Create Post
            </motion.h1>
            <p className="mt-1 text-sm text-white/60">
              Share something awesome with your followers.
            </p>
          </div>

          <motion.form
            onSubmit={handleSubmit(onSubmit)}
            className="px-8 pb-8 pt-6 flex flex-col gap-4"
            initial="hidden"
            animate="show"
            variants={{
              hidden: { opacity: 0 },
              show: { opacity: 1, transition: { staggerChildren: 0.06 } },
            }}
          >
            <motion.div
              variants={{
                hidden: { y: 8, opacity: 0 },
                show: { y: 0, opacity: 1 },
              }}
              className="space-y-2"
            >
              <label htmlFor="title" className="text-sm text-white/70">
                Title
              </label>
              <input
                id="title"
                type="text"
                placeholder="Give your post a catchy title"
                className="w-full rounded-lg border border-white/15 bg-white/5 px-4 py-2.5 text-white placeholder:text-white/40 outline-none transition focus:border-purple-400/60 focus:ring-2 focus:ring-purple-500/30 hover:border-white/25"
                {...register("title")}
                              />
            </motion.div>

            <motion.div
              variants={{
                hidden: { y: 8, opacity: 0 },
                show: { y: 0, opacity: 1 },
              }}
              className="space-y-2"
            >
              <label htmlFor="content" className="text-sm text-white/70">
                Content
              </label>
              <textarea
                id="content"
                rows={4}
                placeholder="Write what's on your mind..."
                className="w-full resize-y rounded-lg border border-white/15 bg-white/5 px-4 py-3 text-white placeholder:text-white/40 outline-none transition focus:border-blue-400/60 focus:ring-2 focus:ring-blue-500/30 hover:border-white/25"
                {...register("content")}
                              />
            </motion.div>

            <motion.div
              variants={{
                hidden: { y: 8, opacity: 0 },
                show: { y: 0, opacity: 1 },
              }}
              className="space-y-2"
            >
              <label htmlFor="file" className="text-sm text-white/70">
                Attachment
              </label>
              <label
                htmlFor="file"
                className="group flex cursor-pointer items-center justify-between gap-3 rounded-lg border border-dashed border-white/20 bg-white/5 px-4 py-3 transition hover:border-white/35 hover:bg-white/[0.08]"
              >
                <div className="flex items-center gap-3">
                  <div className="grid h-9 w-9 place-items-center rounded-md bg-gradient-to-br from-purple-600/70 to-blue-500/70 text-white shadow-inner shadow-black/20 transition group-hover:from-purple-500 group-hover:to-blue-400">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="h-5 w-5"
                    >
                      <path d="M12 16a4 4 0 0 0 0-8h-1a5 5 0 0 0 0 10h6a3 3 0 0 0 0-6h-1" />
                    </svg>
                  </div>
                  <div className="text-sm">
                    <p className="font-medium">Click to upload</p>
                    <p className="text-white/50">PNG, JPG, GIF up to 10MB</p>
                  </div>
                </div>
                <span className="rounded-md bg-white/10 px-2 py-1 text-xs text-white/80 transition group-hover:bg-white/20">
                  Browse
                </span>
              </label>
              <input id="file" type="file" className="hidden"{...register("file", { onChange: handleFileChange })} />
              {filePreview && (
              <div className="mt-2">
                <img src={filePreview} alt="Banner preview" className="h-24 w-full object-cover border border-gray-700" />
              </div>
            )}
            </motion.div>

            <motion.div
              variants={{
                hidden: { y: 8, opacity: 0 },
                show: { y: 0, opacity: 1 },
              }}
              className="pt-2"
            >
              <motion.button
                type="submit"
                whileHover={{
                  scale: 1.02,
                  boxShadow: "0 12px 40px -12px rgba(59,130,246,0.45)",
                }}
                whileTap={{ scale: 0.98 }}
                onMouseMove={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  const x = ((e.clientX - rect.left) / rect.width) * 100;
                  const y = ((e.clientY - rect.top) / rect.height) * 100;
                  e.currentTarget.style.setProperty("--x", `${x}%`);
                  e.currentTarget.style.setProperty("--y", `${y}%`);
                }}
                className="group relative inline-flex w-full items-center justify-center gap-2 overflow-hidden rounded-lg bg-gradient-to-r from-purple-600 to-blue-500 px-5 py-3 text-sm font-medium text-white shadow-lg transition focus:outline-none focus:ring-2 focus:ring-blue-500/40 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <span className="pointer-events-none absolute inset-0 z-0 bg-[radial-gradient(120px_80px_at_var(--x)_var(--y),rgba(255,255,255,0.25),transparent_70%)] opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                Post
              </motion.button>
            </motion.div>
          </motion.form>
        </div>
      </motion.div>
      <Toaster />
    </div>
  );
};

export default Upload;
