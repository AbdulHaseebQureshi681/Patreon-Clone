import { NextResponse } from "next/server";
import connectDb from "@/db/connectDb";
import mongoose from "mongoose";
import Comment from "@/models/Comments";
export const POST = async (req) => {    
    try {
        await connectDb();
        const { postid, text , parentid ,userid ,comId} = await req.json();
        if (!postid) {
            return NextResponse.json({ error: "postid is required" }, { status: 400 });
        }
        if (!mongoose.Types.ObjectId.isValid(postid)) {
            return NextResponse.json({ error: "Invalid postid" }, { status: 400 });
        }
        if (!userid) {
            return NextResponse.json({ error: "userid is required" }, { status: 400 });
        }
        if (!mongoose.Types.ObjectId.isValid(userid)) {
            return NextResponse.json({ error: "Invalid userid" }, { status: 400 });
        }
        if (!text) {
            return NextResponse.json({ error: "text is required" }, { status: 400 });
        }
       
        const comment = new Comment({
            post:postid,
            user: userid,
            text,
            parent: parentid,
            depth: parentid ? 1 : 0,
            comId: comId,
        });
        await comment.save();
        return NextResponse.json({ comment }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export const DELETE = async (req) => {
    try {
        await connectDb();
        const { commentid } = await req.json();
    
        if (!commentid) {
            return NextResponse.json({ error: "commentid is required" }, { status: 400 });
        }
        if (!mongoose.Types.ObjectId.isValid(commentid)) {
            return NextResponse.json({ error: "Invalid commentid" }, { status: 400 });
        }
        const comment = await Comment.findById(commentid)
        if (!comment) {
            return NextResponse.json({ error: "Comment not found" }, { status: 404 });
        }
        comment.isDeleted = true;
        await comment.save();
        return NextResponse.json({ comment }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
export const PUT = async (req) => {
    try {
        await connectDb();
        const { commentid , text} = await req.json();
        if (!commentid) {
            return NextResponse.json({ error: "commentid is required" }, { status: 400 });
        }
        if (!mongoose.Types.ObjectId.isValid(commentid)) {
            return NextResponse.json({ error: "Invalid commentid" }, { status: 400 });
        }
        const comment = await Comment.findById(commentid);
        if (!comment) {
            return NextResponse.json({ error: "Comment not found" }, { status: 404 });
        }
        comment.text = text;
        await comment.save();
        return NextResponse.json({ comment }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
