import { NextResponse } from "next/server";
import connectDb from "@/db/connectDb";
import Post from "@/models/Post";
import mongoose from "mongoose";

export const runtime = "nodejs";

export async function GET(_req, { params }) {
  try {
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

    const post = await Post.findById(
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

    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    return NextResponse.json({ post }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
