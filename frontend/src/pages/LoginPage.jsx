import { useState } from "react";
import { useAuthStore } from "../store/useAuthStore";

import { Link } from "react-router-dom";
import { Eye, EyeOff, Loader2, Lock, Mail, MessageSquare } from "lucide-react";

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const { login, isLoggingIn } = useAuthStore();

  const handleSubmit = async (e) => {
    e.preventDefault();
    login(formData);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50">
      <div className="container mx-auto px-4 py-12">
        <div className="flex flex-col lg:flex-row rounded-2xl overflow-hidden shadow-2xl bg-white">
          {/* Left Side - Form */}
          <div className="w-full lg:w-1/2 p-8 sm:p-12 flex flex-col justify-center">
            <div className="max-w-md mx-auto w-full">
              {/* Logo & Header */}
              <div className="text-center mb-10">
                <div className="flex flex-col items-center gap-3">
                  <div className="w-14 h-14 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 flex items-center justify-center shadow-lg">
                    <MessageSquare className="w-6 h-6 text-white" />
                  </div>
                  <h1 className="text-3xl font-bold text-gray-900 mt-3">Welcome Back</h1>
                  <p className="text-gray-500">Sign in to continue your journey</p>
                </div>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-1">
                  <label className="block text-sm font-medium text-gray-700">Email</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="email"
                      className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg bg-gray-50 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all text-black"
                      placeholder="you@example.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="block text-sm font-medium text-gray-700">Password</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type={showPassword ? "text" : "password"}
                      className="block w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg bg-gray-50 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all text-black"
                      placeholder="••••••••"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center hover:text-purple-600 transition-colors"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                      ) : (
                        <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                      )}
                    </button>
                  </div>
                  <div className="flex justify-end text-sm">
                    <Link to="/forgot-password" className="text-purple-600 hover:text-purple-800 font-medium">
                      Forgot password?
                    </Link>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-all duration-300"
                  disabled={isLoggingIn}
                >
                  {isLoggingIn ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin mr-2" />
                      Signing in...
                    </>
                  ) : (
                    "Sign in"
                  )}
                </button>
              </form>

              {/* Social Login */}
              <div className="mt-6">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300"></div>
                  </div>
                  
                </div>

                
              </div>

              <div className="mt-8 text-center text-sm text-gray-500">
                <p>
                  Don't have an account?{" "}
                  <Link to="/signup" className="font-medium text-purple-600 hover:text-purple-800">
                    Sign up
                  </Link>
                </p>
              </div>
            </div>
          </div>

          {/* Right Side - Image/Pattern */}
          <div className="hidden lg:block w-1/2 bg-gradient-to-br from-purple-600 to-indigo-700">
            <div className="h-full flex flex-col justify-center items-center p-12 text-white">
              <div className="max-w-md">
                <h2 className="text-4xl font-bold mb-4">Welcome back!</h2>
                <p className="text-lg text-purple-100 mb-8">
                  Sign in to continue your conversations and catch up with your messages.
                </p>
                <div className="flex space-x-4">
                  <div className="w-12 h-12 rounded-full bg-purple-500/20 flex items-center justify-center">
                    <MessageSquare className="w-6 h-6" />
                  </div>
                  <div className="w-12 h-12 rounded-full bg-purple-500/20 flex items-center justify-center">
                    <Mail className="w-6 h-6" />
                  </div>
                  <div className="w-12 h-12 rounded-full bg-purple-500/20 flex items-center justify-center">
                    <Lock className="w-6 h-6" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;