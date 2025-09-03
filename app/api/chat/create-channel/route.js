import { getServerSession } from "next-auth/next";
import { NextResponse } from "next/server";
import { StreamChat } from "stream-chat";
import { authOptions } from "../../auth/[...nextauth]/route";

export async function POST(request) {
    try {
    const session = await getServerSession(authOptions);

        if (!session || !session.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { channelType = "messaging", channelId, channelName, members = [], channelData = {} } =
            await request.json();

        const chatClient = StreamChat.getInstance(
            process.env.STREAM_KEY,
            process.env.STREAM_SECRET
        );

        // Ensure members is array of strings (user ids)
        const memberIds = Array.isArray(members) ? members.filter(id => typeof id === "string") : [];
        const userId = session.user.id || session.user.uid || session.user._id;
        if (!userId || typeof userId !== "string") {
            return NextResponse.json({ error: "Invalid session user id" }, { status: 400 });
        }

        const allMembers = Array.from(new Set([userId, ...memberIds]));

        const channel = chatClient.channel(channelType, channelId, {
            name: channelName,
            created_by_id: userId,
            members: allMembers,
            // Add permission settings for the channel
            permissions: {
                // Allow all members to read, write, and manage the channel
                'user': ['read-channel', 'send-message', 'upload-file'],
            },
            ...channelData,
        });

        await channel.create();
        
        // Explicitly add members to ensure they have proper access
        if (allMembers.length > 1) {
            await channel.addMembers(allMembers, {
                hide_history: false, // Allow members to see message history
            });
        }

        return NextResponse.json({
            success: true,
            channelId: channel.id,
            channelType,
            message: "Channel created successfully",
        });
    } catch (error) {
        console.error("Error creating channel:", error);
        return NextResponse.json(
            {
                error: "Failed to create channel",
                details: error?.message ?? String(error),
            },
            { status: 500 }
        );
    }
}
