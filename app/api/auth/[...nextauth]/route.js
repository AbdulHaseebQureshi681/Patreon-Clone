import NextAuth from 'next-auth'
import GitHubProvider from 'next-auth/providers/github'
import GoogleProvider from 'next-auth/providers/google'
import User from '@/models/User'
import connectDb from '@/db/connectDb'
export const authOptions= NextAuth({
  providers: [
    // OAuth authentication providers...
    GitHubProvider({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET
    }),
    GoogleProvider(
      {
        clientId: process.env.GOOGLE_ID,
        clientSecret: process.env.GOOGLE_SECRET
      }
    )


  ],
callbacks: {
  async signIn({ user, account, profile, email, credentials }) {
    if (account.provider === "github") {
      try {
        await connectDb();
        const currentUser = await User.findOne({ email: user.email });
        const providerImage = user?.image || profile?.avatar_url || "";
        if (!currentUser) {
          await User.create({
            email: user.email,
            username: user.email.split("@")[0],
            profileImage: providerImage,
          });
        } else if (!currentUser.profileImage && providerImage) {
          currentUser.profileImage = providerImage;
          await currentUser.save();
        }
      } catch (err) {
        console.error('signIn callback error:', err);
        return false; 
      }
    }
    if(account.provider === "google") {
      try {
        await connectDb();
        const currentUser = await User.findOne({ email: user.email });
        const providerImage = user?.image || profile?.avatar_url || "";
        if (!currentUser) {
          await User.create({
            email: user.email,
            username: user.email.split("@")[0],
            profileImage: providerImage,
          });
        } else if (!currentUser.profileImage && providerImage) {
          currentUser.profileImage = providerImage;
          await currentUser.save();
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
    if (currentUser) {
      session.user.username = currentUser.username;
      session.user.profileImage = currentUser.profileImage;
      session.user.bannerImage = currentUser.bannerImage;
      session.user.bio = currentUser.bio;
      session.user._id = currentUser._id;
      session.user.image = currentUser.profileImage || session.user.image;
    }
    return session
  }
}
})
export {authOptions as GET, authOptions as POST}