import { NextResponse } from "next/server";
import connectDb from "@/db/connectDb";
import mongoose from "mongoose";
import Comment from "@/models/Comments";
import { useSession } from "next-auth/react";
export const POST = async (req) => {
    const {data: session} = useSession();
    try {
        await connectDb();
        const {postid, text , parentid} = await req.body;
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

        const comment = new Comment({
            post: decoded,
            user: session?.user?.id || session?.user?._id || session?.user?.sub,
            text,
            parent: parentid,
            depth: parentid ? 1 : 0,
        });
        await comment.save();
        return NextResponse.json({ comment }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}