import { NextResponse } from "next/server";
import connectDb from "@/db/connectDb";
import Post from "@/models/Post";
import User from "@/models/User";

export const runtime = "nodejs";

export async function GET(_req, { params }) {
  try {
    const { username } = await params || {};
    if (!username) {
      return NextResponse.json({ error: "username is required" }, { status: 400 });
    }

    await connectDb();
    const decoded = decodeURIComponent(username || '').trim();
    const escaped = decoded.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    // Resolve username to the user's ObjectId first
    const user = await User.findOne(
      { username: { $regex: `^${escaped}$`, $options: 'i' } },
      { _id: 1 }
    ).lean();

    if (!user) {
      // Return empty posts array if user doesn't exist
      return NextResponse.json({ posts: [] }, { status: 200 });
    }

    const posts = await Post.find(
      { user: user._id },
      {
        title: 1,
        content: 1,
        image: 1,
        user: 1,
        likes: 1,
        comments: 1,
        createdAt: 1,
      }
    ).lean().sort({ createdAt: -1 });

    return NextResponse.json({ posts }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
