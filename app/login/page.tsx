'use client';
import { useRouter } from "next/navigation";
import { useState } from "react";

const login = () => {
    // Initialize the username and password state as blank
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    //Initialize the router
    const router = useRouter();


    // Handle the login
    async function handleLogin(e: React.FormEvent){
        e.preventDefault();
        console.log('Logging in user as: ', username);
        router.push('/');
    }

    // Handle the login
    async function handleRegisterNavigation(e: React.FormEvent){
      e.preventDefault();
      console.log('Navigating to registration form.');
      router.push('/register');
  }

    return (
      //absolute inset-0 bg-black opacity-50 
      <div className="flex items-center justify-center min-h-screen bg-cover bg-center bg-[url('/freedomtrail_medallion.jpg')] " > 
      <div className="bg-[#DCEDFF] bg-opacity-20 backdrop-blur-lg p-8 rounded-3xl w-96 ">
        <h2 className="text-4xl font-bold text-center text-blue-900 mb-6 font-garamond">Sign in</h2>
        
        <form onSubmit={handleLogin} className="flex flex-col">
          <label className="text-blue-900 font-garamond text-2xl font-extrabold mb-2">Email:</label>
          <input
            type="email"
            placeholder=""
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full p-3 rounded-full bg-[#2F1000] bg-opacity-50 text-white focus:outline-none mb-4"
            required
          />

          <label className="text-blue-900 font-garamond text-2xl font-extrabold mb-2">Password:</label>
          <input
            type="password"
            placeholder=""
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 rounded-full bg-[#2F1000] bg-opacity-50 text-white focus:outline-none mb-6"
            required
          />

          {/* Google Sign-In Button */}
          <button className="flex items-center justify-center bg-white hover:bg-slate-300 text-black p-2 rounded-full shadow-md mb-4">
            <img src="google.png" alt="Google Logo" className="w-6 h-6 mr-2" />
            Sign in with Google
          </button>

          {/* Login Button */}
          <button type="submit" className="bg-blue-900 text-white p-3 rounded-full text-2xl font-semibold font-garamond hover:bg-blue-800 transition">
            Start your tour
          </button>
        </form>

        {/* Forgot Password */}
        <p className="text-center text-blue-900 font-garamond font-semibold mt-4">
          <a href="#" className="underline">Forgot your password?</a>
        </p>

        {/* Navigate to register page */}
        <button 
        onClick={handleRegisterNavigation} 
        className="ml-24 h-7 w-28 mt-4  text-blue-900 rounded-full text-lg font-semibold font-garamond bg-[#dcedff] hover:bg-[#b7d3f0] transition">
          Or Register
        </button>
      </div>
    </div>
    );
};

export default login;