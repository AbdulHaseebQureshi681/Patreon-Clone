import User from "@/models/User";
import { NextResponse } from "next/server";
import connectDb from "@/db/connectDb";

export async function POST(req) {
    const { name, email, username, profileImage, bannerImage, bio } = await req.json();
    if (!email) {
        return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }
    try {
        await connectDb();
        const update = {};
        if (name !== undefined) update.name = name;
        if (username !== undefined) update.username = username;
        if (profileImage !== undefined) update.profileImage = profileImage;
        if (bannerImage !== undefined) update.bannerImage = bannerImage;
        if (bio !== undefined) update.bio = bio;

        const user = await User.findOneAndUpdate(
            { email },
            { $set: update },
            { new: true }
        );
        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }
        return NextResponse.json({ user, message: "User updated successfully" }, { status: 200 });
    } catch (error) {
        if (error?.code === 11000) {
            const field = Object.keys(error.keyValue || {})[0] || 'field';
            return NextResponse.json({ error: `${field} already exists` }, { status: 409 });
        }
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}