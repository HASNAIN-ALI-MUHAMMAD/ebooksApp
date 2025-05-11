import NextAuth from "next-auth"
import GithubProvider from "next-auth/providers/github"
import GoogleProvider from "next-auth/providers/google"
import { connectMongo } from "./app/api/lib/mongoose"
import CredentialsProvider from "next-auth/providers/credentials"
import User from "./app/api/lib/collections/User";
export const authOptions = {
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
    }),
    GoogleProvider({
        clientId:process.env.GOOGLE_CLIENT_ID,
        clientSecret:process.env.GOOGLE_CLIENT_SECRET
    }),
        CredentialsProvider({
        name: "Credentials",
        credentials: {},
        async authorize(credentials) {
          return null;
        },
      }),
  ],
  session:{
    strategy:'jwt'
  },
  pages:{
    signIn:'/login',
    error:'/login/error'
  },
  secret: process.env.NEXTAUTH_SECRET,
  callbacks:{
    async jwt({token,account,profile,isNewUser}){
      if (account) {
        await connectMongo();
        let user;
        console.log("profile",profile);

        if(account.provider) {
          user = await User.findOne({email:profile.email});
          if(!user){
            user = await User.create({
              email: profile.email,
              provider:account.provider,
              verified:true

            })
          }
          token.accessToken = account.access_token;
          token.id = user._id.toString();
        }
    }
    return token;
  },
  async session({session,token}){
    session.user.id = token.id;
    session.accessToken = token.accessToken;
    return session;
  },

    async redirect({ url, baseUrl }) {
      return url.startsWith(baseUrl) ? url : baseUrl;
    },


  
}
}