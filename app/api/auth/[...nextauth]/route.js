import NextAuth from "next-auth"
import GitHubProvider from "next-auth/providers/github"
import GoogleProvider from "next-auth/providers/google"
import User from "@/models/User"
import connectDb from "@/db/connectDb"
import { StreamChat } from "stream-chat"

const handler = NextAuth({
  providers: [
    GitHubProvider({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_SECRET,
    }),
  ],
  
 
  callbacks: {
    async signIn({ user, account, profile }) {
      try {
        await connectDb()
        let currentUser = await User.findOne({ email: user.email })
        const providerImage = user?.image || profile?.avatar_url || ""
        // creating user token
        if (!currentUser) {
          const newUser = await User.create({
            email: user.email,
            username: user.email.split("@")[0],
            profileImage: providerImage,
          })
          currentUser = newUser
        } else if (!currentUser.profileImage && providerImage) {
          currentUser.profileImage = providerImage
          await currentUser.save()
        }
        const chatClient = StreamChat.getInstance(process.env.STREAM_KEY, process.env.STREAM_SECRET);
        const token = chatClient.createToken(currentUser._id.toString());
        user.streamChatToken = token;
        user._id = currentUser._id.toString(); // Convert ObjectId to string
      } catch (err) {
        console.error("signIn callback error:", err)
        return false
      }
      return user
    },
    async jwt({ token, user }) {
      if (user) {
        token.streamChatToken = user.streamChatToken;
        token.uid = user._id;
      }
      return token;
    },
    async session({ session, token }) {
      await connectDb()
      session.user._id = token.uid;
      session.user.id = token.uid; // Set the 'id' field for client-side consumption
      const currentUser = await User.findOne({ email: session.user.email })

      if (currentUser) {
        session.user.name = currentUser.name || session.user.name
        session.user.username = currentUser.username
        session.user.profileImage = currentUser.profileImage
        session.user.bannerImage = currentUser.bannerImage
        session.user.bio = currentUser.bio
        session.user.image = currentUser.profileImage || session.user.image
      }
      session.user.streamChatToken = token.streamChatToken || null;
      return session
    },
    async updateUser({ user, session }) {
      await connectDb()
      const currentUser = await User.findOne({ email: session.user.email })

      if (currentUser) {
        currentUser.name = user.name
        currentUser.email = user.email
        currentUser.username = user.username
        currentUser.profileImage = user.profileImage
        currentUser.bannerImage = user.bannerImage
        currentUser.bio = user.bio
        await currentUser.save()
      }
    }
  }
})

export { handler as GET, handler as POST }
