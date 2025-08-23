import { NextResponse } from "next/server";
import connectDb from "@/db/connectDb";
import Post from "@/models/Post";
import mongoose from "mongoose";
export const runtime = "nodejs";

export async function POST(_req, { params}) {
  try {
    const body = await _req.json();
    const session = body?.session;
    const userIdRaw = session?.user?.id || session?.user?._id;
    const userId = userIdRaw != null ? String(userIdRaw) : undefined;

    if (!userId) {
      return NextResponse.json({ error: "Missing session.user.id" }, { status: 400 });
    }

    const { postid } = await params || {};
    if (!postid) {
      return NextResponse.json({ error: "postid is required" }, { status: 400 });
    }

    await connectDb();
    const raw = typeof postid === 'string' ? postid : String(postid);
    let decoded = '';
    try {
      decoded = decodeURIComponent(raw).trim();
    } catch (e) {
      return NextResponse.json({ error: "Invalid encoding in postid" }, { status: 400 });
    }

    if (!mongoose.Types.ObjectId.isValid(decoded)) {
      return NextResponse.json({ error: "Invalid postid" }, { status: 400 });
    }

    // Check if already liked BEFORE updating
    const already = await Post.exists({
      _id: decoded,
      $or: [
        { likes: userId },
        { likes: new mongoose.Types.ObjectId(userId) }
      ]
    });
    if (already) {
      const current = await Post.findById(
        decoded,
        {
          title: 1,
          content: 1,
          image: 1,
          user: 1,
          likes: 1,
          comments: 1,
          createdAt: 1,
        }
      ).lean();
      return NextResponse.json({ post: current, alreadyLiked: true, justLiked: false }, { status: 200 });
    }

    const updated = await Post.findByIdAndUpdate(
      decoded,
      { $addToSet: { likes: userId } },
      {
        new: true,
        projection: {
          title: 1,
          content: 1,
          image: 1,
          user: 1,
          likes: 1,
          comments: 1,
          createdAt: 1,
        }
      }
    ).lean();

    if (!updated) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    return NextResponse.json({ post: updated, alreadyLiked: true, justLiked: true }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
