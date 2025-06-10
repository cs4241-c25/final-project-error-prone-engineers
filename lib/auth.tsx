import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { MongoClient } from "mongodb";
import { MongoDBAdapter } from "@next-auth/mongodb-adapter";
import bcrypt from "bcrypt";

const client = new MongoClient(process.env.MONGO_URI!);
const clientPromise = client.connect();

export const authOptions: NextAuthOptions = {
    adapter: MongoDBAdapter(clientPromise),
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        }),
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) return null;

                const db = (await clientPromise).db("freedom-trail");
                const user = await db.collection("users").findOne({ email: credentials.email });

                if (!user || !user.password) return null;

                const isValid = await bcrypt.compare(credentials.password, user.password);
                if (!isValid) return null;

                return {
                    id: user._id.toString(),
                    email: user.email,
                    name: user.name || credentials.email.split("@")[0],
                    role: user.role || "user",
                };
            },
        }),
    ],
    secret: process.env.NEXTAUTH_SECRET,
    session: {
        strategy: "jwt",
        maxAge: 2 * 24 * 60 * 60,
    },
    callbacks: {
        async signIn({ account, user }) {
            const db = (await clientPromise).db("freedom-trail");

            if (account?.provider === "google") {
                const existingUser = await db.collection("users").findOne({ email: user.email });

                if (existingUser) {
                    if (!existingUser.role) {
                        await db.collection("users").updateOne(
                            { email: user.email },
                            { $set: { role: "user" } }
                        );
                    }

                    await db.collection("accounts").updateOne(
                        {
                            provider: "google",
                            providerAccountId: account.providerAccountId,
                        },
                        {
                            $set: {
                                userId: existingUser._id,
                                type: "oauth",
                                provider: "google",
                                providerAccountId: account.providerAccountId,
                                access_token: account.access_token,
                                id_token: account.id_token,
                                token_type: account.token_type,
                                scope: account.scope,
                                expires_at: account.expires_at,
                            },
                        },
                        { upsert: true }
                    );
                }
            }

            return true;
        },

        async jwt({ token, user }) {
            if (user) {
                token.name = user.name;
                token.email = user.email;
                token.role = (user as any).role;
            }

            if (!token.role && token.email) {
                const db = (await clientPromise).db("freedom-trail");
                const dbUser = await db.collection("users").findOne({ email: token.email });
                if (dbUser) token.role = dbUser.role || "user";
            }

            return token;
        },

        async session({ session, token }) {
            if (token) {
                session.user = {
                    name: token.name || "Unknown",
                    email: token.email!,
                    role: token.role || "user",
                };
            }
            return session;
        },

        async redirect({ baseUrl }) {
            return baseUrl;
        },
    },
    events: {
        async createUser({ user }) {
            const db = (await clientPromise).db("freedom-trail");

            const existing = await db.collection("users").findOne({ email: user.email });
            if (existing && !existing.role) {
                await db.collection("users").updateOne(
                    { email: user.email },
                    { $set: { role: "user" } }
                );
            }
        },
    },
};
