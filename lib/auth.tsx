import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { MongoClient } from "mongodb";
import { MongoDBAdapter } from "@next-auth/mongodb-adapter";
import GoogleProvider from 'next-auth/providers/google'
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
                if (!credentials?.email || !credentials?.password) {
                    throw new Error("Missing credentials");
                }

                const db = (await clientPromise).db("freedom-trail");
                const user = await db.collection("users").findOne({ email: credentials.email });

                if (!user || !(await bcrypt.compare(credentials.password, user.password))) return null;

                return {
                    id: user._id.toString(),
                    email: user.email,
                    name: user.name || credentials.email.split("@")[0],
                };
            },
        }),
    ],
    secret: process.env.NEXTAUTH_SECRET,
    session: {
        strategy: "jwt",
        maxAge: 24 * 60 * 60,
    },
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.name = user.name;
                token.email = user.email;
            }
            return token;
        },
        async session({ session, token }) {
            if (token) {
                session.user = session.user || {};
                session.user.name = token.name || "Unknown User";
                session.user.email = token.email || "";
            }
            return session;
        },
        async redirect({ url, baseUrl }) {
            return baseUrl;
        }
    }
};
