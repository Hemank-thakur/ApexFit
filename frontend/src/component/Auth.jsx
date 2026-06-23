import React, { useState } from 'react'
import axios from 'axios'
import { FaDumbbell, FaLock, FaEnvelope, FaUser } from 'react-icons/fa'

function Auth({ onAuthSuccess }) {
    const [isLogin, setIsLogin] = useState(true)
    const [username, setUsername] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        if (!isLogin && password !== confirmPassword) {
            setError("Passwords do not match");
            setLoading(false);
            return;
        }

        const endpoint = isLogin 
            ? "http://localhost:4002/auth/v1/login" 
            : "http://localhost:4002/auth/v1/signup";
        
        const payload = isLogin 
            ? { email, password } 
            : { username, email, password };

        try {
            const res = await axios.post(endpoint, payload);
            if (res.status === 200 || res.status === 201) {
                const { token, user } = res.data;
                localStorage.setItem("token", token);
                localStorage.setItem("user", JSON.stringify(user));
                onAuthSuccess(token, user);
            }
        } catch (err) {
            console.error("Auth error details:", err);
            if (err.response && err.response.data && err.response.data.error) {
                setError(err.response.data.error);
            } else {
                setError("Something went wrong. Please check if the server is running.");
            }
        }
        setLoading(false);
    }

    return (
        <div className="min-h-screen bg-[#070708] flex items-center justify-center p-4 font-sans text-white relative overflow-hidden">
            {/* Glowing background circles for glassmorphism */}
            <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-emerald-500/10 rounded-full blur-[100px] pointer-events-none"></div>
            <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-emerald-600/5 rounded-full blur-[120px] pointer-events-none"></div>

            <div className="w-full max-w-md bg-[#0c0c0e]/80 border border-[#1f1f23] rounded-2xl p-8 shadow-2xl backdrop-blur-md relative z-10 transition-all duration-300">
                
                {/* Brand Header */}
                <div className="flex flex-col items-center mb-8 text-center">
                    <div className="bg-gradient-to-tr from-[#39ff14] to-emerald-500 p-3 rounded-2xl text-black font-bold mb-3 shadow-lg shadow-emerald-500/15">
                        <FaDumbbell size={24} />
                    </div>
                    <h2 className="text-2xl font-bold tracking-tight text-white">ApexFit</h2>
                    <p className="text-xs text-emerald-400 font-semibold uppercase tracking-wider mt-1">Coaching Platform</p>
                </div>

                {/* Tabs */}
                <div className="flex bg-[#141417] border border-[#1f1f23] rounded-lg p-1 mb-6">
                    <button
                        onClick={() => { setIsLogin(true); setError(""); }}
                        className={`flex-1 py-2 rounded-md text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer ${
                            isLogin 
                                ? "bg-emerald-500 text-black shadow-md" 
                                : "text-gray-400 hover:text-white"
                        }`}
                    >
                        Sign In
                    </button>
                    <button
                        onClick={() => { setIsLogin(false); setError(""); }}
                        className={`flex-1 py-2 rounded-md text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer ${
                            !isLogin 
                                ? "bg-emerald-500 text-black shadow-md" 
                                : "text-gray-400 hover:text-white"
                        }`}
                    >
                        Sign Up
                    </button>
                </div>

                {/* Error Banner */}
                {error && (
                    <div className="mb-5 px-4 py-2.5 bg-red-500/10 border border-red-500/20 text-red-400 rounded-lg text-xs font-semibold leading-relaxed">
                        {error}
                    </div>
                )}

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-4">
                    {!isLogin && (
                        <div>
                            <label className="text-[10px] text-gray-400 uppercase font-semibold block mb-1">Username</label>
                            <div className="flex items-center gap-2.5 bg-[#141417] border border-[#232329] focus-within:border-emerald-500/50 rounded-xl px-3.5 py-2.5 transition-colors">
                                <FaUser className="text-gray-500" size={14} />
                                <input
                                    type="text"
                                    className="bg-transparent outline-none flex-1 text-sm text-white placeholder-gray-600"
                                    placeholder="Enter your username"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    required
                                />
                            </div>
                        </div>
                    )}

                    <div>
                        <label className="text-[10px] text-gray-400 uppercase font-semibold block mb-1">Email Address</label>
                        <div className="flex items-center gap-2.5 bg-[#141417] border border-[#232329] focus-within:border-emerald-500/50 rounded-xl px-3.5 py-2.5 transition-colors">
                            <FaEnvelope className="text-gray-500" size={14} />
                            <input
                                type="email"
                                className="bg-transparent outline-none flex-1 text-sm text-white placeholder-gray-600"
                                placeholder="name@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <label className="text-[10px] text-gray-400 uppercase font-semibold block mb-1">Password</label>
                        <div className="flex items-center gap-2.5 bg-[#141417] border border-[#232329] focus-within:border-emerald-500/50 rounded-xl px-3.5 py-2.5 transition-colors">
                            <FaLock className="text-gray-500" size={14} />
                            <input
                                type="password"
                                className="bg-transparent outline-none flex-1 text-sm text-white placeholder-gray-600"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    {!isLogin && (
                        <div>
                            <label className="text-[10px] text-gray-400 uppercase font-semibold block mb-1">Confirm Password</label>
                            <div className="flex items-center gap-2.5 bg-[#141417] border border-[#232329] focus-within:border-emerald-500/50 rounded-xl px-3.5 py-2.5 transition-colors">
                                <FaLock className="text-gray-500" size={14} />
                                <input
                                    type="password"
                                    className="bg-transparent outline-none flex-1 text-sm text-white placeholder-gray-600"
                                    placeholder="••••••••"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    required
                                />
                            </div>
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-3 bg-emerald-500 hover:bg-emerald-400 disabled:bg-gray-800 text-black text-sm font-bold uppercase tracking-wider rounded-xl transition-all duration-200 shadow-lg shadow-emerald-500/15 cursor-pointer hover:shadow-emerald-500/25 mt-4"
                    >
                        {loading 
                            ? (isLogin ? "Signing In..." : "Signing Up...") 
                            : (isLogin ? "Sign In" : "Get Started")
                        }
                    </button>
                </form>
            </div>
        </div>
    )
}

export default Auth
