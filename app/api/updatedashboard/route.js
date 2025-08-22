import User from "@/models/User";
import { NextResponse } from "next/server";
import connectDb from "@/db/connectDb";
import { validateAndReencodeImage, uploadToImgBB } from "@/utils/imageuploading";

export const runtime = 'nodejs';

export async function POST(req) {
    try {
        const form = await req.formData();
        const name = form.get('name') || undefined;
        const email = form.get('email') || undefined;
        const username = form.get('username') || undefined;
        const bio = form.get('bio') || undefined;

        if (!email) {
            return NextResponse.json({ error: "Email is required" }, { status: 400 });
        }

        // Handle optional image uploads
        let profileImageUrl;
        let bannerImageUrl;
        const profileFile = form.get('profileImage');
        const bannerFile = form.get('bannerImage');

        try {
            if (profileFile && typeof profileFile === 'object' && profileFile.size > 0) {
                const processed = await validateAndReencodeImage(profileFile, profileFile.name || 'profile');
                profileImageUrl = await uploadToImgBB(processed, profileFile.name || 'profile');
            }
        } catch (e) {
            console.error('Profile image upload failed:', e.message);
        }

        try {
            if (bannerFile && typeof bannerFile === 'object' && bannerFile.size > 0) {
                const processed = await validateAndReencodeImage(bannerFile, bannerFile.name || 'banner');
                bannerImageUrl = await uploadToImgBB(processed, bannerFile.name || 'banner');
            }
        } catch (e) {
            console.error('Banner image upload failed:', e.message);
        }

        await connectDb();
        const update = {};
        if (name !== undefined) update.name = name;
        if (username !== undefined) update.username = username;
        if (typeof profileImageUrl === 'string') update.profileImage = profileImageUrl;
        if (typeof bannerImageUrl === 'string') update.bannerImage = bannerImageUrl;
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