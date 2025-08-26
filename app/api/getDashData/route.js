import { NextResponse } from "next/server";
import connectDb from "@/db/connectDb";
import User from "@/models/User";

export async function GET(req) {
    try {
        await connectDb();
        const email = req.nextUrl.searchParams.get('email');
        
        if (!email) {
            return NextResponse.json({ error: "Email is required" }, { status: 400 });
        }

        const user = await User.findOne({ email }, {
            _id: 0,
            email: 1,
            name: 1,
            username: 1,
            profileImage: 1,
            bannerImage: 1,
            bio: 1
        }).lean();

        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        return NextResponse.json({ user });
    } catch (error) {
        console.error('Error fetching user:', error);
        return NextResponse.json({ error: "Failed to fetch user data" }, { status: 500 });
    }
}