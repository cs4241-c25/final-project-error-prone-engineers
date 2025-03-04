'use client';
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import  {signIn} from "next-auth/react";
import Image from "next/image";
import Banner from "@/components/Banner";

const Login = () => {
    // Initialize the username and password state as blank
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const [error, setError] = useState('');
    //Initialize the router
    const router = useRouter();

    async function handleGoogleLogin(e: React.FormEvent){
        e.preventDefault();
        try {
            const response = await signIn('google', {callbackUrl: "/"})
            console.log("Sign-in response:", response)
        } catch (error){
            console.error("Google login failed:", error);
        }
    }

    // Handle the login
    async function handleLogin(e: React.FormEvent){
        e.preventDefault();

        const res = await signIn("credentials", {
            email,
            password,
            redirect: false,
        });

        if (res?.error) {
            setError("Invalid Credentials");
        } else {
            console.log("Welcome: " + email)
            router.push("/");
        }
    }

    // Handle the navigation to register page
    async function handleRegisterNavigation(e: React.FormEvent){
        e.preventDefault();
        console.log('Navigating to registration form.');
        router.push('/register');
    }

    return (
    <div>
        <Banner></Banner>
      <div className="flex items-center justify-center min-h-screen bg-cover bg-center bg-[url('/freedomtrail_medallion.jpg')] lg:h-screen lg:overflow-hidden lg:w-screen sm:h-screen sm:overflow-hidden sm:w-screen" >
      <div className="bg-white p-5 rounded-3xl max-w-full lg:w-2/5 sm:w-4/5 sm:h-4/5 justify-center items-center">
        <h2 className="bg-blue-900 p-2 rounded-md text-6xl font-bold text-center text-white mb-6 font-cinzel_decorative">Sign in</h2>

            <form onSubmit={handleLogin} className="flex flex-col">
                <label className="text-blue-900 font-garamond text-4xl font-extrabold mb-2">Email:</label>
                <input
                    type="email"
                    placeholder=""
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full p-3 rounded-full bg-[#2F1000] bg-opacity-50 text-white focus:outline-none mb-4"
                    required
                />

                <label className="text-blue-900 font-garamond text-4xl font-extrabold mb-2">Password:</label>
                <input
                    type="password"
                    placeholder=""
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full p-3 rounded-full bg-[#2F1000] bg-opacity-50 text-white focus:outline-none mb-6"
                    required
                />
                {error && (
                    <p className="text-red-500 font-semibold text-lg mb-4 text-center">
                        {error}
                    </p>
                )}
                {/* Login Button */}
                <button type="submit"
                        className="bg-blue-900 mb-4 text-white p-2 rounded-full text-2xl font-semibold font-garamond hover:bg-blue-800 transition">
                    Start your tour
                </button>

                <hr className="mb-4"></hr>

              {/* Google Sign-In Button */}
              <button
                  type="button"  // <-- This prevents form submission
                  onClick={handleGoogleLogin} // <-- Calls Google Sign-In function
                  className="flex items-center justify-center bg-[#dcedff] hover:bg-[#b7d3f0] text-black p-2 rounded-full shadow-md"
              >
                  <img src="google.png" alt="Google Logo" className="w-6 h-6 mr-2"/>
                  Sign in with Google
              </button>
            
                      {/* Forgot Password */}
            <p className="text-center text-blue-900 font-garamond text-xl font-semibold mt-4">
                <a href="/forgot-password" className="underline">Forgot your password?</a>
            </p>

          {/* Navigate to register page */}
          <button
              onClick={handleRegisterNavigation}
              className="ml-56 h-7 w-28 mt-4  text-blue-900 rounded-full text-lg font-semibold font-garamond bg-[#dcedff] hover:bg-[#b7d3f0] transition">
          Or Register
        </button>
        </form>
      </div>
    </div>
    </div>
    );
};

export default Login;