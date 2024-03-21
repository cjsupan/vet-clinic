import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import clientPromise from "../../../database/connection";
import { isEqual } from "lodash";

export const authOptions = {
  providers: [
    CredentialsProvider({
      id: "credentials",
      name: "Credentials",
      credentials: {
        Email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, req) {
        const userDb = await clientPromise;
        const db = userDb.db("vetclinic");
        //check if user exists
        const user = await db.collection("Users").findOne({
          Email: credentials.Email,
          Password: credentials.Password,
        });
        console.log("User", user);
        if (!user) {
          console.log("User not found");
          return null;
        }

        const isPasswordValid =
          user && isEqual(user.Password, credentials.Password);

        if (isPasswordValid === false) {
          throw new Error("Password is incorrect");
        } else {
          return user;
        }
      },
    }),
  ],
  pages: {
    signIn: "/auth/signin",
    signOut: "/auth/signout",
  },
  session: {
    strategy: "jwt",
    maxAge: 8 * 60 * 60,
  },
  callbacks: {
    async jwt({ token, user }) {
      user && (token.user = user);
      return token;
    },
    async session({ session, token }) {
      const user = token.user;
      session.user = user;
      return session;
    },
    async signIn({ user }) {
      return user ? true : false;
    },
    async redirect({ url, baseUrl }) {
      if (url.includes("/login")) {
        return `${baseUrl}/`;
      } else if (new URL(url).origin === baseUrl) {
        return url;
      }
      return baseUrl;
    },
  },
};
export default NextAuth(authOptions);
