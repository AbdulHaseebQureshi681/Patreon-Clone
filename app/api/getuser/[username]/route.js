import { NextResponse } from "next/server";
import connectDb from "@/db/connectDb";
import User from "@/models/User";

export const runtime = "nodejs";

export async function GET(_req, { params }) {
  try {
    const { username } = params || {};
    if (!username) {
      return NextResponse.json({ error: "username is required" }, { status: 400 });
    }

    await connectDb();
    const decoded = decodeURIComponent(username || '').trim();
    const escaped = decoded.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const user = await User.findOne(
      { username: { $regex: `^${escaped}$`, $options: 'i' } },
      {
        _id: 0,
        username: 1,
        name: 1,
        bio: 1,
        profileImage: 1,
        bannerImage: 1,
        email: 1,
      }
    ).lean();

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ user }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
