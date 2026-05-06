'use client';

import React, { useState } from 'react';
import { X, Mail, Lock, User, AlertCircle, Loader } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const { signUp, signIn, signInWithGoogle } = useAuth();
  const [mode, setMode] = useState<'choice' | 'signin' | 'signup'>('choice');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [googleLoading, setGoogleLoading] = useState(false);

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (!fullName.trim()) {
        setError('Please enter your full name');
        setLoading(false);
        return;
      }
      if (password.length < 6) {
        setError('Password must be at least 6 characters');
        setLoading(false);
        return;
      }
      await signUp(email, password, fullName);
      onClose();
      resetForm();
    } catch (err: any) {
      const errorMessage = err?.message || 'An error occurred. Please try again.';
      if (errorMessage.includes('already registered')) {
        setError('This email is already registered. Please sign in instead.');
      } else if (errorMessage.includes('invalid')) {
        setError('Please check your email and password.');
      } else {
        setError(errorMessage);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await signIn(email, password);
      onClose();
      resetForm();
    } catch (err: any) {
      const errorMessage = err?.message || 'An error occurred. Please try again.';
      if (errorMessage.includes('Invalid login credentials')) {
        setError('Email or password is incorrect. Please try again or create a new account.');
      } else if (errorMessage.includes('Email not confirmed')) {
        setError('Please confirm your email before signing in. Check your inbox.');
      } else {
        setError(errorMessage);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError('');
    setGoogleLoading(true);
    try {
      await signInWithGoogle();
    } catch (err: any) {
      setError('Google sign-in failed. Please try again.');
    } finally {
      setGoogleLoading(false);
    }
  };

  const resetForm = () => {
    setEmail('');
    setPassword('');
    setFullName('');
    setError('');
    setMode('choice');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-[#1B2A1F] rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
        {/* Header */}
        <div className="green-gradient px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-white">
            {mode === 'choice' ? 'Join RecipeCloud' : mode === 'signin' ? 'Sign In' : 'Create Account'}
          </h2>
          <button
            onClick={() => {
              onClose();
              resetForm();
            }}
            className="text-white hover:opacity-80 transition-opacity"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Choice Screen */}
          {mode === 'choice' && (
            <div className="space-y-4">
              <p className="text-center text-gray-600 dark:text-gray-300 mb-6">
                Choose how you want to join our community
              </p>

              {/* Google Sign In */}
              <button
                onClick={handleGoogleSignIn}
                disabled={googleLoading}
                className="w-full flex items-center justify-center gap-3 px-4 py-3 border-2 border-[#4CAF50] text-[#2E7D32] dark:text-[#A5D6A7] rounded-lg hover:bg-[#F1F8F4] dark:hover:bg-[#2E3D2F] transition-colors font-semibold disabled:opacity-50"
              >
                {googleLoading ? (
                  <>
                    <Loader size={20} className="animate-spin" />
                    <span>Connecting...</span>
                  </>
                ) : (
                  <>
                    <span className="text-xl">🔐</span>
                    <span>Continue with Google</span>
                  </>
                )}
              </button>

              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-[#C8E6C9] dark:border-[#4CAF50]/30"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white dark:bg-[#1B2A1F] text-gray-500 dark:text-gray-400">
                    Or continue with email
                  </span>
                </div>
              </div>

              {/* Email/Password Options */}
              <button
                onClick={() => setMode('signin')}
                className="w-full px-4 py-3 bg-[#E8F5E9] dark:bg-[#2E3D2F] text-[#2E7D32] dark:text-[#A5D6A7] rounded-lg hover:bg-[#D4EDDA] dark:hover:bg-[#384d3a] transition-colors font-semibold border border-[#C8E6C9] dark:border-[#4CAF50]/30"
              >
                Sign In with Email
              </button>

              <button
                onClick={() => setMode('signup')}
                className="w-full px-4 py-3 green-gradient text-white rounded-lg hover:opacity-90 transition-opacity font-semibold"
              >
                Create Account with Email
              </button>
            </div>
          )}

          {/* Sign In Form */}
          {mode === 'signin' && (
            <form onSubmit={handleSignIn} className="space-y-4">
              {error && (
                <div className="flex gap-3 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                  <AlertCircle size={20} className="text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-[#2E7D32] dark:text-[#A5D6A7] mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <Mail size={18} className="absolute left-3 top-3 text-[#4CAF50]" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full pl-10 pr-4 py-2.5 border border-[#C8E6C9] dark:border-[#4CAF50]/30 rounded-lg bg-white dark:bg-[#2E3D2F] text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#4CAF50] focus:border-transparent"
                    disabled={loading}
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-[#2E7D32] dark:text-[#A5D6A7] mb-2">
                  Password
                </label>
                <div className="relative">
                  <Lock size={18} className="absolute left-3 top-3 text-[#4CAF50]" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-4 py-2.5 border border-[#C8E6C9] dark:border-[#4CAF50]/30 rounded-lg bg-white dark:bg-[#2E3D2F] text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#4CAF50] focus:border-transparent"
                    disabled={loading}
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full green-gradient text-white font-bold py-2.5 rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed mt-6"
              >
                {loading ? 'Signing In...' : 'Sign In'}
              </button>

              <div className="text-center pt-2">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Don't have an account?
                  <button
                    type="button"
                    onClick={() => {
                      setMode('signup');
                      setError('');
                    }}
                    disabled={loading}
                    className="ml-1 font-bold text-[#2E7D32] dark:text-[#A5D6A7] hover:underline disabled:opacity-50"
                  >
                    Create one
                  </button>
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  setMode('choice');
                  setError('');
                }}
                disabled={loading}
                className="w-full text-center text-sm text-[#5C7A61] dark:text-[#9DB5A3] hover:text-[#2E7D32] dark:hover:text-[#A5D6A7] py-2"
              >
                ← Back
              </button>
            </form>
          )}

          {/* Sign Up Form */}
          {mode === 'signup' && (
            <form onSubmit={handleSignUp} className="space-y-4">
              {error && (
                <div className="flex gap-3 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                  <AlertCircle size={20} className="text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-[#2E7D32] dark:text-[#A5D6A7] mb-2">
                  Full Name
                </label>
                <div className="relative">
                  <User size={18} className="absolute left-3 top-3 text-[#4CAF50]" />
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Chef Name"
                    className="w-full pl-10 pr-4 py-2.5 border border-[#C8E6C9] dark:border-[#4CAF50]/30 rounded-lg bg-white dark:bg-[#2E3D2F] text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#4CAF50] focus:border-transparent"
                    disabled={loading}
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-[#2E7D32] dark:text-[#A5D6A7] mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <Mail size={18} className="absolute left-3 top-3 text-[#4CAF50]" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full pl-10 pr-4 py-2.5 border border-[#C8E6C9] dark:border-[#4CAF50]/30 rounded-lg bg-white dark:bg-[#2E3D2F] text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#4CAF50] focus:border-transparent"
                    disabled={loading}
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-[#2E7D32] dark:text-[#A5D6A7] mb-2">
                  Password
                </label>
                <div className="relative">
                  <Lock size={18} className="absolute left-3 top-3 text-[#4CAF50]" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-4 py-2.5 border border-[#C8E6C9] dark:border-[#4CAF50]/30 rounded-lg bg-white dark:bg-[#2E3D2F] text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#4CAF50] focus:border-transparent"
                    disabled={loading}
                    required
                  />
                </div>
                <p className="text-xs text-[#5C7A61] dark:text-[#9DB5A3] mt-1">
                  Minimum 6 characters
                </p>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full green-gradient text-white font-bold py-2.5 rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed mt-6"
              >
                {loading ? 'Creating Account...' : 'Create Account'}
              </button>

              <div className="text-center pt-2">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Already have an account?
                  <button
                    type="button"
                    onClick={() => {
                      setMode('signin');
                      setError('');
                    }}
                    disabled={loading}
                    className="ml-1 font-bold text-[#2E7D32] dark:text-[#A5D6A7] hover:underline disabled:opacity-50"
                  >
                    Sign in
                  </button>
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  setMode('choice');
                  setError('');
                }}
                disabled={loading}
                className="w-full text-center text-sm text-[#5C7A61] dark:text-[#9DB5A3] hover:text-[#2E7D32] dark:hover:text-[#A5D6A7] py-2"
              >
                ← Back
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
