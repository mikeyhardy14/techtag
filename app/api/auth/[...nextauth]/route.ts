// app/api/auth/[...nextauth]/route.ts
import NextAuth from "next-auth";
import GitHubProvider from "next-auth/providers/github";

export const authOptions = {
  // whatever providers you need:
  providers: [
    GitHubProvider({
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!,
    }),
    // …add more providers here
  ],

  // IMPORTANT: set NEXTAUTH_SECRET in your env
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);

// App Router requires you export both GET and POST
export { handler as GET, handler as POST };
