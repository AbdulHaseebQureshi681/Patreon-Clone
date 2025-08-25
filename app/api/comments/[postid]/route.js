import connectDb from "@/db/connectDb";
import mongoose from "mongoose";
import Comment from "@/models/Comments";
import { NextResponse } from "next/server";

export const GET = async (req, { params }) => {
    try {
        await connectDb();
        const { postid } = await params || {};
        if (!postid) {
            return NextResponse.json({ error: "postid is required" }, { status: 400 });
        }
        if (!mongoose.Types.ObjectId.isValid(postid)) {
            return NextResponse.json({ error: "Invalid postid" }, { status: 400 });
        }
        const comments = await Comment
        .find({ post: postid, isDeleted: false })
        .populate('user', 'username name profileImage image') // whichever you use
        .populate('parent', '_id comId')
        .lean();
      
      const shaped = comments.map(c => {
        const safeComId = c.comId || String(c._id);
        const parent = c.parent || null;
        const safeParentComId = parent ? (parent.comId || String(parent._id || '')) : null;
        return {
          _id: String(c._id),
          comId: safeComId,
          text: c.text,
          user: c.user ? {
            _id: String(c.user._id),
            name: c.user.username || c.user.name || 'User',
            image: c.user.profileImage || c.user.image || 'https://picsum.photos/200'
          } : null,
          parentComId: safeParentComId || null,
          createdAt: c.createdAt
        };
      });
      
        return NextResponse.json({ comments :shaped }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

