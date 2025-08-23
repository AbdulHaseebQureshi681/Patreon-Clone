import { NextResponse } from "next/server";
import connectDb from "@/db/connectDb";
import Post from "@/models/Post";
import { validateAndReencodeImage, uploadToImgBB } from "@/utils/imageuploading";
export const POST = async (req) => {

    try {
        await connectDb();
        const form = await req.formData();
        const title = form.get('title') || undefined;
        const content = form.get('content') || undefined;
        const image = form.get('image') || undefined;
        const user = form.get('user') || undefined;
 if (!title || !content || !image || !user) {
                return NextResponse.json({ error: "All fields are required" }, { status: 400 });
            }
    
            // Handle optional image uploads
            let profileImageUrl;
            const profileFile = form.get('image');
    
            try {
                if (profileFile && typeof profileFile === 'object' && profileFile.size > 0) {
                    const processed = await validateAndReencodeImage(profileFile, profileFile.name || 'profile');
                    profileImageUrl = await uploadToImgBB(processed, profileFile.name || 'profile');
                }
                
            } catch (e) {
                console.error('Image upload failed:', e.message);
            }

            const obj = {
                title,
                content,
                image: profileImageUrl,
                user
            }
        const post = await Post.create(obj);
        return NextResponse.json({ post, message: "Post created successfully" }, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}