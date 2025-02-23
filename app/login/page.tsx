'use client';
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { signIn } from "next-auth/react"
import Image from 'next/image';

const Login = () => {
    // Initialize the username and password state as blank
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    //Initialize the router
    const router = useRouter();

    async function handleGoogleLogin(e: React.FormEvent){
        e.preventDefault();
        await signIn('google')
        router.push('/');
    }

    // Handle the login
    async function handleLogin(e: React.FormEvent){
        e.preventDefault();
        console.log('Logging in user as: ', username);
        router.push('/');
    }

    return (
      //absolute inset-0 bg-black opacity-50 
      <div className="flex items-center justify-center min-h-screen bg-cover bg-center bg-[url('/freedomtrail_medallion.jpg')] " > 
      <div className="bg-[#DCEDFF] bg-opacity-20 backdrop-blur-lg p-8 rounded-3xl w-96 ">
        <h2 className="text-4xl font-bold text-center text-blue-900 mb-6 font-garamond">Sign in</h2>
        
        <form onSubmit={handleLogin} className="flex flex-col">
          <label className="text-blue-900 font-garamond font-extrabold mb-2">Email:</label>
          <input
            type="email"
            placeholder=""
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full p-3 rounded-full bg-[#2F1000] bg-opacity-50 text-white focus:outline-none mb-4"
            required
          />

          <label className="text-blue-900 font-garamond font-extrabold mb-2">Password:</label>
          <input
            type="password"
            placeholder=""
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 rounded-full bg-[#2F1000] bg-opacity-50 text-white focus:outline-none mb-6"
            required
          />

          {/* Google Sign-In Button */}
          <button onClick={handleGoogleLogin} className="flex items-center justify-center bg-white text-black p-2 rounded-full shadow-md mb-4">
              <Image src="/google.png" alt="Google Logo" width={24} height={24} className="mr-2" />
              Sign in with Google
          </button>

          {/* Login Button */}
          <button type="submit" className="bg-blue-900 text-white p-3 rounded-full text-lg font-semibold font-garamond hover:bg-blue-800 transition">
            Start your tour
          </button>
        </form>

        {/* Forgot Password */}
        <p className="text-center text-blue-900 font-garamond font-semibold mt-4">
          <a href="#" className="underline">Forgot your password?</a>
        </p>
      </div>
    </div>
    );
};

export default Login;