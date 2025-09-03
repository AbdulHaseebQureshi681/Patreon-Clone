import { NextResponse } from "next/server";
import connectDb from "@/db/connectDb";
import User from "@/models/User";

export const runtime = "nodejs";

export async function GET() {
  try {
    await connectDb();
    const users = await User.find({},
      {
        _id: 1, // Include _id for unique keys
        username: 1,
        name: 1,
        profileImage: 1  
      }
    ).lean();
    
    if (!users || users.length === 0) {
      return NextResponse.json({ error: "Users not found" }, { status: 404 });
    }
    
    return NextResponse.json({ users }, { status: 200 }); // Return as 'users' array
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
