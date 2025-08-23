import NextAuth from 'next-auth'
import GitHubProvider from 'next-auth/providers/github'
import User from '@/models/User'
import connectDb from '@/db/connectDb'
export const authOptions= NextAuth({
  providers: [
    // OAuth authentication providers...
    GitHubProvider({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET
    }),

  ],
callbacks: {
  async signIn({ user, account, profile, email, credentials }) {
    if (account.provider === "github") {
      try {
        await connectDb();
        const currentUser = await User.findOne({ email: user.email });
        if (!currentUser) {
          const newUser = await User.create({
            email: user.email,
            username: user.email.split("@")[0],
          });
          
        } 
      } catch (err) {
        console.error('signIn callback error:', err);
        return false; 
      }
    }
    return true; 
  },
  async session({ session}) {
    await connectDb();
    const currentUser = await User.findOne({ email: session.user.email });
    session.user.username = currentUser.username;
    session.user.profileImage = currentUser.profileImage;
    session.user.bannerImage = currentUser.bannerImage;
    session.user.bio = currentUser.bio;
    session.user._id = currentUser._id;
    return session
  }
}
})
export {authOptions as GET, authOptions as POST}